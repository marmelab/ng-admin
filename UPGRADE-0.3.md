# Upgrade to 0.3

0.3 is a major version, and introduces a few BC breaks.

## Views

In order to allow deeper customization, ng-admin 0.3 introduces the concept of "views". An entity can have up to 5 views (`DashboardView`, `ListView`, `CreateView`, `EditView`, `DeleteView`). Each view can have its on set of fields, independently of the other. That way, it's easier to expose some fields in the EditView but not in the ListView, or to use different field types for the CreateView and the EditView.

The direct consequence is in the configuration: instead of being directly attached to entities, fields are defined on views. For instance, consider the following `tag` entity defined in the old syntax:

```js
var tag = new Entity('tags')
    .label('Tags')
    .dashboard(10)
    .pagination(function(page, maxPerPage) {
        return {
            offset: (page - 1) * maxPerPage,
            limit: maxPerPage
        }
    })
    .infinitePagination(true)
    .filterQuery(function(query) {
        return {
            filter: query
        };
    })
    .addField(new Field('id')
        .order(1)
        .label('ID')
        .type('number')
        .identifier(true)
        .edition('read-only')
    ).addField(new Field('name')
         .order(2)
         .label('Name')
         .edition('editable')
         .validation({
             "required": true,
             "maxlength" : 150
         })
     );
```

Now the `Entity` definition should be splitted into views:

```js
 var tag = new Entity('tags')
    .label('Tags')
    .identifier(new Field('id'))
    .addView(new DashboardView('tag-dashboard')
        .label('Recent tags')
        .order(3)
        .limit(10)
        .pagination(function(page, maxPerPage) {
            return {
                offset: (page - 1) * maxPerPage,
                limit: maxPerPage
            }
        })
        .addField(new Field('id').label('ID'))
        .addField(new Field('name').label('Name').type('string'))
        )
    .addView(new ListView('tags-list')
        .title('List of all tags')
        .infinitePagination(false)
        .pagination(pagination)
        .addField(new Field('id').label('ID'))
        .addField(new Field('name').label('Name').type('string'))
        )
    .addView(new CreateView('tags-create')
        .addField(new Field('name')
            .label('Name')
            .type('string')
            .validation({
                "required": true,
                "maxlength" : 150
            })
            )
        )
    .addView(new EditView('tags_edit')
        .listView('tags-list')
        .addField(new Field('name').label('Name')
	        .type('string')
	        .validation({
                "required": true,
                "maxlength" : 150
            })
            )
        )
    .addView(new DeleteView('tags-delete')
        .title('Delete a tag')
        );
```

These options have moved to the `DashboardView` & `ListView`:
* `pagination`
* `perPage`
* `infinitePagination`
* `limit`
* `order`
* `sortParams`
* `filterQuery`
* `filterParams`
* `totalItems` 
* `headers`
* `quickFilters`

## Angularjs requirement

`ng-admin` does not include `angularjs` anymore.

You must include the angular source before including ng-admin:

```html
<script src="/path/to/bower_components/angular/angular.min.js" type="text/javascript"></script>
```

## Minor changes
 
 - `value` is now a function so the value of a field should be retrieved with `views.getField('fieldName').value()` instead of `views.getField('fieldName').value`.
 - `callback` field type & method are now called `template`.
 - `targetField` of a `ReferencedList` is now called a `targetReferenceField`.
 - `targetFields` of a `ReferencedList` & `targetField` for a `ReferenceMany` or a `ReferenceMany` should not be necessary the same field used in the description of the targeted entity.
 - `valueTransformer` and `truncateList` are now renamed to `map`
 - `label` is now optional; by default, the label of a field is the CamelCase version of the field name

Check the [example configuration](src/javascripts/config-dist.js) for an overview of the new syntax.
