# Frequently Asked Questions

* [My API exposes X-Total-Count but ng-admin doesn't see it](#my-api-exposes-x-total-count-but-ng-admin-doesnt-see-it)
* [My API requires Authentication. How Can I Set it up?](#my-api-requires-authentication-how-can-i-set-it-up)
* [How Can I Display A Composite Field?](#how-can-i-display-a-composite-field)
* [How Can I Map Twice The Same Field In A List?](#how-can-i-map-twice-the-same-field-in-a-list)

## My API exposes X-Total-Count but ng-admin doesn't see it

If you added the `X-Total-Count` header to your API but the pagination controls don't appear, maybe it's a [cross-origin resource sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) problem. 

The admin application is probably hosted on another domain than the API, so you must explicitly allow the access to the header from the admin app domain. To do so, add a `Access-Control-Expose-Headers: x-total-count` header to the API response.

## My API requires Authentication. How Can I Set it up?

Many API require some sort of authentication, for instance Basic HTTP Authentication, which only accepts requests to the API including an `Authorization` header looking like:

```
Authorization Basic YWRtaW46cGFzc3dvcmQ=
```

...where the token after `Basic` is `base64(username + ':' + password)`.

To add such a token, you must modify the default headers in Restangular, as explained in the [API Mapping](API-mapping.md) documentation.

```js
myApp.config(function(RestangularProvider) {
    var login = 'admin',
        password = '53cr3t',
        token = window.btoa(login + ':' + password);
    RestangularProvider.setDefaultHeaders({'Authorization': 'Basic ' + token});
});
```

If the login and password must be entered by the end user, it's up to you to ask for login and password in another page, store them in `localStorage`/`sessionStorage`, change the location to ng-admin's app, and grab the login and password from storage when ng-admin is initialized.

## How Can I Display A Composite Field?

If your API sends users with a `firstName` and a `lastName`, you may want to compose these properties into a composite field.

```json
{
    "id": 123,
    "firstName": "Leo",
    "lastName": "Tolstoi",
    "occupation": "writer"
}
```

That's quite easy: create a field with the name of a non-existing property, and use `Field.map(value, entry)` to do so:

```js
user.listView().fields([
    nga.field('id'),
    nga.field('fullname')
        .map(function(value, entry) {
            // value is undefined since there is no entry.fullname
            // entry contains the entire set of properties
            return entry.firstName + ' ' + entry.lastName;
        })
])
```

## How Can I Map Twice The Same Field In A List?

If your API sends a piece of data that you want to display twice in a different way, you may hit a wall. For instance:

```js
post.listView().fields([
    nga.field('id'),
    nga.field('user_id', 'reference')
        .label('Author first name')
        .targetEntity(user)
        .targetField(nga.field('firstName'),
    nga.field('user_id', 'reference')
        .label('Author last name')
        .targetEntity(user)
        .targetField(nga.field('lastName'),
```

This doesn't work, because ng-amin imposes a unicity constraint on field names. Since there a are two fields names `user_id`, it's a blocker. 

The solution is to duplicate the property in an `ElementTransformer`:

```js
myApp.config(function(RestangularProvider) {
    RestangularProvider.addElementTransformer('posts', function(element) {
        element.user_id_2 = element.user_id;
        return element;
    });
});
```

Now you can have two fields with the same falue but different names:

```js
post.listView().fields([
    nga.field('id'),
    nga.field('user_id', 'reference')
        .label('Author first name')
        .targetEntity(user)
        .targetField(nga.field('firstName'),
    nga.field('user_id_2', 'reference')
        .label('Author last name')
        .targetEntity(user)
        .targetField(nga.field('lastName'),
```
