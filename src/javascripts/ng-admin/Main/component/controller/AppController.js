var AppController = function ($scope, $state) {
    this.$scope = $scope;
    this.$state = $state;
};


AppController.prototype.displayHome = function () {
    this.$state.go(this.$state.get('dashboard'));
};

AppController.prototype.destroy = function () {
    this.$scope = undefined;
    this.$state = undefined;
};

AppController.$inject = ['$scope', '$state'];

module.exports = AppController;
