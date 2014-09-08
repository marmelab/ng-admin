require.config({
    paths: {
        'text' : 'bower_components/requirejs-text/text',
        'domReady' : 'bower_components/requirejs-domready/domReady',
        'MainModule': 'app/Main/MainModule',
        'CrudModule': 'app/Crud/CrudModule'
    },
    modules: [
        {
            name: 'ng-admin',
            include: [
                'text',
                'MainModule',
                'CrudModule'
            ],
            exclude: [
                'common',
                'common-famous'
            ]
        }
    ]
});
