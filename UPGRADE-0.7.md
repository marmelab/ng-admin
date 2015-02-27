# Upgrade to 0.7

ng-admin 0.7 breaks compatibility with 0.5 and makes the "factories" configuration API compulsory. If your configuration uses `nga.field()`, it will still work woth 0.7. If it uses `new Field()`, you'll need to follow [the 0.6 upgrade guide](https://github.com/marmelab/ng-admin/blob/b3c7b1afc6a52651df6ba4454d8461620339b4da/UPGRADE-0.6.md).
