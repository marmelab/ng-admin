.PHONY: build

install:
	npm install

run: examples/blog/build
	@cp node_modules/fakerest/dist/FakeRest.min.js examples/blog/build/fakerest.js
	@cp node_modules/angular/angular.min.js examples/blog/build/angular.min.js
	@cp node_modules/sinon/pkg/sinon-server-1.14.1.js examples/blog/build/sinon-server.js
	@./node_modules/.bin/webpack-dev-server --minimize --colors --devtool cheap-module-inline-source-map --hot --inline --content-base examples/blog --host=0.0.0.0 --port 8000

examples/blog/build:
	@mkdir examples/blog/build

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress --devtool source-map
	@cp -Rf build examples/blog/
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test: test-unit test-e2e

test-unit:
	@./node_modules/.bin/karma start src/javascripts/test/karma.conf.js --single-run

test-e2e: prepare-test-e2e
	@./node_modules/.bin/protractor src/javascripts/test/protractor.conf.js

prepare-test-e2e:
	@echo "Preparing files for e2e tests"
	@NODE_ENV=test ./node_modules/.bin/webpack -p --optimize-minimize --optimize-occurence-order --optimize-dedupe
	@cp node_modules/fakerest/dist/FakeRest.min.js examples/blog/build/fakerest.js
	@cp node_modules/angular/angular.min.js examples/blog/build/angular.min.js
	@cp node_modules/sinon/pkg/sinon-server-1.14.1.js examples/blog/build/sinon-server.js
