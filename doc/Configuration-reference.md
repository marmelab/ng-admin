# Configuration API Reference

In ng-admin, you define all the components of an admin application using the configuration API.

* [NgAdminConfigurationProvider / nga](#ngadminconfigurationprovider--nga)
* [Application Configuration](#application-configuration)
* [Entity Configuration](#entity-configuration)
* [View Configuration](#view-configuration)
* [Fields Configuration](#fields-configuration)

```
application
 |-baseApiUrl
 |-header
 |-menu
 |-dashboard
 |-entity[]
    |-name
    |-label
    |-baseApiUrl
    |-readOnly
    |-creationView
    |-editionView
    |-deletionView
    |-showView
    |-listView
        |-actions
        |-title
        |-description
        |-template
        |-enabled
        |-perPage
        |-infinitePagination
        |-listActions
        |-batchActions
        |-filters
        |-permanentFilters
        |-sortField
        |-sortDir
        |-field[]
           |-name
           |-label
           |-type
           |-defaultValue
           |-detailLink
           |-order
           |-map
           |-transform
           |-attributes
           |-cssClasses
           |-validation
           |-editable
```

*Tip*: You won't find the related classes in the ng-admin project. In fact, the admin configuration API exists as a standalone, framework-agnostic library, called [admin-config](https://github.com/marmelab/admin-config). Don't hesitate to browse the source of that library to learn more.

## NgAdminConfigurationProvider / nga

The only object that you need from ng-admin is `NgAdminConfigurationProvider` (often abbreviated `nga` in all the documentation and examples). Inject this object to the main configuration function:

```js
// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var myApp = angular.module('myApp', ['ng-admin']);
// declare a function to run when the module bootstraps (during the 'config' phase)
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // continue here
});
```

### Factory functions

`NgAdminConfigurationProvider` is a helper that contains factory functions for all the classes you need.

```js
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // application factory function
    var admin = nga.application('My Admin Backend');
    // entity factory function
    var post = nga.entity('posts')
    // field factory function
    var name = nga.field('name')
    // menu factory function
    var menu = nga.menu();
    // dashboard factory function
    var dashboard = nga.dashboard();
});
```

### configure

`NgAdminConfigurationProvider` also provides the `configure()` method, which is the last method usually called in an admin configuration. It expects one parameter: an `Application` instance. It attaches the admin application to the DOM and runs it.

```js
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    var admin = nga.application('My First Admin');
    // more configuation here
    // ...
    nga.configure(admin);
}]);
```

### registerFieldType

Lastly, the `field()` factory provided by `NgAdminConfigurationProvider` delegates instanciation of fields to third party objects. You can override the result of a call to `nga.field(type)`, or add a new type, by calling `registerFieldType()` first.

```js
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('date', require('path/to/MyCustomDateField'))
}]);
```

See the [Custom types documentation](Custom-types.md) for more details.

## Application Configuration

The Application object is the base of an administration. There can be only one such object defined on a page.

```js
// create an application instance
var admin = nga.application('My backend');
// configure it
// ...
// attach the application instance to the dom and run it
nga.configure(admin);
```

* `nga.application(title, debug)` (factory method)
Create a new Application instance. Debug is true by default; set it to false to speed up rendering a bit.

* `title()`
Defines the application title, displayed in the header

        var app = nga.application().title('My backend')

* `baseApiUrl()`
Defines the main API endpoint

        var app = nga.application().baseApiUrl('http://localhost:3000/')

* `debug()`
Enable or disable debug (enabled by default)

        var app = nga.application().debug(false)

* `header(string)`
Customize the application header. See [the Theming doc](doc/Theming.md) for details.

* `menu(Menu)`
Customize the sidebar menu. See [the Menu doc](Menus.md) for details.

* `dashboard(Dashboard)`
Customize the dashboard, i.e. the admin home screen. See [the Dashboard doc](Dashboard.md) for details.

* `addEntity(Entity)`
Add an entity to the application. See [Entity configuration](#entity-configuration).

## Entity Configuration

Each entity maps to a different API endpoint. The name of the entity, defines the endpoint:

```js
// set the main API endpoint for this admin
var app = nga.application('My backend')
    .baseApiUrl('http://localhost:3000/');

// define an entity mapped by the http://localhost:3000/posts endpoint
var post = nga.entity('posts');
```

* `label()`
Defines the name of the entity, as displayed on screen

        var comment = nga.entity('comments').label('Discussions');

* `readOnly()`
A read-only entity doesn't allow access to the mutation views (editionView, creationView, deletionView). In addition, all links to the editionView are replaced by links to the showView.

        var tag = nga.entity('tags').readOnly();

* `baseApiUrl()`
Defines the base API endpoint for all views of this entity

        var comment = nga.entity('comments').baseApiUrl('http://localhost:3001/');

* `url()`
Defines the API endpoint for all views of this entity. It can be a string or a function.

        var comment = nga.entity('comments').url(function(entityName, viewType, identifierValue, identifierName) {
            return '/comments/' + entityName + '_' + viewType + '?' + identifierName + '=' + identifierValue; // Can be absolute or relative
        });

* `createMethod(string)` and `updateMethod(string)`
Customize the HTTP method to be used for write queries, e.g. to use `PATCH` instead of `PUT`.

## View Configuration

### View Types

Each entity has 5 views that you can customize:

- `listView`
- `creationView`
- `editionView`
- `showView` (unused by default)
- `deletionView`

### General View Settings

These settings are available on all views.

* `fields([field1, field2, ...])`
Add fields to a view (columns to a list, or a form controls to a form). Each field maps a property in the API endpoint result.

        listView.fields([
            nga.field('first_name'),
            nga.field('last_name'),
            nga.field('age', 'number')
        ]);

* `fields()` Retrieve the list of fields added to a view. The result can be added to another view, to avoid repetition.

* `title(String)`
The title of the view. ng-admin sees it as a template, and compiles it with the view scope. That means you can customize the title of a view using details from the current entry.

        editionView.title('Edit item "{{ entry.values.title }}"');

* `description(String)`
A text displayed below the title. Like the `title` ng-admin sees it as a template and it can be customized in the same way.

* `actions(String|Array)`
Customize the list of actions for this view. You can pass a list of button names among 'back', 'list', 'show', create', 'edit', 'delete', 'batch', and 'export':

        editionView.actions(['show', 'list', 'delete']);

    Alternately, if you pass a string, it is compiled just like an Angular template, with access to the current `entry` in the scope. This allows to easily add custom actions, or customize the buttons appearance:

        var template = '<show-button entry="entry" entity="entity" size="sm"></show-button>' +
            '<delete-button entry="entry" entity="entity" size="sm"></delete-button>' +
            '<my-custom-directive entry="entry"></my-custom-directive>' +
            '<back-button></back-button>';
        editionView.actions(template);

* `disable()`
Disable this view. Useful e.g. to disable views that modify data and only leave the `listView` enabled

* `url()`
Defines the API endpoint for a view. It can be a string or a function.

        comment.listView().url(function(entityId) {
            return '/comments/id/' + entityId; // Can be absolute or relative
        });

### listView Settings

* `perPage(Number)`
Define the number of element displayed in a page

* `sortField(String)`
Set the default field for list sorting. Defaults to 'id'

* `sortDir(String)`
Set the default direction for list sorting. Defaults to 'DESC'

* `infinitePagination(boolean)`
Enable or disable lazy loading.

* `filters()[field1, field2, ...])`
Add filters to the list. Each field maps a property in the API endpoint result.

        customers.listView().filters([
            nga.field('first_name'),
            nga.field('last_name'),
            nga.field('age', 'number')
        ]);

    Filters appear when the user clicks on the "Add filter" button at the top of the list. Once the user fills the filter widgets, the list is immediately refreshed based on the filter values, with unerlying API requests looking like:

        GET /customers?first_name=XXX&last_name=XXX&age=XXX

    You can also set a filter field as "pinned", to make it always visible.

        listView.filters([
            nga.field('q').label('Search').pinned(true)
        ]);

    Filter fields can be of any type, including `reference` and `template`. This allows to define custom filters with ease.

        listView.filters([
            nga.field('q', 'template').label('')
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
        ]);

    Note that you can use `map()` and `transform()` on filter fields (see [General Field Settings](#general-field-settings)). You can also use `defaultValue()` on filter fields, so as to filter the list as soon as the filter is added. Combined with an empty template, this allows to create "tagged" lists:

        var user_id = 123; // currently logged user
        var d = new Date()
        var yesterday = d.setDate(d.getDate() - 1);
        listView.filters([
            nga.field('flagged', 'template')
                .defaultValue('true'), // adds ?flagged=true to the REST query
            nga.field('author_id', 'template')
                .label('Mine')
                .defaultValue(user_id), // adds ?author_id=123 to the REST query
            nga.field('created_at', 'template')
                .label('Recent')
                .defaultValue({ gt: yesterday }), // adds ?created_at={gt:2015-08-31} to the REST query
        ]);


* `permanentFilters({ field1: value, field2: value, ...})`
Add permanent filters to the results list.

        posts.listView().permanentFilters({
            published: true
        });
        // calls to the API will be GET /posts?published=true

* `listActions(String|Array)`
Add an action column with action buttons on each line. You can pass a list of button names among 'show', 'edit', and 'delete'.

        listView.listActions(['edit', 'delete']);

    Alternately, if you pass a string, it is compiled just like an Angular template, with access to the current `entry` in the scope. This allows to add custom actions on each line:

        var template = '<show-button entry="entry" entity="entity" size="xs"></show-button>' +
                   '<my-custom-directive entry="entry"></my-custom-directive>';
        listView.listActions(template);

* `batchActions(String|Array)`
Add your own batch action directives.

    The datagrid contains a selection column (an initial column made of checkboxes). Once the user selects lines, a button appears and displays the number of selected entries. A click on this button reveals the list of "batch actions", i.e. actions that can be performed on a selection of entries. By default, the only batch action available is a batch delete.

    Add your own directives to the list of batch acctions at will. The scope contains a `selection` variable, which holds the current selection:

        listView.batchActions(['delete', '<my-custom-directive selection="selection"></my-custom-directive>'])

    To remove the list of checkboxes, simply set an empty `batchActions` list on the view:

        listView.batchActions([])

    *Tip*: The `selection` variable is also in the scope of the main view actions.

        listView.actions('create', '<my-custom-directive selection="selection"></my-custom-directive>');

* `exportFields(Array)`
Set the fields for the CSV export function. By default, ng-admin uses the fields displayed in the datagrid, but you can choose to export a different set of fields.

        listView.exportFields([
            nga.field('id', 'number'),
            nga.field('author'),
            nga.field('post_id', 'reference')
                .label('Post')
                .map(truncate)
                .targetEntity(post)
                .targetField(nga.field('title').map(truncate))
            nga.field('body', 'wysiwyg')
                .stripTags(true)
        ]);

## Fields Configuration

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
* [`boolean` Field Type]
* [`choice` and `choices` Field Types](#choice-and-choices-field-types)
* `json` Field Type
* [`file` Field Type](#file-field-type)
* [`reference` Field Type](#reference-field-type)
* [`referenced_list` Field Type](#referenced_list-field-type)
* [`reference_many` Field Type](#reference_many-field-type)
* [`template` Field Type](#template-field-type)

### General Field Settings

* `nga.field(name, type)`
Create a new field of the given type. Default type is 'string', so you can omit it. Bundled types include `string`, `text`, `wysiwyg`, `password`, `email`, `date`, `datetime`, `number`, `float`, `boolean`, `choice`, `choices`, `json`, `file`, `reference`, `reference_list`, `reference_many`, and `template`.

* `label(string label)`
Define the label of the field. Defaults to the uppercased field name.

* `editable(boolean)`
Define if the field is editable in the edition form. Usefult to display a field without allowing edition (e.g for creation date).

* `order(number|null)`
Define the position of the field in the view.

* `isDetailLink(boolean)`
Tell if the value is a link in the list view. Default to true for the identifier and references field, false otherwise. The link points to the edition view, except for read-only entities, where it points to the show view.

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
        //   map()  v  ^  tranform()
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
 - `required`: boolean
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
A list of CSS classes to be added to the corresponding field. If you provide a function, it will receive the current entry as first argument, to allow dynamic classes according to values.

        nga.field('title')
            .cssClasses(function(entry) {
                return entry.values.needsAttention ? 'bg-warning' : '';
            });

* `defaultValue(*)`
Define the default value of the field in the creation form.

* `pinned(boolean)`
Whether the field should always appear. Used in filters (see listView Settings). Default to false.

### `wysiwyg` Field Type

* `stripTags(boolean)`
Enable removal of all HTML tags - only the text is kept. Useful for displaying rich text in a table, or before truncation. False by default.

* `sanitize(boolean)`
Enable HTML sanitization of WYSIWYG Editor value (removal of script tags, etc). True by default.

### `date` Field Type

* `format(string ['yyyy-MM-dd' by default])`

* `parse(function [remove hours, minutes and timezone by default])`
Filter applied to modify date object returned by date picker if needed.

### `datetime` Field Type

* `format(string ['yyyy-MM-dd HH:mm:ss' by default])`

* `parse(function [no change by default])`
Filter applied to modify date object returned by date picker if needed.

### `number` Field Type

* `format(string)`
Format for number to string conversion. Based on [Numeral.js](http://numeraljs.com/), which uses a syntax similar to Excel. You can configure the locale and create named formats by following [angular-numeraljs](https://github.com/baumandm/angular-numeraljs) instructions.

        nga.field('cost', 'number').format('$0,0.00');
        // now 1234.5 will render as '$1,234.50'

### `boolean` Field Type

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

### `choice` and `choices` Field Types

* `choices(array|function)`
Define array of choices for `choice` type.

    When given an array, each choice must be an object litteral with both a value and a label.

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

### `file` Field Type

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

### `reference` Field Type

The `reference` type also defines `label`, `order`, `map`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetLabel(string)`
Define the target field name used to retrieve the label of the referenced element.

        myView.fields([
            nga.field('post_id', 'reference')
                .label('Post title')
                .map(truncate) // Allows to truncate values in the select
                .targetEntity(post) // Select a target Entity
                .targetField(nga.field('title')) // Select a label Field
        ]);

* `singleApiCall(function(entityIds) {}`
Define a function that returns parameters for filtering API calls. You can use it if you API support filter for multiple values.

        // Will call /posts?post_id[]=1&post_id[]=2&post_id%[]=5...
        commentList.fields([
            nga.field('post_id', 'reference')
                .singleApiCall(function (postIds) {
                    return { 'post_id[]': postIds };
                })
        ]);

* `sortField(String)`
Set the default field for list sorting. Defaults to 'id'

* `sortDir(String)`
Set the default direction for list sorting. Defaults to 'DESC'

* `remoteComplete([true|false], options = {})`
Enable autocompletion by fetching remote results (disabled by default). When enabled, the `reference` widget fetches the results matching the string typed in the autocomplete input from the REST API.
If set to false, all references (in the limit of `perPage` parameter) would be retrieved at view initialization.

        comments.editionView().fields([
            nga.field('id'),
            nga.field('post_id', 'reference')
                .targetEntity(post)
                .targetField(nga.field('title'))
                .remoteComplete(true) // populate choices from the response of GET /posts?title=XXX
        ]);

    Available options are:

    * `refreshDelay`: minimal delay between two API calls in milliseconds. By default: 500.
    * `searchQuery`: a function returning the parameters to add to the query string basd on the input string.

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

* `permanentFilters({ field1: value, field2: value, ...})`
Add filters to the referenced results list. This can be very useful to restrict the list of possible values displayed in a dropdown list:

        comments.editionView().fields([
            nga.field('id'),
            nga.field('post_id', 'reference')
                .targetEntity(post)
                .targetField(nga.field('title'))
                .permanentFilters({
                    published: true
                });
        ]);

* `perPage(integer)`
Define the maximum number of elements fetched and displayed in the list.

### `referenced_list` Field Type

The `referenced_list` type also defines `label`, `order`, `map`, `list` & `validation` options like the `Field` type.

* `targetEntity(Entity)`
Define the referenced entity.

* `targetReferenceField(string)`
Define the field name used to link the referenced entity.

* `targetFields(Array(Field))`
Define an array of fields that will be displayed in the list of the form.

        myEditionView.fields([
            nga.field('comments', 'referenced_list') // Define a N-1 relationship with the comment entity
                .label('Comments')
                .targetEntity(comment) // Target the comment Entity
                .targetReferenceField('post_id') // Each comment with post_id = post.id (the identifier) will be displayed
                .targetFields([ // Display comment field to display
                    nga.field('id').label('ID'),
                    nga.field('body').label('Comment')
                ])
        ]);

* `sortField(String)`
Set the default field for list sorting. Defaults to 'id'

* `sortDir(String)`
Set the default direction for list sorting. Defaults to 'DESC'

* `permanentFilters({ field1: value, field2: value, ...})`
Add filters to the referenced results list.

* `perPage(integer)`
Define the maximum number of elements fetched and displayed in the list.

### `reference_many` Field Type

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
Define a function that returns parameters for filtering API calls. You can use it if you API support filter for multiple values.

        // Will call /tags?tag_id[]=1&tag_id[]=2&tag_id%[]=5...
        postList.fields([
            nga.field('tags', 'reference_many')
                .singleApiCall(function (tagIds) {
                    return { 'tag_id[]': tagIds };
                })
        ]);

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

### `template` Field Type

* `template(*)`
Define the template to be displayed for fields of type `template` (can be a string or a function).
