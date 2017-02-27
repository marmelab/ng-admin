# Field Configuration

A field is the representation of a property of an entity.

* [General Field Settings](#general-field-settings)
* `string` Field Type
* `text` Field Type
* [`wysiwyg` Field Type](#wysiwyg-field-type)
* `password` Field Type
* `email` Field Type
* [`date` Field Type](#date-field-type)
* [`datetime` Field Type](#datetime-field-type)
* [`number` Field Type](#number-field-type)
* `float` Field Type
* [`boolean` Field Type](#boolean-field-type)
* [`choice` and `choices` Field Types](#choice-and-choices-field-types)
* `json` Field Type
* [`file` Field Type](#file-field-type)
* [`reference` Field Type](#reference-field-type)
* [`referenced_list` Field Type](#referenced-list-field-type)
* [`embedded_list` Field Type](#embedded-list-field-type)
* [`reference_many` Field Type](#reference-many-field-type)

## General Field Settings

* `nga.field(name, type)`
Create a new field of the given type. Default type is 'string', so you can omit it. Bundled types include `string`, `text`, `wysiwyg`, `password`, `email`, `date`, `datetime`, `number`, `float`, `boolean`, `choice`, `choices`, `json`, `file`, `reference`, `referenced_list`, `embedded_list` and `reference_many`.

    The name may use the *dot notation* to map a nested property. For instance, is the REST endpoint for comments answers as follow:

        GET /comments/123
        {
            "id": 123,
            "author": "Alice",
            "body": "Lorem ipsum sic dolor amet...",
            "post": {
                "title": "Consectetur adipisicing elit",
                "body": "Sed do eiusmod...",
            }
        }

    Then you can reference the fields nested under the `post` property by prefixing them with "`post.`", as follows:

        comment.listView().fields([
            nga.field('id'),
            nga.field('author'),
            nga.field('body'),
            nga.field('post.title'), // dot notation
            nga.field('post.body'),  // dot notation
        ])

* `label(string label)`
Define the label of the field. Defaults to the uppercased field name.

* `editable(boolean)`
Define if the field is editable in the edition form. Useful to display a field without allowing edition (e.g for creation date).

* `sortable(boolean)`
Define if the field is sortable in the list view (default `true`).
(See ["Sort Columns and Sort Order"](../API-mapping.md#sort-columns-and-sort-order) for a discussion of how to integrate `ng-admin` sorting with your REST backend.)

* `order(number|null)`
Define the position of the field in the view.

* `isDetailLink(boolean)`
Tell if the value is a link in the list view. Defaults to true for the identifier and references field, false otherwise. The link points to the edition view, except for read-only entities, where it points to the show view.

* `detailLinkRoute(string)`
Define the route for a link in the list view, i.e. `isDetailLink` of the field is true. The default is `edit`, hence the link points to the edition view. The other option is `show` to point to the show view.

* `map(function)`
Define a custom function to transform the value received from the API response to the value displayed in the admin. This function receives 2 parameters: the value to transform, and the corresponding entry. Works in list, edit views and references.

        nga.field('characters')
            .map(function truncate(value, entry) {
                return value + '(' + entry.values.subValue + ')';
            });

    Multiple `map` can be defined for a field:

        nga.field('comment')
            .map(stripTags)
            .map(truncate);

* `transform(function)`
Define a custom function to transform the value displayed in the admin back to the one expected by the API. This function receives 2 parameters: the value to transform, and the corresponding entry. Used in edit view only. Use it in conjunction with `map()` to ease the conversion between the API response format and the format you want displayed on screen.

        //           API
        //   map()  v  ^  transform()
        //          Entry︎
        //
        // The API provides and expects last names in all caps, e.g. 'DOE'
        // The admin should display them with capitalized last names, e.g 'Doe'
        nga.field('last_name')
            .map(function capitalize(value, entry) {
                return value.substr(0,1).toUpperCase() + value.substr(1).toLowerCase()
            })
            .transform(function allCaps(value, entry) {
                // the API expects upper case last names
                return value.toUpperCase();
            });

* `attributes(object)`
A list of attributes to be added to the corresponding field.

        nga.field('title').attributes({ placeholder: 'fill me !' })

* `validation(object)`
Set field validation rules. Based on Angular's form validation features.
 - `required`: boolean *Required boolean fields will render as checkbox for edition*
 - `minlength`: number
 - `maxlength`: number
 - `pattern`: regular expression
 - `validator`: function

        nga.field('username')
            .attributes({ placeholder: 'No space allowed, 5 chars min' })
            .validation({ required: true, pattern: '[A-Za-z0-9\.\-_]{5,20}' }),
        nga.field('website')
            .validation({ validator: function(value) {
                if (value.indexOf('http://') !== 0) throw new Error ('Invalid url in website');
            } })

* `cssClasses(String|Function)`
A list of CSS classes to be added to the corresponding field. If you provide a function, it will receive the current entry as first argument, to allow dynamic classes according to values. The function will also be called without entry for table headers.

        nga.field('title')
            .cssClasses(function(entry) {
                if (entry) {
                    return entry.values.needsAttention ? 'bg-warning' : '';
                }

                return 'my-custom-css-class-for-list-header';
            });

* `template(String|Function, templateIncludesLabel=false)`
All field types support the `template()` method, which makes it easy to customize the look and feel of a particular field, without sacrificing the native features.

    For instance, if you want to customize the appearance of a `NumberField` according to its value:

        listview.fields([
            nga.field('amount', 'number')
                .format('$0,000.00')
                .template('<span ng-class="{ \'red\': value < 0 }"><ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column></span>')
        ]);

    The template scope exposes the following variables:

    - `value`, `field`, `entry`, `entity`, and `datastore` in `listView` and `showView`
    - `value`, `field`, `values`, and `datastore` in filters
    - `value`, `field`, `entry`, `entity`, `form`, and `datastore` in `editionView` and `creationView`

    In `showView`, `editionView`, and `creationView`, the template zone covers only the field itself - not the label. To force the template to replace the entire line (including the label), pass `true` as second argument to the `template()` call. This can be very useful to conditionally hide a field according to a property of the entry:

        post.editionView()
            .fields([
                nga.field('category', 'choice')
                    .choices([
                        { label: 'Tech', value: 'tech' },
                        { label: 'Lifestyle', value: 'lifestyle' }
                    ]),
                nga.field('subcategory', 'choice')
                    .choices(function(entry) {
                        return subCategories.filter(function (c) {
                            return c.category === entry.values.category;
                        });
                    })
                    // display subcategory only if there is a category
                    .template('<ma-field ng-if="entry.values.category" field="::field" value="entry.values[field.name()]" entry="entry" entity="::entity" form="formController.form" datastore="::formController.dataStore"></ma-field>', true),
            ]);

    Most of the time, `template()` is used to customize the existing ng-admin directives (like `<ma-number-column>` in the previous example), for instance by decorating them. If you want to learn about these native directives, explore the [column](../src/javascripts/ng-admin/crud/column), [field](../src/javascripts/ng-admin/crud/field), and [fieldView](../src/javascripts/ng-admin/crud/fieldView) directories in ng-admin source.

* `defaultValue(*)`
Define the default value of the field in the creation form.

* `pinned(boolean)`
Whether the field should always appear. Used in filters (see listView Settings). Default to false.

## `wysiwyg` Field Type

* `stripTags(boolean)`
Enable removal of all HTML tags - only the text is kept. Useful for displaying rich text in a table, or before truncation. False by default.

* `sanitize(boolean)`
Enable HTML sanitization of WYSIWYG Editor value (removal of script tags, etc). True by default.

## `date` Field Type

Only dates represented by a string (e.g "2015-12-08") are handled by the `date` field type. For an API returning timestamps, add an element interceptor to convert the value to a string.

* `format(string ['yyyy-MM-dd' by default])`

This method uses the Angular `date` filter. Thus, as explained in the [Angular documentation](https://docs.angularjs.org/api/ng/filter/date), input date should be in a normalized format:

> Date to format either as Date object, milliseconds (string or number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is specified in the string input, the time is considered to be in the local timezone.

* `parse(function [remove hours, minutes and timezone by default])`
Filter applied to modify date object returned by date picker if needed.

## `datetime` Field Type

Only dates represented by a string (e.g "2015-12-08T23:00:00.000Z") are handled by the `datetime` field type. For an API returning timestamps, add an element interceptor to convert the value to a string.

* `format(string ['yyyy-MM-dd HH:mm:ss' by default])`

This method uses the Angular `date` filter. Thus, as explained in the [Angular documentation](https://docs.angularjs.org/api/ng/filter/date), input date should be in a normalized format:

> Date to format either as Date object, milliseconds (string or number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is specified in the string input, the time is considered to be in the local timezone.

* `parse(function [no change by default])`
Filter applied to modify date object returned by date picker if needed.

## `number` Field Type

* `format(string)`
Format for number to string conversion. Based on [Numeral.js](http://numeraljs.com/), which uses a syntax similar to Excel. You can configure the locale and create named formats by following [angular-numeraljs](https://github.com/baumandm/angular-numeraljs) instructions.

        nga.field('cost', 'number').format('$0,0.00');
        // now 1234.5 will render as '$1,234.50'

## `boolean` Field Type

A field of type `boolean` can have 3 values: true, false, or null. That's why the form widget for such a field is a dropdown and not a checkbox.

* `choices(array)`
Array of choices used for the boolean values. By default:

        [
            { value: null, label: 'undefined' },
            { value: true, label: 'true' },
            { value: false, label: 'false' }
        ]

    Override it with custom labels to fit your needs:

        nga.fields('power_user', 'boolean')
            .choices([
                { value: null, label: 'not yet decided' },
                { value: true, label: 'enabled' },
                { value: false, label: 'disabled' }
            ]);

* `filterChoices(array)`
Array of choices used for the boolean proposed values in a filter. By default:

        [
            { value: true, label: 'true' },
            { value: false, label: 'false' }
        ]

    Override it with custom labels to fit your needs:

    nga.fields('power_user', 'boolean')
        .filterChoices([
            { value: true, label: 'enabled' },
            { value: false, label: 'disabled' }
        ]);

## `choice` and `choices` Field Types

* `choices(array|function)`
Define array of choices for `choice` type.

    When given an array, each choice must be an object literal with both a value and a label.

        nga.field('currency', 'choice')
            .choices([
              { value: 'USD', label: 'dollar ($)' },
              { value: 'EUR', label: 'euro (€)' },
            ]);

    When given a function, the returned choice list must be in the same format (value and label) and can depend on the current entry. This is useful to allow choice fields dependent on each other.

        nga.field('country', 'choice')
            .choices([
              { value: 'FR', label: 'France' },
              { value: 'US', label: 'USA' },
            ]);
        var cities = [
            { country: 'FR', value: 'Paris', label: 'Paris' },
            { country: 'FR', value: 'Nancy', label: 'Nancy' },
            { country: 'US', value: 'NY', label: 'New York' },
            { country: 'US', value: 'SF', label: 'San Francisco' }
        ]
        nga.field('city', 'choice')
            .choices(function(entry) {
                return cities.filter(function (city) {
                    return city.country === entry.values.country
                });
            });

    *Tip*: When using a function for choice values, if you meet the "Uncaught Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!", that's because the `choices()` function returns a new array every time. That's a known AngularJS limitation (see the [infinite digest loop documentation](https://docs.angularjs.org/error/$rootScope/infdig)).

## `file` Field Type

* `uploadInformation`
Give upload information for `file` field type
 - `url`: url for server side upload
 - `accept`: values allowed by the standard HTML file input accept attribute
 - `apifilename`: filename assigned by the server and returned by your API.

If the uploaded file is renamed server-side, you can get the new filename from an api return.

    HTTP/1.1 200 OK
    Content-Type: application/json
    { "picture_name": "post_12_picture1.jpg"}

you can configure file field as :

    nga.field('picture', 'file').uploadInformation({ 'url': 'your_url', 'apifilename': 'picture_name' })

Some other properties are allowed, see https://github.com/danialfarid/ng-file-upload#upload-service for the complete list.

## `reference` Field Type

The `reference` type maps a many-to-one relationship where the entity contains a foreign key to another entity. For instance, if the REST API behaves as follows:

```
GET /comments/123
{
    "id": 123,
    "body": "Lorem ipsum sic dolor amet...",
    "post_id": 456 // foreign key to post of id 456
}

GET /posts/456
{
    "id": "456",
    "title": "Consectetur adipisicing elit",
    "body": "Sed do eiusmod..."
}
```

Then mapping the `post_id` property of the `comment` entity to a `reference` will tell ng-admin to fetch the related `post` entity, and to display the `targetField`.

```js
var post = nga.entity('posts');
var comment = nga.entity('comments');
comment.listView().fields([
    nga.field('post_id', 'reference')
        .targetEntity(post) // Select a target Entity
        .targetField(nga.field('title')) // Select the field to be displayed
]);
```

In a read context (`listView` and `showView`), `reference` fields render the targetField as text. In a write context (`creationView` and `editionView`), ` reference` fields render as a dropdown, allowing to select the related entity among a list using the ` targetField` as a representation. In that case, ng-admin fetches the possible values on the related entity, so a `reference` field makes an additional query in a write context:

```
GET /comments/123      <= get the main entity
{ "id": 123, "post_id": 456, ... },
GET /posts/456         <= get the referenced entity itself
GET /posts?_perPage=30 <= get the possible values for the referenced entity
```

The `reference` type specializes the `Field` type, so it supports the same `label`, `order`, `map`, `list` & `validation` options. Additional options are:

* `targetEntity(Entity)`
Define the referenced entity.

* `targetField(string)`
Define the target field used to retrieve the label of the referenced element.

        myView.fields([
            nga.field('post_id', 'reference')
                .label('Post content')
                .targetEntity(post)
                .targetField(nga.field('body')) // display the body instead of the title
                .map(truncate) // truncate the long body
        ]);

* `perPage(integer)`
Define the maximum number of related entities fetched and displayed in the dropdown of possible values in a write context. Defaults to 30.

* `sortField(String)`
Set the field used to sort the list displayed in the dropdown in a write context. Defaults to 'id'.

* `sortDir(String)`
Set the direction used to sort the list displayed in the dropdown in a write context. Defaults to 'DESC'.

* `remoteComplete([true|false], options = {})`
In write context, enable autocompletion by fetching remote results as the user types (disabled by default). When enabled, the `reference` widget fetches the results matching the string typed in the autocomplete input from the REST API.
When set to false, all references (in the limit of `perPage` parameter) are retrieved at view initialization.

        comments.editionView().fields([
            nga.field('id'),
            nga.field('post_id', 'reference')
                .targetEntity(post)
                .targetField(nga.field('title'))
                .remoteComplete(true) // populate choices from the response of GET /posts?title=XXX
        ]);

    Available options are:

    * `refreshDelay`: minimal delay between two API calls in milliseconds. By default: 500.
    * `searchQuery`: a function returning the parameters to add to the query string based on the input string.

            comments.editionView().fields([
                nga.field('id'),
                nga.field('post_id', 'reference')
                    .targetEntity(post)
                    .targetField(nga.field('title'))
                    .remoteComplete(true, {
                        refreshDelay: 300,
                        // populate choices from the response of GET /posts?q=XXX
                        searchQuery: function(search) { return { q: search }; }
                    })
                    .perPage(10) // limit the number of results to 10
            ]);

* `singleApiCall(function(entityIds) {}`
Group queries for the related entities in a `listView`. If that option isn't defined, adding a `reference` field in a `listView` triggers a query to the API for the related entity *for each row*.

        commentList.fields([
            nga.field('post_id', 'reference')
                .targetEntity(post)
                .targetField(nga.field('title'))
        ]);

        // will trigger the following queries
        GET /comments?_page=1
        [
          { "id": 123, "post_id": 456, ... },
          { "id": 124, "post_id": 457, ... },
          { "id": 125, "post_id": 458, ... },
        ]
        GET /posts/456
        { "id": 456, ... }
        GET /posts/457
        { "id": 457, ... }
        GET /posts/458
        { "id": 458, ... }

    On most configurations, multiplying the requests to the REST API like that will slow down the rendering of the list a great deal. To speed things up, you can group the calls to the related entities - provided the REST API supports filters for multiple values ("WHERE ... IN"). To do so, use `singleApiCall()` to format the request based on an array of ids.

        commentList.fields([
            nga.field('post_id', 'reference')
                .targetEntity(post)
                .targetField(nga.field('title'))
                .singleApiCall(function (postIds) {
                    return { 'post_id[]': postIds };
                })
        ]);

        // will trigger the following queries
        GET /comments?_page=1
        [
          { "id": 123, "post_id": 456, ... },
          { "id": 124, "post_id": 457, ... },
          { "id": 125, "post_id": 458, ... },
        ]
        GET /posts?post_id[]=456&post_id[]=457&post_id[]=458
        [
            { "id": 456, ... },
            { "id": 457, ... },
            { "id": 458, ... },
        ]

* `permanentFilters({ field1: value, field2: value, ...})`
Add filters to the referenced results list. This can be very useful to restrict the list of possible values displayed in a dropdown list. As such, it is only used in write context.

        comments.editionView().fields([
            nga.field('id'),
            nga.field('post_id', 'reference')
                .targetEntity(post)
                .targetField(nga.field('title'))
                .permanentFilters({
                    published: true // display only the published posts
                });
        ]);

        // will trigger the following queries
        GET /comments/123      <= get the main entity
        { "id": 123, "post_id": 456, ... }
        GET /posts/456         <= get the referenced entity itself
        GET /posts?_filters={"published":true} <= get the possible values for the referenced entity
        [
            { "id": 456, ... },
            { "id": 458, ... },
        ]

## `referenced_list` Field Type

The `referenced_list` type maps a one-to-many relationship where the foreign key is located in another entity. For instance, if the REST API behaves as follows:

```
GET /posts/456
{
    "id": "456",
    "title": "Consectetur adipisicing elit",
    "body": "Sed do eiusmod..."
}

GET /comments/123
{
    "id": 123,
    "author": "Alice",
    "body": "Lorem ipsum sic dolor amet...",
    "post_id": 456 // foreign key to post of id 456
}
GET /comments/124
{
    "id": 124,
    "author": "Bob",
    "body": "Lorem ipsum sic dolor amet...",
    "post_id": 456 // foreign key to post of id 456
}
```

Then mapping a `comments` property of the `post` entity to a `referenced_list` will tell ng-admin to fetch the related `comment` entities, and to display the result in a datagrid.

```js
var post = nga.entity('posts');
var comment = nga.entity('comments');
post.editionView().fields([
    nga.field('comments', 'referenced_list') // Define a 1-N relationship with the comment entity
        .targetEntity(comment) // Target the comment Entity
        .targetReferenceField('post_id') // Each comment with post_id = post.id (the identifier) will be displayed
        .targetFields([ // which comment fields to display in the datagrid
            nga.field('id').label('ID'),
            nga.field('body').label('Comment')
        ])
]);
```

As such, a `referenced_list` field is the opposite of a `reference` field. `referenced_list` fields are not editable (because the relationship is the other entity's responsibility), so they render the same in all contexts: as a datagrid. However, they are only useful in `showView` and `editionView` (you can't display a datagrid in a datagrid, so this excludes the `listView`, and you can't fetch related entities to a non-existent entity, so this excludes the `creationView`). For that field, ng-admin fetches the related entities in a single query with a filter:

```
GET /posts/456 <= get the main entity
GET /comments?_filters={"post_id":456}&_page=1 <= get the values for the referenced entity
```

The `referenced_list` type specializes the `Field` type, so it supports the same `label`, `order`, `map`, `list` & `validation` options. Additional options are:

* `targetEntity(Entity)`
Define the referenced entity.

* `targetReferenceField(string)`
Define the field name used to link the referenced entity.

* `targetFields(Array(Field))`
Define the list of fields of the target entity to be displayed in the datagrid.

        myEditionView.fields([
            nga.field('comments', 'referenced_list')
                .targetEntity(comment)
                .targetReferenceField('post_id')
                .targetFields([ // choose another set of fields
                    nga.field('author'),
                    nga.field('body')
                ])
        ]);

* `perPage(integer)`
Define the maximum number of related entities fetched and displayed in the datagrid. Defaults to 30.

* `sortField(String)`
Set the field used to sort the datagrid. Defaults to 'id'.

* `sortDir(String)`
Set the direction used to sort the datagrid. Defaults to 'DESC'.

* `permanentFilters({ field1: value, field2: value, ...})`
Filter the list of referenced entities list. This can be very useful to restrict the list of possible values displayed in the datagrid:

        post.editionView().fields([
            nga.field('comments', 'referenced_list')
                .targetEntity(comment)
                .targetReferenceField('post_id')
                .targetFields([
                    nga.field('id').label('ID'),
                    nga.field('body').label('Comment')
                ])
                .permanentFilters({
                    published: true // display only the published comments
                })
        ]);

        // will trigger the following queries
        GET /post/456      <= get the main entity
        { "id": 456, ... }
        GET /posts?_filters={"post_id":456,"published":true}&_page=1 <= get the possible values for the referenced entity
        [
            { "id": 123, "post_id": 456, ... },
            { "id": 124, "post_id": 456, ... },
        ]

## `embedded_list` Field Type

The `embedded_list` type maps a one-to-many relationship where the related entities are embedded in the main response. For instance, if the REST API behaves as follows:

```
GET /posts/1
{
    "id": "1",
    "title": "Consectetur adipisicing elit",
    "body": "Sed do eiusmod...",
    "comments": [
        {
            "author": "Alice",
            "body": "Lorem ipsum sic dolor amet...",
        },
        {
            "author": "Bob",
            "body": "Lorem ipsum sic dolor amet...",
        }
    ]
}
```

Then mapping a `comments` property of the `post` entity to an `embedded_list` will tell ng-admin to use the embedded `comment` entities.

```js
post.showView().fields([
    nga.field('comments', 'embedded_list') // Define a 1-N relationship with the (embedded) comment entity
        .targetFields([ // which comment fields to display in the datagrid / form
            nga.field('body')
        ])
]);
```

Ng-admin renders`embedded_list` fields as a datagrid in read context (`showView`), and as a list of embedded forms in write context (`creationView` and `editionView`). This won't issue any additional query to the REST API, since the related entities are already embedded.

The `embedded_list` type specializes the `Field` type, so it supports the same `label`, `order`, `map`, `list` & `validation` options. Additional options are:

* `targetFields(Array(Field))`
Define the list of fields of the target entity to be displayed in the datagrid.

        myEditionView.fields([
            nga.field('comments', 'embedded_list')
                .targetFields([ // choose another set of fields
                    nga.field('author'),
                    nga.field('body')
                ])
        ]);

* `sortField(String)`
Set the field used to sort the datagrid. Defaults to 'id'.

* `sortDir(String)`
Set the direction used to sort the datagrid. Defaults to 'DESC'.

* `targetEntity(Entity)`
Define the referenced entity (optional). When set, if the embedded entities have an identifier field, the `embedded_list` datagrid will be able to display links to the detail view of the entity. It is not used in write context.

        var post = nga.entity('posts');
        var comment = nga.entity('comments');
        post.showView().fields([
            nga.field('comments', 'embedded_list') // Define a 1-N relationship with the (embedded) comment entity
                .targetEntity(comment)
                .targetFields([ // which comment fields to display in the datagrid / form
                    nga.field('id') // will have a link to comment edition view
                    nga.field('body')
                ])
        ]);

* `permanentFilters({ field1: value, field2: value, ...})`
Filter the list of referenced entities list. This can be very useful to restrict the list of possible values displayed in the datagrid:

        post.editionView().fields([
            nga.field('comments', 'embedded_list')
                .targetFields([
                    nga.field('body')
                ])
                .permanentFilters({
                    published: true // display only the published comments
                })
        ]);

## `reference_many` Field Type

The `reference_many` type maps a one-to-many relationship where the identifiers of the related entities are embedded in the main response. For instance, if the REST API behaves as follows:

```
GET /posts/456
{
    "id": "456",
    "title": "Consectetur adipisicing elit",
    "body": "Sed do eiusmod...",
    "comments": [123, 124]
}

GET /comments/123
{
    "id": 123,
    "author": "Alice",
    "body": "Lorem ipsum sic dolor amet...",
}
GET /comments/124
{
    "id": 124,
    "author": "Bob",
    "body": "Lorem ipsum sic dolor amet...",
}
```

Then mapping a `comments` property of the `post` entity to a `reference_many` will tell ng-admin to fetch the related `comment` entities.

```js
var post = nga.entity('posts');
var comment = nga.entity('comments');
post.editionView().fields([
    nga.field('comments', 'reference_many') // Define a 1-N relationship with the comment entity
        .targetEntity(comment) // Target the comment Entity
        .targetField(nga.field('body')) // the field of the comment entity to use as representation
]);
```

` reference_many` fields render as a list of labels in read context (`listView` and `showView`), and as a select multiple in write context (`creationView` and `editionView`). For that field, ng-admin fetches the related entities one by one:

```
GET /posts/456 <= get the main entity
{ "id": "456", "comments": [123, 124], ... }
GET /comments/123
GET /comments/124
```

The `reference_many` field type also defines `label`, `order`, `map` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetField(Field)`
Define the field name used to link the referenced entity.

        myView.fields([
            nga.field('tags', 'reference_many')
               .label('Tags')
               .isDetailLink(false)
               .targetEntity(tag) // Targeted entity
               .targetField(nga.field('name')) // Label Field to display in the list
        ])

* `singleApiCall(function(entityIds) {}`
Define a function that returns parameters for filtering API calls. You can use it if you API supports filter for multiple values.

        // Will call /tags?tag_id[]=1&tag_id[]=2&tag_id%[]=5...
        postList.fields([
            nga.field('tags', 'reference_many')
                .singleApiCall(function (tagIds) {
                    return { 'tag_id[]': tagIds };
                })
        ]);

    **Tip**: It also works for `creationView` and `editionView`

* `permanentFilters({ field1: value, field2: value, ...})`
Add filters to the referenced results list.

* `remoteComplete([true|false], options = {})`
Enable autocompletion by fetching remote results (disabled by default). When enabled, the `reference` widget fetches the results matching the string typed in the autocomplete input from the REST API.
If set to false, all references (in the limit of `perPage` parameter) would be retrieved at view initialization.

        post.editionView().fields([
            nga.field('id'),
            nga.field('tags', 'reference_many')
                .targetEntity(tag)
                .targetField(nga.field('name'))
                .remoteComplete(true) // populate choices from the response of GET /tags?name=XXX
        ]);

    Available options are:

    * `refreshDelay`: minimal delay between two API calls in milliseconds. By default: 500.
    * `searchQuery`: a function returning the parameters to add to the query string basd on the input string.

            post.editionView().fields([
                nga.field('id'),
                nga.field('tags', 'reference_many')
                    .targetEntity(tag)
                    .targetField(nga.field('name'))
                    .remoteComplete(true, {
                        refreshDelay: 300,
                        // populate choices from the response of GET /tags?q=XXX
                        searchQuery: function(search) { return { q: search }; }
                    })
                    .perPage(10) // limit the number of results to 10
            ]);
