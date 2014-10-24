define(function(require) {
    'use strict';

    var angular   = require('angular'),
        fileFieldView = require('text!../../../view/field/file.html'),
        FileUploadController = require('ng-admin/Crud/component/controller/directive/FileUploadController');

    function FileField() {
        return {
            restrict: 'E',
            template: fileFieldView,
            controllerAs: 'fileupload',
            controller: FileUploadController
        };
    }

    FileField.$inject = [];

    return FileField;
});
