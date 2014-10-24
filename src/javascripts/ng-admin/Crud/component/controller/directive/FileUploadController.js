define(function(require) {
    'use strict';

    /**
     * @param {$scope} $scope
     * @param {$upload} $upload
     * @param {progress} progress
     * @param {notification} notification
     * @constructor
     */
    function FileUploadController($scope, $upload, progress, notification) {
        this.$scope = $scope;
        this.$upload = $upload;
        this.progress = progress;
        this.notification = notification
    }

    FileUploadController.prototype.upload = function($files) {
        this.progress.start();
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var self = this,
                file = $files[i];

            this.$upload.upload({
                url: '/static/upload', //upload.php script, node.js route, or servlet url
                method: 'POST',// or 'PUT',
                //headers: {'Content-type': 'application/json'},
                //withCredentials: true,
                file: file // or list of files ($files) for html5 only
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Disposition'), server side file variable name.
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).progress(function (evt) {
                self.$scope.uploading = true;
            }).success(function (data, status, headers, config) {
                self.notification.log('File uploaded successfully.', {addnCls: 'humane-flatty-success'});
                self.$scope.uploading = false;
                self.progress.done();
            }).error(function () {
                self.notification.log('File is not uploaded.', {addnCls: 'humane-flatty-error'});
                self.$scope.uploading = false;
                self.progress.done();
            });
        }
    };

    FileUploadController.$inject = ['$scope', '$upload', 'progress', 'notification'];

    return FileUploadController;
});
