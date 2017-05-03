# Configuration API Reference

In ng-admin, you define all the components of an admin application using the configuration API.

* [NgAdminConfigurationProvider / nga](reference/ngAdminConfigurationProvider.md)
* [Application Configuration](reference/Application.md)
* [Entity Configuration](reference/Entity.md)
* [View Configuration](reference/View.md)
* [Fields Configuration](reference/Field.md)

```
application
 |-baseApiUrl
 |-header
 |-menu
 |-dashboard
 |-entity[]
    |-name
    |-label
    |-url
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
           |-template
           |-validation
           |-editable
```

*Tip*: You won't find the related classes in the ng-admin project. In fact, the admin configuration API exists as a standalone, framework-agnostic library, called [admin-config](https://github.com/marmelab/admin-config). Don't hesitate to browse the source of that library to learn more.