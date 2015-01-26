/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a file - a file uploader.
     *
     * @example <ma-file-field field="field"></ma-file-field>
     */
    function maFileField($upload, $compile) {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function(scope, element) {
                console.log($upload);
                var field = scope.field();
                scope.name = field.name();
                scope.v = field.validation();
                var input = element.children()[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    input[name] = attributes[name];
                }
                scope.fileSelected = function(files, events) {
                    $upload
                        .upload(field.config.uploadInformation)
                        .progress(function(evt) {
                            //console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
                        })
                        .success(function(data, status, headers, config) {
                            scope.value = config.file.name;
                        })
                        .error(function(data) {
                            //error
                            console.log(data);
                            scope.value = null;
                        });
                };

                var template =
'<input type="file" ng-file-select ng-model="files" ng-file-change="fileSelected($files, $event)"' + 
    'id="{{ name }}" name="{{ name }}" ng-required="v.required" />';

                var newElement = angular.element(template);
                $compile(newElement)(scope);
                element.replaceWith(newElement);
                $(newElement).bootstrapFileInput();
            }
        };
    }

    maFileField.$inject = ['$upload', '$compile'];

    return maFileField;
});
