require.config({
    paths: {
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
            exclude: ['common']
        }
    ]
});
