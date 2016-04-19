# Translation

The ng-admin interface uses English as the default language, but supports switching to another language, thanks to [angular-translate](https://angular-translate.github.io/). You just need to provide a dictionary translating the following terms:

```js
{
    'BACK': 'Back',
    'DELETE': 'Delete',
    'CREATE': 'Create',
    'EDIT': 'Edit',
    'EXPORT': 'Export',
    'ADD_FILTER': 'Add filter',
    'SEE_RELATED': 'See all related {{ entityName }}',
    'LIST': 'List',
    'SHOW': 'Show',
    'SAVE': 'Save',
    'N_SELECTED': '{{ length }} Selected',
    'ARE_YOU_SURE': 'Are you sure?',
    'YES': 'Yes',
    'NO': 'No',
    'FILTER_VALUES': 'Filter values',
    'CLOSE': 'Close',
    'CLEAR': 'Clear',
    'CURRENT': 'Current',
    'REMOVE': 'Remove',
    'ADD_NEW': 'Add new {{ name }}',
    'BROWSE': 'Browse',
    'N_COMPLETE': '{{ progress }}% Complete',
    'CREATE_NEW': 'Create new',
    'SUBMIT': 'Submit',
    'SAVE_CHANGES': 'Save changes',
    'BATCH_DELETE_SUCCESS': 'Elements successfully deleted',
    'DELETE_SUCCESS': 'Element successfully deleted',
    'ERROR_MESSAGE': 'Oops, an error occurred (code: {{ status }})',
    'INVALID_FORM': 'Invalid form',
    'CREATION_SUCCESS': 'Element successfully created',
    'EDITION_SUCCESS': 'Changes successfully saved',
    'ACTIONS': 'Actions',
    'PAGINATION': '<strong>{{ begin }}</strong> - <strong>{{ end }}</strong> of <strong>{{ total }}</strong>',
    'NO_PAGINATION': 'No record found',
    'PREVIOUS': '« Prev',
    'NEXT': 'Next »',
    'DETAIL': 'Detail',
    'STATE_CHANGE_ERROR': 'State change error: {{ message }}',
    'NOT_FOUND': 'Not Found',
    'NOT_FOUND_DETAILS': 'The page you are looking for cannot be found. Take a break before trying again.',
}
```

*Tip*: For an always up-to-date list of terms to translate, check out [translate.js](https://github.com/marmelab/ng-admin/blob/master/src/javascripts/ng-admin/Main/config/translate.js) in ng-admin source.

For instance, here is how to display all labels in French:

```js
myApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('fr', {
      'BACK': 'Retour',
      'DELETE': 'Supprimer',
      'CREATE': 'Ajouter',
      'EDIT': 'Mofidier',
      'EXPORT': 'Exporter',
      'ADD_FILTER': 'Filtrer',
      'SEE_RELATED': 'Voir les {{ entityName }} liés',
      'LIST': 'Liste',
      'SHOW': 'Détails',
      'SAVE': 'Enregistrer',
      'N_SELECTED': '{{ length }} sélectionnés',
      'ARE_YOU_SURE': 'Cette modification est définitive. Confirmez-vous ?',
      'YES': 'Oui',
      'NO': 'Non',
      'FILTER_VALUES': 'Filtrer',
      'CLOSE': 'Fermer',
      'CLEAR': 'Vider',
      'CURRENT': 'Aujourd\'hui',
      'REMOVE': 'Retirer',
      'ADD_NEW': 'Ajouter un nouveau {{ name }}',
      'BROWSE': 'Parcourir',
      'N_COMPLETE': '{{ progress }}% terminé',
      'CREATE_NEW': 'Créer',
      'SUBMIT': 'Valider',
      'SAVE_CHANGES': 'Enregistrer',
      'BATCH_DELETE_SUCCESS': 'Suppression enregistrée',
      'DELETE_SUCCESS': 'Suppression enregistrée',
      'ERROR_MESSAGE': 'Erreur serveur (code: {{ status }})',
      'INVALID_FORM': 'Formulaire invalide',
      'CREATION_SUCCESS': 'Création enregistrée',
      'EDITION_SUCCESS': 'Modifications enregistrées',
      'ACTIONS': 'Actions',
      'PAGINATION': '<strong>{{ begin }}</strong> - <strong>{{ end }}</strong> sur <strong>{{ total }}</strong>',
      'NO_PAGINATION': 'Aucun résultat',
      'PREVIOUS': '« Précédent',
      'NEXT': 'Suivant »',
      'DETAIL': 'Detail',
      'STATE_CHANGE_ERROR': 'Erreur de routage: {{ message }}',
      'NOT_FOUND': 'Page non trouvée',
      'NOT_FOUND_DETAILS': 'La page demandée n\'existe pas. Revenez à la page précédente et essayez autre chose.',
    });
    $translateProvider.preferredLanguage('fr');
}]);
```

All labels and titles are translatable too. By default, ng-admin will appy the translation filter on all of them. For example, if you have a `users` entity, ng-admin generate a `Users` title for the menu if you add one with:
```js
admin.menu(nga.menu()
    .addChild(nga
        .menu(admin.getEntity('users'))
        .icon('<span class="fa fa-user"></span>')
    )
);
```

You can then supply a translation with the key `Users`. If you'd like that key to have the same case as the others, just call the `title` method with the desired key and supply a translation with the same key:
```js
admin.menu(nga.menu()
    .addChild(nga
        .menu(admin.getEntity('users'))
        .icon('<span class="fa fa-user"></span>')
        .title('USERS')
    )
);
```

The same principle can be applied to fields labels, choices labels and entities labels:
```js
nga.field('email'); // translation key will be 'Email'
nga.field('email').label('EMAIL'); // translation key will be 'EMAIL'

nga.field('role', 'choice')
    .validation({ required: true })
    .choices([
        { label: 'ADMIN', value: 'admin' }, // translation key will be 'ADMIN'
        { label: 'USER', value: 'user' }, // translation key will be 'USER'
    ]);

admin.addEntity(nga.entity('users')); // translation key will be 'Users' (for list view and menus) and 'user' (for creation and edition views)
admin.addEntity(nga.entity('users').title('USERS')); // translation key will be 'USERS' (for list view and menus) and 'USER' (for creation and edition views)
```

If you need to translate the views titles and descriptions, just use the translate filter yourself in the template you supply. For example:

```js
// In your entity configuration file
users.listView()
    .title('"USER_LIST" | translate');

users.creationView()
    .title('{{ "USER_CREATE" | translate }}')

users.editView()
    .title('{{ "USER_EDIT" | translate }}{{ entry.values["email"] }}');

users.deletionView()
    .title('{{ "USER_DELETE" | translate }}{{ entry.values["email"] }}');

// In your translations file
myApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('fr', {
        USER_LIST: 'Liste des utilisateurs',
        USER_CREATE: 'Création d\'un utilisateur: ',
        USER_EDIT: 'Edition de l\'utilisateur: ',
        USER_DELETE: 'Suppression de l\'utilisateur: ',
    });
}
```


To enable runtime language switch, or other options, refer to the [angular-translate documentation](http://angular-translate.github.io/docs/#/guide).
