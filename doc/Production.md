# Getting Ready For Production

Before deploying your ng-admin backend to production, there are a few things to know.

## Bundling only the dependencies you need

All the examples in the ng-admin documentation include the minified JS and CSS:

```html
<link rel="stylesheet" href="/path/to/node_modules/ng-admin/build/ng-admin.min.css">
<script src="/path/to/node_modules/ng-admin/build/ng-admin.min.js"></script>
```

These two files contain the ng-admin source, *as well as the source of all dependencies, including angular.js*, all combined and minified into a single file. This may not be what you want in production.

If your admin page has more dependencies, or if you have a custom build utility (we advise using [webpack](http://webpack.github.io/)), you'll need to include the ng-admin standalone version (`build/ng-admin-only.min.js`), as well as all the other dependencies.

Here is a snippet showing all required scripts:

``` html
<link rel="stylesheet" href="node_modules/bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" href="node_modules/ng-admin/build/ng-admin-only.min.css" />

<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="node_modules/angular-bootstrap/ui-bootstrap.min.js"></script>
<script src="node_modules/angular-resource/angular-resource.min.js"></script>
<script src="node_modules/angular-sanitize/angular-sanitize.min.js"></script>
<script src="node_modules/angular-ui-codemirror/ui-codemirror.min.js"></script>
<script src="node_modules/angular-ui-router/release/angular-ui-router.min.js"></script>
<script src="node_modules/angular-numeraljs/dist/angular-numeraljs.min.js"></script>
<script src="node_modules/humane/humane.js"></script>
<script src="node_modules/inflection/inflection.min.js"></script>
<script src="node_modules/underscore/underscore-min.js"></script>
<script src="node_modules/ng-file-upload/ng-file-upload-all.min.js"></script>
<script src="node_modules/ngInflection/ngInflection.js"></script>
<script src="node_modules/nprogress/nprogress.js"></script>
<script src="node_modules/restangular/dist/restangular.min.js"></script>
<script src="node_modules/textAngular/dist/textAngular.min.js"></script>
<script src="node_modules/papaparse/papaparse.min.js"></script>
<script src="node_modules/numeral/min/numeral.min.js"></script>
<script src="node_modules/codemirror/lib/codemirror.js"></script>
<script src="node_modules/codemirror/addon/edit/closebrackets.js"></script>
<script src="node_modules/codemirror/addon/lint/lint.js"></script>
<script src="node_modules/jsonlint/lib/jsonlint.js"></script>
<script src="node_modules/codemirror/addon/lint/json-lint.js"></script>
<script src="node_modules/codemirror/addon/selection/active-line.js"></script>
<script src="node_modules/codemirror/mode/javascript/javascript.js"></script>
<script src="node_modules/ng-admin/build/ng-admin-only.min.js"></script>
```

## Performance Boosters

1. Disable debug in production by passing `false` as second parameter to the Application constructor. Beware that JS error messages will become very cryptic (if even logged) with that mode.

        var admin = nga.application('My Admin Backend', false);

2. Enable `ng-strict-di` angular mode in the `ng-app` element

        <body ng-app="myApp" ng-strict-di>

    Ng-admin library is already compatible with `ng-strict-di`, but you have to explicitly declare dependencies on your custom application code.

    See the [Angular documentation for production](https://docs.angularjs.org/guide/production) for more details about this tweak.
