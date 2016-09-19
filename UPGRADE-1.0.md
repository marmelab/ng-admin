# Upgrade to 1.0

## [BC Break] ng-admin now attaches to a named view

Ng-admin used to attach to the following element in your main `index.html`:

```js
<div ui-view></div>
```

Starting with 1.0, you now have to name the ui-view of ng-admin:

```js
<div ui-view="ng-admin">
```

Not upgrading your `index.html` will result in a blank page.

## [BC Break] Custom pages must use declare 'ng-admin' as parent instead of 'main'

If you added [custom pages](doc/Custom-pages.md), you probably declared a route with a `parent: 'main'`. The main view isn't named 'parent' anymore, but 'ng-admin'. Therefore, all the state definitions for custom pages must be updated:

```js
// from
myApp.config(function ($stateProvider) {
    $stateProvider.state('send-post', {
        parent: 'main',
        url: '/sendPost/:id',
        params: { id: null },
        controller: sendPostController,
        controllerAs: 'controller',
        template: sendPostControllerTemplate
    });
});

// to
myApp.config(function ($stateProvider) {
    $stateProvider.state('send-post', {
        parent: 'ng-admin', // <= this has changed
        url: '/sendPost/:id',
        params: { id: null },
        controller: sendPostController,
        controllerAs: 'controller',
        template: sendPostControllerTemplate
    });
});
```

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

## Better Integration with Module Bundlers

We reviewed the way we publish ng-admin in order to ease integration with module bundlers. You can now just require `ng-admin` dependency directly into your JavaScript file:

``` js
const myApp = angular.module('myApp', [
    require('ng-admin'),
    // ...
]);
```

Furthermore, if your module bundler supports CSS and/or SASS, you can also embed styles using:

``` js
// SASS version
require('ng-admin/lib/sass/ng-admin.scss');

// CSS version
require('ng-admin/build/ng-admin.min.css');
```

## Removing `ng-admin-only` build

We used to build two versions of `ng-admin`: a standalone one and a `only` one. The latter includes only files required to ng-admin. But it was a little buggy and required a lot of dependencies. Including a functional version of this '-only' version was so painful that we decided to abandon it in profit of a better bundler integration (see previous paragraph).
