/**
 * @param {$scope}  $scope
 * @param {$state}  $state
 * @param {NgAdmin} Configuration
 * @constructor
 */
export default class AppController {
    constructor($scope, $state, Configuration) {
        var application = Configuration();
        this.$scope = $scope;
        this.$state = $state;
        this.$scope.isCollapsed = true;
        this.menu = application.menu();
        this.applicationName = application.title();
        this.header = application.header();

        $scope.$on('$destroy', this.destroy.bind(this));
    }

    displayHome() {
        this.$state.go(this.$state.get('dashboard'));
    }

    destroy() {
        this.$scope = undefined;
        this.$state = undefined;
    }
}

AppController.$inject = ['$scope', '$state', 'NgAdminConfiguration'];
