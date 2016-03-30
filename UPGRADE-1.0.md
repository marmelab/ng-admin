# Upgrade to 1.0

## Angular 1.4

Previous versions of ng-admin relied on Angular 1.3. Version 1.0 bumps the angular version requirement to 1.4.

You must be careful if you use some additional angular plugins in your code, Angular 1.4 causing some BC Breaks. For example it's the case for [angular-cookies](https://code.angularjs.org/1.4.9/docs/api/ngCookies/service/$cookies).

## No more `gotoDetails() and `gotoReference()` in column scope

If you wrote a custom FieldView, you probably based the Link widget on the ones bundled by ng-admin:

```js
// in MyCustomFieldView.js
export default {
    ...
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    ...
};
```

The `gotoDetail()` method is no longer in the execution scope of `maColumn`, the directive which includes the link widget. Instead, it uses the `ui-sref` directive (from ui-router) to make the link visible and right-clickable:

```js
// in MyCustomFieldView.js
export default {
    ...
    getLinkWidget:   () => '<a ui-sref="{{detailState}}(detailStateParams)">' + module.exports.getReadWidget() + '</a>'
    ...
};
```

You should upgrade your existing FieldViewConfigurations to reflect that change.

## Redirections After Edition / Creation

After editing an entity, ng-admin now redirects to the previous page (e.g. list view) instead of staying on the edition view.

Similarly, after creating an entity, ng-admin now redirects to the show view if it's enabled, or to the list view if it's not.

If you want to reverse to the pre-1.0 behavior, override `CreationView.onSubmitSuccess()` and `EditionView.onSubmitSuccess()` (cf [doc/reference/View](doc/reference/View.md)).
