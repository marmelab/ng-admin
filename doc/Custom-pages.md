# Adding Custom Pages

For each entity, ng-admin creates the necessary pages for Creating, Retieving, Updating, and Deleting (CRUD) this entity. When you need to achieve more specific actions on an entity, you have to add a custom page - for instance a page asking for an email address to send a message to. How can you route to a specific page and display it in the ng-admin layout?

## Adding a Route

ng-admin uses [AngularUI Router](https://github.com/angular-ui/ui-router) to define routes, parameters, and templates for pages. In UI router terminology, a page is a "state".

```js
app.config(function ($stateProvider) {
    $stateProvider.state('send-post', {
        parent: 'main',
        url: '/sendPost/:id',
        params: { id: null },
        controller: sendPostController,
        controllerAs: 'controller',
        template: sendPostControllerTemplate
    });
});
```

Here the `controllerAs` property defines the name of the controller in the template. Also worth noting: `parent: 'main'` means that the "send-post" page will be displayed inside the main layout.

## Page Controller and Template

Define the controller and template in the usual Angular way (here, with the "controllerAs" syntax):

```js
function sendPostController($stateParams, notification) {
    this.postId = $stateParams.id;
    // notification is the service used to display notifications on the top of the screen
    this.notification = notification;
};
sendPostController.inject = ['$stateParams', 'notification'];
sendPostController.prototype.sendEmail = function() {
    this.notification.log('Email successfully sent to ' + this.email);
};

var sendPostControllerTemplate =
    '<div class="row"><div class="col-lg-12">' +
        '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
        '<div class="page-header">' +
            '<h1>Send post #{{ controller.postId }} by email</h1>' +
        '</div>' +
    '</div></div>' +
    '<div class="row">' +
        '<div class="col-lg-5"><input type="text" size="10" ng-model="controller.email" class="form-control" placeholder="name@example.com"/></div>' +
        '<div class="col-lg-5"><a class="btn btn-default" ng-click="controller.sendEmail()">Send</a></div>' +
    '</div>';
```

![custom page]()

## Creating a Directive to Link To The New Page

The 'sendPost' route already works - it can be accessed by typing its path in the URL bar. But the best way to link to a new page is by displaying a button to it. For that, create a custom directive:

```js
app.directive('sendEmail', ['$location', function ($location) {
    return {
        restrict: 'E',
        scope: { post: '&' },
        link: function (scope) {
            scope.send = function () {
                $location.path('/sendPost/' + scope.post().values.id);
            };
        },
        template: '<a class="btn btn-default" ng-click="send()">Send post by email</a>'
    };
}]);
```

## Including the Custom Directive in a Template Field

Now the new directive is ready to be used inside a ng-admin field of type 'template':

```js
post.showView().fields([
    // ...
    nga.field('custom_action', 'template')
        .label('')
        .template('<send-email post="entry"></send-email>')
]);
```

That's it! You can see the complete code in the [blog example](examples/blog/config.js).
