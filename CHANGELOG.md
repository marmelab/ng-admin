CHANGELOG
=========

v0.6.0 - 25 Feb. 2015
---------------------

* Add documentation about custom types (fzaninotto)
* Add Factory for field Views (fzaninotto)
* Add support for template items in `actions()` and `listActions()` when called with an array parameter (ThieryMichel)
* Add ability to filter references results (jeromemacias)
* Add ability to format Date fields before they are sent (ThieryMichel)
* Fix missing require parameter in NgAdminConfiguration (easel)
* Fix missing dashboard panel title, falling back to entity label (jpetitcolas)
* Add listActions in ReferenceList in editionView (fzaninotto)
* Add Factory methods (`nga.*`) to the configuration API (fzaninotto)
* Add link to dashboard panel views (fzaninotto)
* Add ability to use templates in view description (Xennis)
* Update file field: Remove file field requirement on edition and remove file upload progress bar on end (jeromemacias)
* Fix listActions buttons attributes binding (ThieryMichel)

v0.5.0 - 2 Feb. 2015
--------------------

* Dashboard panel titles now link to list view (fzaninotto)
* Allow listActions on ReferencedList (fzaninotto)
* Add Custom pages documentation (fzaninotto)
* Filter form now reset page number on submit (jeromemacias)
* Allow isEditLink to disable links on references (fzaninotto)
* Fallback to column for non-editable fields in form (fzaninotto)
* Fix map() being called twice on the listView (fzaninotto)
* Fix Reference identifiers (manuquentin)
* Fix the sorting of ReferencedList fields in the showView (Xennis)
* Cleanup markup to adhere to the sb-admin standard (fzaninotto)
* Add option to define the route on a `isDetailLink` field (Xennis)
* Fix ordering problems in ReferenceFields (fzaninotto)
* Add JSON field (jeromemacias)
* Fixed a typo in README (megazoll)
* Add per-field classes in the markup to allow fine selection in tests (and in CSS) (fzaninotto)
* Allow Embedded datagrids to be limited (fzaninotto)
* Fix datagrid in show view (jeromemacias)
* Allow ListView filters on references (jeromemacias)
* Avoid using filter on ng-repeat (jeromemacias)
* Allow overriding the main layout (fzaninotto)
* Update dashboardView section in the README (Xennis)
* Allows to customize error messages (manuquentin)
* Remove scroll listener on infinite pagination destroy (fzaninotto)
* Move example to example directory (fzaninotto)
* Move filters from filterView to `listView.filters()` (fzaninotto)
* Move `listView.addQuickFilters()` feature to regular filters (fzaninotto)
* Remove notion of "hidden" fields (fzaninotto)
* Strip tags in list wysiwyg fields (jpetitcolas)
* Fix and refactor `dashboardView.disable()` (fzaninotto)
* Improve the complexity and test data of the bundled blog example
* Introduce and document `View.fields()` to allow fields reusability (fzaninotto)
* Don't transit pagination through datagrid (fzaninotto)
* [BC Break] Offload all REST mapping tasks to Restangular (fzaninotto)
* Isolate datagrid-pagination directive & fix direction arrows (manuquentin)
* Fix call to entire API collection for References in show view (manuquentin)
* Use Bootstrap's built-in form-control-static to style text in forms (fzaninotto)
* Update example from README  (fzaninotto)
* Add theming support and documentation (fzaninotto)
* Make validation behave the same in creation and edition forms (fzaninotto)
* Tweak filters look and feel (fzaninotto)
* Add example of custom page handling (manuquentin)
* Add doc about API mapping assumptions (manuquentin)
* Introduce `singleAPICall` to reduce the query count on reference fethcing (manuquentin)
* Add filters in the listView (manuquentin)
* Fix null rawEntry mapping bug in Edit form (manuquentin)
* Improve development automation by embedding the demo (fzaninotto)
* Add multi-endpoint support at the entity and view levels (manuquentin)
* Fix home link (manuquentin)
* Add HTTP error handling (manuquentin)
* Isolate directive scope to make them more testable (fzaninotto)
* Improve test automation and bootstrap protractor tests (jeromemacias)
* Add MenuView to customize menu icon and order (fzaninotto)
* Split and rename Repository files into Queries (manuquentin)

v0.4.0 - 4 Dec 2014
-------------------

* Refine graphical user interface
* Streamline configuration API
* Add Configurable buttons for views and rows
* Make view title configurable
* Add a new show view
* Add ready-only view
* Views are now already added by default
* Heavy refactoring for better maintainability

v0.3.4 - 2 Dec 2014
-------------------

* Configuration actions & show views

v0.3.3 - 23 Nov 2014
--------------------

* Minor improvements

v0.3.2 - 14 Nov 2014
--------------------

* Fix string validation

v0.3.1 - 13 Nov 2014
--------------------

* Fix validation issue introduced in 0.3.0

v0.3.0 - 13 Nov 2014
--------------------

* Major change in Configuration API: Introducing Views
* Add PasswordField and PasswordColumn
* Fix infinite pagination & entity creation
* Add PasswordField and PasswordColumn
* Add PasswordField and PasswordColumn
* Add PasswordField and PasswordColumn

v0.2.0 - 26 Sept 2014
---------------------

* Add PasswordField and PasswordColumn
* Add quick filters, wysiwyg & callback field types

v0.1.0 - 23 Sept 2014
---------------------

* Initial release
