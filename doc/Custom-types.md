# Adding Custom Types

When you map a field between a REST API response and ng-admin, you give it a type. This type determines how the data is displayed and edited. It is very easy to customize existing ng-admin types and add new ones.

## Understanding Types

A ng-admin *type* has two components:

- a Field class, used to configure the field
- a FieldView class, used for rendering

Let's see that through an example: the `number` type. 

When you define a field with `nga.field()`, the second argument is the field type ('string' by default). `nga.field()` is a factory method returning an specialized instance of [the `Field` class](https://github.com/marmelab/admin-config/blob/master/lib/Field/Field.js). For instance:

```js
product.listView().fields([
    nga.field('price', 'number')
        .format('$0.00')
]);
```

The call to `nga.field('price', 'number')` translates to `new NumberField('price')`. The [`NumberField` class source](https://github.com/marmelab/admin-config/blob/master/lib/Field/NumberField.js) is:

```js
import Field from "./Field";
class NumberField extends Field {
    constructor(name) {
        super(name);
        this._type = "number";
        this._format = undefined;
    }

    /**
     * Specify format pattern for number to string conversion. 
     */
    format(value) {
        if (!arguments.length) return this._format;
        this._format = value;
        return this;
    }
}
export default NumberField;
```

Yep, this is ES6 syntax, but you get the idea. The sole purpose of a `Field` instance is to store configuration - not data (ng-admin stores data in another object, called the `DataStore`). Here, the `NumberField` can store a rendering format in addition to normal `Field` capabilities.

Once it has fetched data from REST endpoints, ng-admin displays it on screen. What will it be: an image, a text input, an elaborate date widget? This depends on the type, of course, but also on the view. The rendering rules for each type are contained in `FieldView` objects. For instance, the [`NumberFieldView` source](https://github.com/marmelab/ng-admin/blob/master/src/javascripts/ng-admin/Crud/fieldView/NumberFieldView.js) is:

```js
module.exports = {
    // displayed in listView and showView
    getReadWidget:   () => '<ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column>',
    // displayed in listView and showView when isDetailLink is true
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    // displayed in the filter form in the listView
    getFilterWidget: () => '<ma-input-field type="number" field="::field" value="values[field.name()]"></ma-input-field>',
    // displayed in editionView and creationView
    getWriteWidget:  () => '<ma-input-field type="number" field="::field" value="entry.values[field.name()]"></ma-input-field>'
};
```

What this means is that, to render a `NumberField` in a `listView`, ng-admin will use the related `ReadWidget`, which is:

```
<ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column>
```

The `<ma-number-column>` is a directive defined by ng-admin, but what it essentially does is the following:

```
<span>{{ value() | numeraljs:field().format() }}</span>
```

So a field of type 'number' renders in a `listView` as a formatted number string (e.g. `<span>$45.99</span>`).

One thing that may sound curious is that the configuration logic (`Field` subclasses) is defined in the `admin-config` module, while the rendering logic (`FieldView` subclasses) is defined in the `ng-admin` module. Don't let it confuse you. This is just because the configuration logic can be reused by another renderer not based on Angular.js (e.g. [react-admin](https://github.com/marmelab/react-admin)).

One last thing to understand is that ng-admin uses the field type *name* (e.g. 'number') to relate a Field subclass with a FieldView subclass. For type 'number', the [registered Field subclass  is `NumberField`](https://github.com/marmelab/admin-config/blob/master/lib/Factory.js#L116), and [the registered FieldView subclass is `NumberFieldView`](https://github.com/marmelab/ng-admin/blob/master/src/javascripts/ng-admin/Crud/config/factories.js#L11). You'll see shortly how to register your own classes.

## Writing a Custom Field Class

Let's write an `AmountField` to manage not only numbers, but amounts. An amount, in addition to a number, has a currency. Create the following `AmountType.js` class in your project tree:

```js
import NumberField from 'admin-config/lib/Field/NumberField';
class AmountField extends NumberField {
    constructor(name) {
        super(name);
        this._currency = '$';
    }
    currency(currency) {
        if (!arguments.length) return this._currency;
        this._currency = currency;
        return this;
    }
}
export default AmountField;
```

Compared to a `NumberField`, this adds a `.currency()` method, which is both a getter and a setter. The `AmountField` code is ES6, so you'll need to transpile it to JavaScript to make it executable by a web browser. The solution depends on your build tool ; here is the configuration for [Webpack](http://webpack.github.io/) and [babel](https://babeljs.io/).

```js
// in webpack.config.js
module.exports = {
    // ...
    module: {
        loaders: [
            { test: /\.js/, loaders: ['babel'], exclude: /node_modules/ },
        ]
    }
};
```

The `AmountField` class depends on the `NumberField` class from the `admin-config` module. You'll have to install it.

```sh
npm install admin-config --save-dev
```

This module is also written in ES6, so update the `exclude` pattern in `webpack.config.js` to let Webpack transpile all "*.js" file, except the ones under `node_modules`, but including `node_modules/admin-config`:

```js
// in webpack.config.js
module.exports = {
    // ...
    module: {
        loaders: [
            { test: /\.js/, loaders: ['babel'], exclude: /node_modules\/(?!admin-config)/ }
        ]
    }
};
```

You need to *register* this new field type in your application:

```js
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('amount', require('path/to/AmountField'))
}]);
```

Now you can use the new type in your admin configuration:

```js
product.listView().fields([
    nga.field('price', 'amount')
        .format('0.00')
        .currency('$')
]);
```

## Defining The Rendering Logic For a Type

An `amount` field will render as text with the currency in read context, and as an input with a lateral addon in write context. Create the following `AmountFieldView` to define the rendering logic:

```js
export default {
    getReadWidget:   () => '{{ field.currency() }}<ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column>',
    getLinkWidget:   () => '<a ng-click="gotoDetail()">' + module.exports.getReadWidget() + '</a>',
    getFilterWidget: () => '<ma-input-field type="number" step="any" field="::field" value="values[field.name()]"></ma-input-field>',
    getWriteWidget:  () => '<div class="input-group"><span class="input-group-addon">{{ field.currency() }}</span><ma-input-field type="number" step="any" field="::field" value="entry.values[field.name()]"></ma-input-field></div>'
};
```

You also need to *register* this new field view type in your application for ng-admin to find it. Beware that it's a different configuration provider this time:

```js
myApp.config(['FieldViewConfigurationProvider', function(fvp) {
    fvp.registerFieldView('amount', require('path/to/AmountFieldView'))
}]);
```

## Using Custom Directives

Optionally, you can write a custom directive, and use that directive in one of the widget definitions.

```js
function amountStringDirective() {
    return {
        restrict: 'E',
        scope: {
            value: '&',
            field: '&'
        },
        template: '<span>{{ field().currency() }}{{ value() | numeraljs:field().format() }}</span>'
    };
}
export default amountStringDirective;
```

```js
myApp.directive('amountString', require('path/to/amountStringDirective.js'));
```

```js
// in AmountFieldView.js
export default {
    getReadWidget:   () => '<amount-string field="::field" value="::entry.values[field.name()]"></amount-string>',
    // ...
};
```

## Overriding Existing Types

Just like you can add new types, it's very easy to override existing types. For instance, if you want all `number` fields to use a directive of yours called `<my-number>`, create a `CustomNumberFieldView` script as follows:

```js
module.exports = {
    getReadWidget:   () => '<my-number field="::field" value="::entry.values[field.name()]"></my-number>',
    // ...
};
```

Then, register this field view for the `number` type:

```js
myApp.config(['FieldViewConfigurationProvider', function(fvp) {
    fvp.registerFieldView('number', require('path/to/CustomNumberFieldView'))
}]);
```

## Conclusion

Once you get passed the installation step, defining new types is straightforward. It's also a very powerful way to extend ng-admin to your custom needs. Use it as much as possible!
