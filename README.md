ng-admin [![Build Status](https://travis-ci.org/marmelab/ng-admin.svg?branch=master)](https://travis-ci.org/marmelab/ng-admin)
========

[![Join the chat at https://gitter.im/marmelab/ng-admin](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/marmelab/ng-admin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Plug me to your RESTFul API to get a complete administration interface (datagrid, filters, complex form widgets, multi-model relationships, dashboard) in no time! Beyond simple CRUD, ng-admin lets you build sophisticated GUIs without getting in your way.

[![Screencast](http://static.marmelab.com/ng-admin-09-video-thumbnail.png)](https://vimeo.com/143909685)

* [Online demo](http://marmelab.com/ng-admin-demo/) ([source](https://github.com/marmelab/ng-admin-demo))
* [Documentation](http://ng-admin-book.marmelab.com/)

## Installation

Grab ng-admin from your favorite package manager, `npm` or `bower`:

```sh
npm install ng-admin --save
# or
bower install ng-admin --save
```

Add the `ng-admin.min.css` and `ng-admin.min.js` to the HTML, add a `<div ui-view>`, and configure the admin:

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My First Admin</title>
    <link rel="stylesheet" href="node_modules/ng-admin/build/ng-admin.min.css">
  </head>
  <body ng-app="myApp">
    <div ui-view></div>
    <script src="node_modules/ng-admin/build/ng-admin.min.js"></script>
    <script type="text/javascript">
    var myApp = angular.module('myApp', ['ng-admin']);
    myApp.config(['NgAdminConfigurationProvider', function(NgAdminConfigurationProvider) {
        var nga = NgAdminConfigurationProvider;
        // create an admin application
        var admin = nga.application('My First Admin');
        // more configuation here later
        // ...
        // attach the admin application to the DOM and run it
        nga.configure(admin);
    }]);
    </script>
  </body>
</html>
```

## Getting Started

See the [Getting Started](doc/Getting-started.md) dedicated chapter for a step-by-step tutorial aimed at beginners.

## Usage Examples

* You can find a simple configuration in the [blog admin demo](http://ng-admin.marmelab.com/#/dashboard) ([source](examples/blog/config.js)), where the entities are posts, comments, and tags.  The remote REST API is simulated in the browser, using [FakeRest](https://github.com/marmelab/FakeRest).
* The [Posters Galore demo](http://marmelab.com/ng-admin-demo/) ([source](https://github.com/marmelab/ng-admin-demo)) is a more complete example of an e-commerce administration, with custom authentication, pages, directives and modules, all well organized via WebPack. The remote REST API is also simulated in the browser, using [FakeRest](https://github.com/marmelab/FakeRest).

## Configuration Reference

An administration in ng-admin is made of one *application* containing several *entities*. Each entity has up to 5 *views*, and each view has many *fields*.

```
application
 |-header
 |-menu
 |-dashboard
 |-entity[]
    |-creationView
    |-editionView
    |-deletionView
    |-showView
    |-listView
        |-field[]
           |-name
           |-type
```

See [Configuration API Reference](doc/Configuration-reference.md) dedicated chapter for more details.

**Tip**: You won't find the related classes in the ng-admin project. In fact, the admin configuration API exists as a standalone, framework-agnostic library, called [admin-config](https://github.com/marmelab/admin-config). Don't hesitate to browse the source of that library to learn more.

## Relationships

Ng-admin supports relationships between entities in read and write views, and provides specialized field types for that: `reference`, `referenced_list`, `reference_many`, and `embedded_list`. The [Relationships Reference chapter](doc/Relationships.md) describes in more details which field type to use for which case.

Also, the Fields section of the [Configuration API Reference chapter](doc/Configuration-reference.md) has a list of all settings for each of these field types.

## Menu Configuration

By default, ng-admin creates a sidebar menu with one entry per entity. If you want to customize this sidebar (labels, icons, order, adding submenus, etc), you have to define menus manually.

See [Menus Configuration](doc/Menus.md) dedicated chapter.

## Dashboard Configuration

The home page of a ng-admin application is called the Dashboard. Use it to show important pieces of information to the end user, such as latest entries, or charts.

See [Dashboard Configuration](doc/Dashboard.md) dedicated chapter.

## Customizing the API Mapping

All HTTP requests made by ng-admin to your REST API are carried out by [Restangular](https://github.com/mgonto/restangular), which is like `$resource` on steroids.

The REST specification doesn't provide enough detail to cover all requirements of an administration GUI. ng-admin makes some assumptions about how your API is designed. All of these assumptions can be overridden by way of [Restangular's request and response interceptors](https://github.com/mgonto/restangular#addresponseinterceptor).

That means you don't need to adapt your API to ng-admin; ng-admin can adapt to any REST API, thanks to the flexibility of Restangular.

See the [Customizing the API Mapping](doc/API-mapping.md) dedicated chapter.

## Theming

You can override pretty much all the HTML generated by ng-admin, at different levels.

See the [Theming](doc/Theming.md) dedicated chapter.

## Adding Custom Pages

For each entity, ng-admin creates the necessary pages for Creating, Retrieving, Updating, and Deleting (CRUD) this entity. When you need to achieve more specific actions on an entity, you have to add a custom page - for instance a page asking for an email address to send a message to. How can you route to a specific page and display it in the ng-admin layout?

See the [Adding Custom Pages](doc/Custom-pages.md) dedicated chapter.

## Adding Custom Types

When you map a field between a REST API response and ng-admin, you give it a type. This type determines how the data is displayed and edited. It is very easy to customize existing ng-admin types and add new ones.

See the [Adding Custom Types](doc/Custom-types.md) dedicated chapter.

## Getting Ready For Production

To build the ng-admin source with the dependencies you need, and to get hints about performance boosters, head to the [Getting Ready For Production](doc/Production.md) dedicated chapter.

## News

Follow the [marmelab blog](http://marmelab.com/blog/) for news about ng-admin (tutorials, plugins, new releases, etc).

You should also watch the [ng-admin release page on GitHub](https://github.com/marmelab/ng-admin/releases) for announcements on new releases, and complete changelog.

## Support

Ng-admin is an open-source project, with a community getting larger every  day. You will get help by asking politely in any the following channels:

* [StackOverflow](http://stackoverflow.com/questions/tagged/ng-admin)
* [Gitter (live chat)](https://gitter.im/marmelab/ng-admin) [![Join the chat at https://gitter.im/marmelab/ng-admin](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/marmelab/ng-admin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Please give as much context as possible, including and admin configuration snippet, and the response from the API you're mapping.

## Contributing

Your feedback about the usage of ng-admin in your specific context is valuable, don't hesitate to [open GitHub Issues](https://github.com/marmelab/ng-admin/issues) for any problem or question you may have.

All contributions are welcome: please send us a Pull Request for any new feature / bug fix in your fork that you consider worth giving back.

Also, if you have some experience with ng-admin, please answer questions from newcomers in any of the support channels (see above).

### Installing Dependencies

Install npm dependencies (for tests) by calling the `install` target:

```sh
make install
```

### Running the example app

To test your changes, run the example app, which is bundled with a sample REST api, by calling:

```sh
make run
```

Then, connect to `http://localhost:8000/` to browse the admin app. This task uses webpack-dev-server, which means that the browser will reload the page as soon as one file in the source is updated. This makes the blog app our preferred live testing environment.

### Testing

ng-admin has unit tests (powered by karma) and end to end tests (powered by protractor). Launch the entire tests suite by calling:

```sh
make test
```

**Tip:** If you are working on Karma tests, you can prevent from relaunching the whole process by disabling single-run:

```
KARMA_SINGLE_RUN=false ./node_modules/.bin/grunt karma:unit
```

### Releasing

Before releasing a new version, concatenate and minify the JS and CSS sources into minified scripts with:

```sh
make build
git add build
git commit -m 'update built files'
git push origin master
git tag vx.x.x
# publish to bower
git push origin --tags
# publish to npm
npm publish
```

**Tip**: Don't commit built files in Pull Requests, it forces rebases on other PRs. The core team will take care of regularily updating these built files.

## License

ng-admin is licensed under the [MIT Licence](LICENSE), and sponsored by [marmelab](http://marmelab.com).
