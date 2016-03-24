# Translation

The ng-admin interface uses English as the default language, but supports switching to another language, thanks to [angular-translate](https://angular-translate.github.io/).

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

To enable runtime language switch, or other options, refer to the [angular-translate documentation](http://angular-translate.github.io/docs/#/guide).
