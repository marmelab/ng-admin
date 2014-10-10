define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        name: 'myAction',
        label: 'My action',
        order: null,
        redirect : null,
        action: null
    };

    /**
     * @constructor
     */
    function Action(name) {
        this.config = angular.copy(config);
        this.config.name = name || 'myAction';
    }

    Configurable(Action.prototype, config);

    return Action;
});
