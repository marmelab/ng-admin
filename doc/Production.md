# Getting Ready For Production

Before deploying your ng-admin backend to production, there are a few tricks to know:

## Performance Boosters

1. Disable debug in production by passing `false` as second parameter to the Application constructor. Beware that JS error messages will become very cryptic (if even logged) with that mode.

        var admin = nga.application('My Admin Backend', false);

2. Enable `ng-strict-di` angular mode in the `ng-app` element

        <body ng-app="myApp" ng-strict-di>

    Ng-admin library is already compatible with `ng-strict-di`, but you have to explicitly declare dependencies on your custom application code.

    See the [Angular documentation for production](https://docs.angularjs.org/guide/production) for more details about this tweak.
