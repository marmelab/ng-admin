export default function maField(FieldViewConfiguration, $compile) {
    return {
        restrict: 'E',
        scope: {
            field: '&',
            entry: '=',
            value: '=',
            entity: '&',
            form: '&',
            datastore: '&'
        },
        link: function(scope, element) {
            scope.field = scope.field();
            scope.type = scope.field.type();
            scope.entity = scope.entity();
            scope.form = scope.form();
            scope.datastore = scope.datastore();
            scope.getClassesForField = function(field, entry) {
                return 'ng-admin-field-' + field.name().replace('.', '_') + ' ' + 'ng-admin-type-' + field.type() + ' ' + (field.getCssClasses(entry) || 'col-sm-10 col-md-8 col-lg-7');
            };

            scope.getInputForField = function(field) {
                return scope.form[field.name()];
            };

            /**
             * Should validation status be displayed for a given field?
             *
             * - No for non-editable fields, or template fields which not have a corresponding input
             * - No for non-altered input
             * - Yes otherwise
             */
            scope.fieldHasValidation = function(field) {
                var input = this.getInputForField(field);
                return input && input.$dirty;
            };

            scope.fieldIsValid = function(field) {
                var input = this.getInputForField(field);
                return input && input.$valid;
            };

            scope.getFieldValidationClass = function(field) {
                if (this.fieldHasValidation(field)) {
                    return this.fieldIsValid(field) ? 'has-success' : 'has-error';
                }
            };

            var fieldTemplate;
            if (scope.field.editable()) {
                fieldTemplate =
`<div ng-class="getClassesForField(field, entry)">
    ${scope.field.getTemplateValue(scope.entry) || FieldViewConfiguration[scope.type].getWriteWidget()}
    <span ng-show="fieldHasValidation(field)" class="glyphicon form-control-feedback" ng-class="fieldIsValid(field) ? 'glyphicon-ok' : 'glyphicon-remove'"></span>
</div>`;
            } else {
                fieldTemplate =
`<div ng-class="field.getCssClasses(entry)||'col-sm-10'">
    <p class="form-control-static">
        <ma-column field="::field" entry="::entry" entity="::entity" datastore="::datastore"></ma-column>
    </p>
</div>`;
            }

            const template =
`<div id="row-{{ field.name() }}" class="has-feedback" ng-class="getFieldValidationClass(field)">
    <label for="{{ field.name() }}" class="col-sm-2 control-label">
        {{ field.label() }}<span ng-if="field.validation().required">&nbsp;*</span>&nbsp;
    </label>
    ${fieldTemplate}
</div>`;

            element.append(template);
            $compile(element.contents())(scope);
        }
    };
}

maField.$inject = ['FieldViewConfiguration', '$compile'];
