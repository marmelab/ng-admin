/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a file - a file uploader.
     *
     * @example <ma-file-field field="field"></ma-file-field>
     */
    function maFileField($upload, $compile, $timeout) {
        return {
            scope: {
                'field': '&',
                'value': '='
            },
            restrict: 'E',
            link: function(scope, element) {
                var field = scope.field();
                scope.name = field.name();
                scope.v = field.validation();
                var input = element.find('input')[0];
                var attributes = field.attributes();
                for (var name in attributes) {
                    input[name] = attributes[name];
                }

                var uploadInformation = field.config.uploadInformation;
                if (!uploadInformation.hasOwnProperty('url')) {
                    throw new Error('You must provide url configuration entry of uploadInformation file field.');
                }

                scope.multiple = uploadInformation.hasOwnProperty('multiple') ? uploadInformation.multiple : false;
                scope.accept = uploadInformation.hasOwnProperty('accept') ? uploadInformation.accept : '*';
                scope.progress = 0;

                scope.fileSelected = function(files) {
                    var uploadParams, file;

                    for (var file in files) {
                        uploadParams = angular.copy(uploadInformation);
                        uploadParams.file = files[file];

                        $upload
                            .upload(uploadParams)
                            .progress(function(evt) {
                                scope.value = files[file].name;
                                scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                            })
                            .success(function(data, status, headers, config) {
                                scope.progress = 0;
                                scope.value = files[file].name;
                            })
                            .error(function(data) {
                                //error
                                console.log(data);
                                scope.progress = 0;
                                scope.value = null;
                            });
                    }
                };

                scope.selectFile = function () {
                    $timeout(function() {
                        input.click();
                    }, 0);
                };
            },
            template:
'<div style="row">' +
    '<div class="col-md-2">' +
        '<a class="btn btn-default" ng-click="selectFile()" style="margin-left: -15px;">' +
            '<span>Browse</span>' +
        '</a>' +
    '</div>' +
    '<div class="col-md-2" ng-show="progress" style="padding-top: 6px;">' +
        '<div class="progress" style="margin-bottom: 0;">' +
            '<div class="progress-bar" role="progressbar" aria-valuenow="{{ progress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ progress }}%;">' +
                '<span class="sr-only">{{ progress }}% Complete</span>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="col-md-2" ng-show="value" style="padding-top: 6px;">{{ value }}</div>' +
    '<input type="file" ng-multiple="multiple" accept="accept" ng-file-select ng-model="files" ng-file-change="fileSelected($files)"' +
            'id="{{ name }}" name="{{ name }}" ng-required="v.required" style="display:none" />' +
'</div>'
        };
    }

    maFileField.$inject = ['$upload', '$compile', '$timeout'];

    return maFileField;
});
