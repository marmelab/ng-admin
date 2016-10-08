# Customizing the API Mapping

All HTTP requests made by ng-admin to your REST API are carried out by [Restangular](https://github.com/mgonto/restangular), which is like `$resource` on steroids.

The REST specification doesn't provide enough detail to cover all requirements of an administration GUI. ng-admin makes some assumptions about how your API is designed. All of these assumptions can be overridden by way of [Restangular's request and response interceptors](https://github.com/mgonto/restangular#addresponseinterceptor).

That means you don't need to adapt your API to ng-admin; ng-admin can adapt to any REST API, thanks to the flexibility of Restangular.

## Entry Format

Ng-admin expects that requests for a single entity return a JSON object with all the properties defined as fields. For instance, for the following definition:

```js
var bookEntity = nga.entity('books');
bookEntity.editionView()
    .fields([
        nga.field('name'), 
        nga.field('author_id', 'reference')
            .label('Author')
            .targetEntity(author)
            .targetField(nga.field('name')),
        nga.field('publication_date', 'date')
    ]);
```

ng-admin expects the `GET http://your.api.domain/books/12` route to return a JSON response with a single object, containing at least the following properties:

```json
{
    "id": 12,
    "name": "War and Peace",
    "author_id": 345,
    "publication_date": "2014-01-01T00:00:00Z",
}
```

Additional properties not defined in the view are ignored.

Now if your API returns results in another format, for instance with all the values under a `values` key:

```json
{
    "values": {
        "id": 12,
        "name": "War and Peace",
        "author_id": 345,
        "publication_date": "2014-01-01T00:00:00Z"
    }
}
```

You can use Restangular **element transformers** to map that to the expected format:

```js
myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addElementTransformer('books', function(element) {
        for (var key in element.values) {
            element[key] = element.values[key];
        }

        return element;
    });
}]);
```

Symetrically, if your API requires that you post and put data inside of a `values` field, use a Restangular **request interceptor**:

```js
myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        if(operation == 'post' || operation == 'put') {
            element = { values: element };
        }
        return { element: element };
    });
}]);
```

**Tip**: If you want to define a field mapped to a deeply nested property, you don't need an interceptor. Just define the field with a name made by the path to the property using dots as separators:

```json
{
    "id": 12,
    "name": "War and Peace",
    "author": {
        "id": 345,
        "name": "Leo Tolstoi"
    },
    "publication_date": "2014-01-01T00:00:00Z"
}
```

```js
listView.fields([
    nga.field('name'),
    nga.field('author.name')
])
```

## Custom Headers, Authentication

Does your API require an authentication header? Restangular has got you covered with [`setDefaultHeaders`](https://github.com/mgonto/restangular#setdefaultheaders):

```js
myApp.config(['RestangularProvider', function(RestangularProvider) {
    var login = 'admin',
        password = '53cr3t',
        token = window.btoa(login + ':' + password);
    RestangularProvider.setDefaultHeaders({'Authorization': 'Basic ' + token});
}]);
```

## HTTP Method

The REST standard suggests using the POST method to create a new resource, and PUT to update it. If your API uses a different verb for a given action (e.g. PATCH), then you can force the method to be used for a given entity with `createMethod()` and `updateMethod()`. The method name should be in lowercase.

```js
bookEntity.createMethod('put');   // default is 'post'
bookEntity.updateMethod('patch'); // default is 'put'
```

## Pagination

ng-admin assumes that your API accepts `_page` and `_perPage` query parameters to paginate lists:

http://your.api.domain/entityName?_page=2&_perPage=20

For instance, to use `offset` and `limit` instead of `_page` and `_perPage` across the entire application, use the following code:

```js
myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        if (operation == 'getList' && what == 'entityName') {
            params.offset = (params._page - 1) * params._perPage;
            params.limit = params._perPage;
            delete params._page;
            delete params._perPage;
        }
        return { params: params };
    });
}]);
```

The default number of items per page is `30`. You can customize it with the `perPage()` method of the listView.

For each list view, the API should should return all items as an array at the root of the response.

```
GET /entityName?_page=2&_perPage=20 HTTP1.1

HTTP/1.1 200 OK
X-Total-Count: 66
Content-Type: application/json
[
  { date: "2014-01-01T00:00:00Z", "name": "foo", "age": 8 },
  { date: "2014-02-01T00:00:00Z", "name": "bar", "age": 12 },
  { date: "2014-03-01T00:00:00Z", "name": "baz", "age": 4 },
  ...
]
```

## Total Number of Results 

To know how many items to paginate through, ng-admin retrieves the total count from the `X-Total-Count` header (see example above). That's what's used to build up the pagination controls. For instance, based on the request and response from the example above (page 2, 20 items per page, 66 items in total), the pagination controls will look like:

        <previous  1  [2]  3  4  next>

If your API doesn't return a `X-Total-Count` header, you can add a `totalCount` property to the `response` object using a Restangular response interceptor. For instance, for a rfc7233-compliant API returning pagination data using a `Content-Range` header:

    Content-range: entities 21-40/66  

Add the following response interceptor:

```js
myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
        if (operation == "getList") {
            var contentRange = response.headers('Content-Range');
            response.totalCount = contentRange.split('/')[1];
        }
        return data;
    });
}]);
```

**Tip**: If you added the `X-Total-Count` header to your API but the pagination controls don't appear, maybe it's a [cross-origin resource sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) problem. The admin application is probably hosted on another domain than the API, so you must explicitly allow the access to the header from the admin app domain. To do so, add a `Access-Control-Expose-Headers: x-total-count` header to the API response.

## Sort Columns and Sort Order

To sort each list view, ng-admin uses `_sortField` & `_sortDir` query parameters.

http://your.api.domain/entityName?_sortField=name&_sortDir=ASC

Once again, you can change it with a response interceptor. For instance, to sort by `id desc` by default, and without changing the name of the sort query parameters, use:

```js
myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        if (operation == 'getList' && what == 'entityName') {
            params._sortField = params._sortField || 'id';
            params._sortDir = params._sortDir || 'DESC';
        }
        return { params: params };
    });
}]);
```

## Filtering

All filter fields are added as a serialized object passed as the value of the `_filters` query parameter. For instance, the following `filterView()` configuration:

```js
myEntity.filterView()
    .fields([
        nga.field('q').label('').attributes({ placeholder: 'Full text' }),
        nga.field('tag')
    ]);
```

...will lead to API calls formatted like the following:

http://your.api.domain/entityName?_filters=%7b%22q%22%3a%22foo%22%2c%22tag%22%3a%22bar%22%7d

Where the `_filters` value is the url encoded version of `{"q":"foo","tag":"bar"}`.

Just like other query params, you can transform it using a Restangular request interceptor. For instance, to pass all filters directly as query parameters:

```js
myApp.config(['RestangularProvider', function(RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        if (operation == 'getList' && what == 'entityName') {
            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);
```

Now, the API call URLs will look like:

http://your.api.domain/entityName?q=foo&tag=bar

## Nested Relationships Urls

By default, ng-admin uses filters to fetch entities related to another one. For instance, to fetch all the `comments` related to the `post` entity #123, ng-admin calls the following url:

```
http://[baseApiUrl]/comments?filters={"post_id":123}
```

Some API servers only support a special type of URL for that case:

```
http://[baseApiUrl]/posts/123/comments
```

Restangular doesn't allow to modify the URL of an outgoing request (see [Restangular issue #603](https://github.com/mgonto/restangular/issues/603)), so in order to achieve that you must use an interceptor on the `$http` Angular service.

```js
myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            request: function(config) {
                // test for /comments?filters={post_id:XXX}
                if (/\/comments$/.test(config.url) && config.params.filters && config.params.filters.post_id) {
                    config.url = config.url.replace('comments', 'posts/' + config.params.filters.post_id + '/comments');
                    delete config.params.filters.post_id;
                }
                return config;
            },
        };
    });
}]);
```

## Identifier

ng-admin assumes that the identifier name of your entities is `id`.
You can change it with the `identifier()` method of the entity.

```js
var post = nga.entity('posts')
    .identifier(nga.field('_id'));
```

## Date

The default date field format is `yyyy-MM-dd`. You can change it with the `format()` method in fields of type `date`.
```js
nga.field('publication_date', 'date').format('dd MM yyyy')
```
