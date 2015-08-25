# Adding Custom Types

When you map a field between a REST API response and ng-admin, you give it a type. This type determines how the data is displayed and edited. It is very easy to customize existing ng-admin types and add new ones.

## Configuration Types

Each time you define a field, you give it a type. For instance:

```js
myEntity.listView().fields([
    nga.field('name'),                               // 'string' type
    nga.field('birth_date', 'date').format('small'), // 'date' type
]);
```

`nga.field()` is a factory method returning an instance of [the `Field` class](https://github.com/marmelab/admin-config/blob/master/lib/Field/Field.js). Such instances are containers for your application configuration. For some types, the instance returned by `nga.field()` is a specialized subclass of `Field`, with methods specific to this type (like `format()` for [the `DateField` class](https://github.com/marmelab/admin-config/blob/master/lib/Field/DateField.js)). These methods are later used in the presentation layer to get the specific configuration for that type.

You can change the field class returned by `nga.field()` for a given type at configuration time. For instance, to change the `Field` class for the 'date' type:

```js
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('date', require('path/to/MyCustomDateField'))
}]);
```

You custom type should extend the `Field` type at least, or another existing type.

```js
// in path/to/MyCustomDateField.js
// ES6 version
import DateField from 'admin-config/lib/Field/DateField';
export default class MyCustomDateField extends DateField {
    formatSmall() {
        return this.format('small');
    }
}

// ES5 version
var DateField = require('admin-config/lib/Field/DateField');
function MyCustomDateField(name) {
    DateField.call(this, name);
}
MyCustomDateField.prototype = new DateField();
MyCustomDateField.prototype.formatSmall = function() {
    return this.format('small');
}
module.exports = MyCustomDateField;
```

Use the same technique to add a new type.

```js
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('tax_rate', require('path/to/TaxRateField'))
}]);
```

## View Types

A given type renders in a different way in the views of the administration. For instance, a 'date' field renders as a formatted date in the `listView`, and as a datepicker widget in the `editionView`. The mapping between a type and the widget to use for a given view is done in `FieldView` objects. 

For instance, here is the `DateFieldView` object:

```js
var DateFieldView = {
    // displayed in listView and showView
    getReadWidget: function getReadWidget() {
        return '<ma-date-column field="::field" value="::entry.values[field.name()]"></ma-date-column>';
    },
    // displayed in listView and showView when isDetailLink is true
    getLinkWidget: function getLinkWidget() {
        return '<a ng-click="gotoDetail()">' + getReadWidget() + '</a>';
    },
    // displayed in the filter form in the listView
    getFilterWidget: function getFilterWidget() {
        return '<ma-date-field field="::field" value="values[field.name()]"></ma-date-field>';
    },
    // displayed in editionView and creationView
    getWriteWidget: function getWriteWidget() {
        return '<div class="row"><ma-date-field field="::field" value="entry.values[field.name()]" class="col-sm-4"></ma-date-field></div>';
    }
}
```

As you can see, the mapping uses ng-admin directives (like `<ma-date-column>`). It can also use any custom directive defined by you.

`FieldView` objects, just like `Field` classes, are registered at configuration time, and can be easily overriden. 

```js
myApp.config(['FieldViewConfigurationProvider', function(fvp) {
    fvp.registerFieldView('date', require('path/to/MyCustomDateFieldView'))
}]);
```
