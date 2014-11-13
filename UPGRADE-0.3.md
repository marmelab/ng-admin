# Upgrade from 0.1 or 0.2 to 0.3

Introducing views to `ng-admin` bring some BC breaks:

## Views

Field are now linked to entities anymore. Each one should be linked to a View.
There is 5 types of views : `DashboardView`, `ListView`, `CreateView`, `EditView`, `DeleteView`.

The configuration of an `Entity` used in the past version:

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
             "max-length" : 150
         })
     );
```

Should now be splitted in views :

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
                "max-length" : 150
            })
            )
        )
    .addView(new EditView('tags_edit')
        .listView('tags-list')
        .addField(new Field('name').label('Name')
	        .type('string')
	        .validation({
                "required": true,
                "max-length" : 150
            })
            )
        )
    .addView(new DeleteView('tags-delete')
        .title('Delete a tag')
        );
```

 You can now choose which field to render in each views.
These options are now part of the `DashboardView` & `ListView` :
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

 ## Minor changes
 
 - `value` is now a function so the value of a field should be retrieved with `views.getField('fieldName').value()` instead of `views.getField('fieldName').value`.
 - `callback` field type & method are now called `template`.
 - `targetField` of a `ReferencedList` is now called a `targetReferenceField`.
 - `targetFields` of a `ReferencedList` & `targetField` for a `ReferenceMany` or a `ReferenceMany` should not be necessary the same field used in the description of the targeted entity.
