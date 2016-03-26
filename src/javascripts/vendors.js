require('es6-promise').polyfill(); // for IE

require('../../node_modules/restangular/dist/restangular.js');
window.NProgress = require('../../node_modules/nprogress/nprogress.js');
window.Papa = require('../../node_modules/papaparse/papaparse.js');
window.humane = require('../../node_modules/humane-js/humane.js');
window.jsonlint = require('../../node_modules/jsonlint/web/jsonlint.js');

var codemirror = require('codemirror');

global.jsonlint = require('jsonlint/web/jsonlint.js');

require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');
require('codemirror/addon/selection/active-line');
require('codemirror/mode/javascript/javascript');

codemirror.defineOption("matchBrackets", true);
codemirror.defineOption("autoCloseBrackets", true);
codemirror.defineOption("lineWrapping", true);
codemirror.defineOption("tabSize", 2);
codemirror.defineOption("mode", "application/json");
codemirror.defineOption("gutters", ["CodeMirror-lint-markers"]);
codemirror.defineOption("lint", true);
codemirror.defineOption("styleActiveLine", true);

global.CodeMirror = codemirror;

global.rangy = require('../../node_modules/rangy/lib/rangy-core');
global.rangy = require('../../node_modules/rangy/lib/rangy-selectionsaverestore');
global.numeral = require('numeral');

require('angular-ui-router');
require('../../node_modules/textangular/dist/textAngular-sanitize');
require('angular-ui-codemirror');
require('nginflection');
require('textangular');
require('ui-select');

require('../../node_modules/angular-numeraljs/dist/angular-numeraljs');
require('angular-ui-bootstrap/dist/ui-bootstrap-tpls');
require('../../node_modules/ng-file-upload/dist/ng-file-upload');

global._ = require('underscore');
