function NgAdminConfiguration($compileProvider) {
    this.config = null;
    this.adminDescription = null;
    this.$compileProvider = $compileProvider;
}

NgAdminConfiguration.prototype.setAdminDescription = function(adminDescription) {
    this.adminDescription = adminDescription;
};

NgAdminConfiguration.prototype.configure = function (config) {
    this.config = config;

    this.$compileProvider.debugInfoEnabled(this.config.debug());
};

NgAdminConfiguration.prototype.$get = function () {
    var config = this.config;
    return function () {
        return config;
    };
};

NgAdminConfiguration.prototype.application = function(name, debug) {
    return this.adminDescription.application(name, debug);
};

NgAdminConfiguration.prototype.entity = function(name) {
    return this.adminDescription.entity(name);
};

NgAdminConfiguration.prototype.field = function(name, type) {
    return this.adminDescription.field(name, type);
};

NgAdminConfiguration.prototype.registerFieldType = function(name, type) {
    return this.adminDescription.registerFieldType(name, type);
};

NgAdminConfiguration.prototype.menu = function(entity) {
    return this.adminDescription.menu(entity);
};

NgAdminConfiguration.prototype.collection = function(collection) {
    return this.adminDescription.collection(collection);
};

NgAdminConfiguration.prototype.dashboard = function(dashboard) {
    return this.adminDescription.dashboard(dashboard);
};

NgAdminConfiguration.$inject = ['$compileProvider'];

module.exports = NgAdminConfiguration;
