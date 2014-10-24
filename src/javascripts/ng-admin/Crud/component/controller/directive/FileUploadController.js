define(function(require) {
    'use strict';

    /**
     * @param {$scope} $scope
     * @param {FileUploader} FileUploader
     * @param {progress} progress
     * @param {notification} notification
     * @constructor
     */
    function FileUploadController($scope, FileUploader, progress, notification) {
        this.$scope = $scope;
        this.uploader = $scope.uploader = new FileUploader({
            url : '/static/upload'
        });
        this.progress = progress;
        this.notification = notification;

        // CALLBACKS
        this.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };

        this.uploader.onAfterAddingFile = function(fileItem) {
            //console.info('onAfterAddingFile', fileItem);
        };

        this.uploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };

        this.uploader.onBeforeUploadItem = function(item) {
            //console.info('onBeforeUploadItem', item);
        };

        this.uploader.onProgressItem = function(fileItem, progress) {
            //console.info('onProgressItem', fileItem, progress);
        };

        this.uploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };

        this.uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessItem', fileItem, response, status, headers);
        };

        this.uploader.onErrorItem = function(fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
        };

        this.uploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };

        this.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //console.info('onCompleteItem', fileItem, response, status, headers);
        };

        this.uploader.onCompleteAll = function() {
            //console.info('onCompleteAll');
        };
    }

    FileUploadController.$inject = ['$scope', 'FileUploader', 'progress', 'notification'];

    return FileUploadController;
});
