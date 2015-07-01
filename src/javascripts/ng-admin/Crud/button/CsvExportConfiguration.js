define(function () {
    'use strict';
    function CsvExportConfiguration() {
        this.csvExportConfig = {
            papaparseConfig : {
                quotes: false,
                delimiter: ",",
                newline: "\r\n"
            },
            getPapaparseConfig: function() {
                return this.papaparseConfig;
            }
        }
    }

    CsvExportConfiguration.prototype.$get = function() {
        return this.csvExportConfig;
    }
    CsvExportConfiguration.prototype.set = function(type, value) {
        this.csvExportConfig.papaparseConfig[type] = value;
    }

    CsvExportConfiguration.$inject = [];

    return CsvExportConfiguration;
});
