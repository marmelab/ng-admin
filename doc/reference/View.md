# View Configuration

## View Types

Each entity has 5 views that you can customize:

- `listView`
- `creationView`
- `editionView`
- `showView` (unused by default)
- `deletionView`

## General View Settings

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

        var template = '<ma-show-button entry="entry" entity="entity" size="sm"></ma-show-button>' +
            '<ma-delete-button entry="entry" entity="entity" size="sm"></ma-delete-button>' +
            '<my-custom-directive entry="entry"></my-custom-directive>' +
            '<ma-back-button></ma-back-button>';
        editionView.actions(template);

    Check the [Reusable Directives documentation](../Reusable-directives.md) to get a list of ng-admin directives that you can use as actions.

* `disable()`
Disable this view. Useful e.g. to disable views that modify data and only leave the `listView` enabled

* `url()`
Defines the API endpoint for a view. It can be a string or a function.

        comment.listView().url(function(entityId) {
            return '/comments/id/' + entityId; // Can be absolute or relative
        });

## listView Settings

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

    Filters appear when the user clicks on the "Add filter" button at the top of the list. Once the user fills the filter widgets, the list is immediately refreshed based on the filter values, with underlying API requests looking like:

        GET /customers?_filters=%7B%22first_name%22%3A%22XXX%22%2C%22last_name%22%3A%22XXX%22%2C%22age%22%3A%22XXX%22%7D

    Which is the urlencoded version for:

        GET /customers?_filters={"first_name":"XXX","last_name":"XXX","age":"XXX"}

    **Tip**: You can customize how filters translate to API request parameters. See the [API Mapping chapter](../API-mapping.md) for details.

    You can also set a filter field as "pinned", to make it always visible.

        listView.filters([
            nga.field('q').label('Search').pinned(true)
        ]);

    Filter fields can be of any type, including `reference`. This allows to define custom filters with ease.

        listView.filters([
            nga.field('q').label('')
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
        ]);

    Note that you can use `map()` and `transform()` on filter fields (see [General Field Settings](Field.md#general-field-settings)). You can also use `defaultValue()` on filter fields, so as to filter the list as soon as the filter is added. Combined with an empty template, this allows to create "tagged" lists:

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

        var template = '<ma-show-button entry="entry" entity="entity" size="xs"></ma-show-button>' +
                   '<my-custom-directive entry="entry"></my-custom-directive>';
        listView.listActions(template);

    Check the [Reusable Directives documentation](../Reusable-directives.md) to get a list of ng-admin directives that you can use as list actions.

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

* `exportOptions(Object)`
Customize the CSV export format (quotes, delimiter, newline). The default options object is `{ quotes: false, delimiter: ",", newline: "\r\n" }`.

        listView.exportOptions({
            quotes: true,
            delimiter: ';'
        });

* `prepare(Function)`
Add a function to be executed before the view renders.

    This is the ideal place to prefetch related entities and manipulate the dataStore. The function can be asynchronous, in which case it should return a Promise.

    The `prepare` function is invoked using Angular's dependency injection system, with a context offering the following services:

     - `query`: the query object (an object representation of the main request query string)
     - `datastore`: where the Entries are stored. The dataStore is accessible during rendering
     - `view`: the current View object
     - `entry`: the current Entry instance (except in listView)
     - `entries`: the current list of Entry instances (only in listView)
     - `Entry`: the Entry constructor (required to transform an object from the REST response to an Entry)

    Of course, regular Angular services (like Restangular) are also available.

        post.listView().prepare(['Restangular', 'datastore', 'entries', 'Entry', function(Restangular, datastore, entries, Entry) {
            // gather all authorIds from listed posts
            const authorIds = entries.map(post => post.values.authorId).join(',');
            // fetch the related authors and populate the datastore
            return Restangular.all('authors').getList( { 'id[]': authorIds })
                .then(authors => Entry.createArrayFromRest(
                    authors,
                    [new Field('first_name'), new Field('last_name')],
                    'author'
                ))
                .then(authorEntries => datastore.setEntries('authors', authorEntries));
        }])

* `entryCssClasses(String|Function)`
A list of CSS classes to be added to the rows of the datagrid. If you provide a function, it will receive the current entry as first argument, to allow dynamic classes according to values.

        post.listView()
            .entryCssClasses(function(entry) {
                return (entry.views > 300) ? 'is-popular' : '';
            });

## editionView and creationView Settings

* `onSubmitSuccess(Array|Function)`
Add a function to be executed after the update succeeds.

    This is the ideal place to use the response to update the entry, or redirect to another view. If the function returns false, the default execution workflow is stopped. This means that the function must provide a custom workflow. If the function throws an exception, the onSubmitError callback will execute.

    The function argument can be an angular injectable, listing required dependencies in an array. Among other, the function can receive the following services:

    - `$event`: the form submission event
    - `entry`: the current Entry instance
    - `entity`: the current entity
    - `form`: the form object (for form validation and errors)
    - `progression`: the controller for the loading indicator
    - `notification`: the controller for top notifications

    The function can be asynchronous, in which case it should return a Promise.

        post.editionView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
            // stop the progress bar
            progression.done();
            // add a notification
            notification.log(`Element #${entry._identifierValue} successfully edited.`, { addnCls: 'humane-flatty-success' });
            // redirect to the list view
            $state.go($state.get('list'), { entity: entity.name() });
            // cancel the default action (redirect to the edition view)
            return false;
        }])

* `onSubmitError(Array|Function)`
Add a function to be executed after the update request receives a failed http response from the server.

    This is the ideal place to use the response to update the entry, display server-side validation error, or redirect to another view. If the function returns false, the default execution workflow is stopped. This means that the function must provide a custom workflow. The syntax depends on the framework calling the function.

    The function argument can be an angular injectable, listing required dependencies in an array. Among other, the function can receive the following services:

    - `$event`: the form submission event
    - `error`: the response from the server
    - `errorMessage`: the error message based on the response
    - `entry`: the current Entry instance
    - `entity`: the current entity
    - `form`: the form object (for form validation and errors)
    - `progression`: the controller for the loading indicator
    - `notification`: the controller for top notifications

    The function can be asynchronous, in which case it should return a Promise.

        post.editionView().onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
            // mark fields based on errors from the response
            error.violations.forEach(violation => {
                if (form[violation.propertyPath]) {
                    form[violation.propertyPath].$valid = false;
                }
            });
            // stop the progress bar
            progression.done();
            // add a notification
            notification.log(`Some values are invalid, see details in the form`, { addnCls: 'humane-flatty-error' });
            // cancel the default action (default error messages)
            return false;
        }]);
