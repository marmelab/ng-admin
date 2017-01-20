const location = ($locationProvider) => {
    // Keep the start of all routes to #/ instead of #!/
    // while updating to Angular 1.6
    // @see https://docs.angularjs.org/guide/migration#commit-aa077e8
    $locationProvider.hashPrefix('');
};

location.$inject = ['$locationProvider'];

export default location;
