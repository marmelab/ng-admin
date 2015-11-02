/*global define*/

define(function (require) {
    'use strict';

    /**
     * Edition field for a file - a file uploader.
     *
     * @example <ma-file-field field="field"></ma-file-field>
     */
    function maFileField(Upload) {
        return {
            scope: {
                'field': '&',
                'value': '=',
                'files': '=',
            },
            restrict: 'E',
            link: {
                pre: function(scope) {
                    var uploadInformation = scope.field().uploadInformation();
                    if (!uploadInformation.hasOwnProperty('url')) {
                        throw new Error('You must provide a URL property to allow the upload of files.');
                    }

                    scope.multiple = uploadInformation.hasOwnProperty('multiple') ? uploadInformation.multiple : false;
                    scope.accept = "*";
                    if (uploadInformation.hasOwnProperty('accept')) {
                        scope.accept = uploadInformation.accept;
                    }
                    scope.apifilename = uploadInformation.hasOwnProperty('apifilename') ? uploadInformation.apifilename : false;

                    var files = scope.value ? scope.value.split(',') : [];
                    scope.files = {};
                    for (var file in files) {
                        scope.files[files[file]] = {
                            "name": files[file],
                            "progress": 0,
                            "success": null,
                            "error": null,
                            "new": false,
                        };
                    }
                },
                post: function(scope, element) {
                    var field = scope.field();
                    scope.name = field.name();
                    scope.v = field.validation();
                    if (scope.value) {
                        scope.v.required = false;
                    }
                    scope.buttonLabel = field.buttonLabel();
                    var input = element.find('input')[0];
                    var attributes = field.attributes();
                    for (var name in attributes) {
                        input.setAttribute(name, attributes[name]);
                    }

                    scope.uploadInProgress = false;

                    scope.fileSelected = function(selectedFiles) {
                        if (!selectedFiles || !selectedFiles.length) {
                            return;
                        }

                        var uploadParams;

                        scope.uploadInProgress = true;
                        var fileUploaded = 0;

                        scope.files = {};
                        for (var file in selectedFiles) {
                            uploadParams = angular.copy(scope.field().uploadInformation());
                            uploadParams.data = { file: selectedFiles[file] };
                            Upload
                                .upload(uploadParams)
                                .then((response) => {
                                    const fileName = response.config.data.file.name;
                                    scope.files[fileName] = {
                                        "name": scope.apifilename && response.data[scope.apifilename] ? response.data[scope.apifilename] : fileName,
                                        "progress": 0,
                                        "success": response.data,
                                        "new": true,
                                    };
                                    var names = Object.keys(scope.files).map(function(fileindex) {
                                        return scope.files[fileindex].name;
                                    });
                                    console.log(scope.files);
                                    scope.value = names.join(',');
                                    ++fileUploaded;
                                    if (fileUploaded === selectedFiles.length) {
                                        scope.uploadInProgress = false;
                                    }
                                }, (response) => {
                                    const fileName = response.config.data.file.name;
                                    scope.files[fileName] = {
                                        "name": fileName,
                                        "progress": 0,
                                        "error": response.data,
                                        "new": true,
                                    };
                                    console.log(scope.files);
                                    ++fileUploaded;
                                    if (fileUploaded === selectedFiles.length) {
                                        scope.uploadInProgress = false;
                                    }
                                }, (evt) => {
                                    const name = evt.config.data.file.name;
                                    const progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                    scope.files[name] = {
                                        name,
                                        progress,
                                        "new": true,
                                    };
                                    console.log(scope.files);
                                });
                        }
                    };

                    scope.selectFile = function () {
                        input.click();
                    };
                }
            },
            template:
'<div class="row">' +
    '<div class="col-md-2">' +
        '<a class="btn btn-default" ng-click="selectFile()" ng-disabled="uploadInProgress">' +
            '<span>{{ buttonLabel }}</span>' +
        '</a>' +
    '</div>' +
    '<div class="col-md-10">' +
        '<div class="row" ng-repeat="file in files track by $index">' +
            '<div class="col-md-3" style="padding-top: 6px;">' +
                '<div class="progress" style="margin-bottom: 0;" ng-if="file.progress">' +
                    '<div class="progress-bar" role="progressbar" aria-valuenow="{{ file.progress }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ file.progress }}%;">' +
                        '<span class="sr-only">{{ file.progress }}% Complete</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-md-9" style="padding-top: 6px;"><small><em>' +
            '<span class="text-success" ng-show="file.success">{{ file.name }} successfully uploaded</span>' +
            '<span class="text-danger" ng-show="file.error">{{ file.name }} upload error: "{{ file.error }}"</span>' +
            '<span class="text-muted" ng-show="!file.success && !file.error && file.new">{{ file.name }}</span>' +
            '<span class="text-muted" ng-show="!file.success && !file.error">{{ file.name }}</span>' +
            '<em><small></div>' +
        '</div>' +
    '</div>' +
'</div>' +
'<input type="file" ngf-multiple="multiple" accept="{{ accept }}" ngf-select="fileSelected($files)"' +
        'id="{{ name }}" name="{{ name }}" ng-required="v.required" style="display:none" />'
        };
    }

    maFileField.$inject = ['Upload'];

    return maFileField;
});
