function factories(fvp) {
    fvp.registerFieldView('boolean', require('../fieldView/BooleanFieldView'));
    fvp.registerFieldView('choice', require('../fieldView/ChoiceFieldView'));
    fvp.registerFieldView('choices', require('../fieldView/ChoicesFieldView'));
    fvp.registerFieldView('date', require('../fieldView/DateFieldView'));
    fvp.registerFieldView('datetime', require('../fieldView/DateTimeFieldView'));
    fvp.registerFieldView('email', require('../fieldView/EmailFieldView'));
    fvp.registerFieldView('file', require('../fieldView/FileFieldView'));
    fvp.registerFieldView('float', require('../fieldView/FloatFieldView'));
    fvp.registerFieldView('json', require('../fieldView/JsonFieldView'));
    fvp.registerFieldView('number', require('../fieldView/NumberFieldView'));
    fvp.registerFieldView('password', require('../fieldView/PasswordFieldView'));
    fvp.registerFieldView('referenced_list', require('../fieldView/ReferencedListFieldView'));
    fvp.registerFieldView('reference', require('../fieldView/ReferenceFieldView'));
    fvp.registerFieldView('reference_many', require('../fieldView/ReferenceManyFieldView'));
    fvp.registerFieldView('string', require('../fieldView/StringFieldView'));
    fvp.registerFieldView('template', require('../fieldView/TemplateFieldView'));
    fvp.registerFieldView('text', require('../fieldView/TextFieldView'));
    fvp.registerFieldView('wysiwyg', require('../fieldView/WysiwygFieldView'));
}

factories.$inject = ['FieldViewConfigurationProvider'];

module.exports = factories;
