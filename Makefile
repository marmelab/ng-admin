.PHONY: build

install:
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@cp node_modules/angular/angular.min.js examples/blog/build/angular.min.js
	@cp node_modules/sinon/pkg/sinon-server-1.14.1.js examples/blog/build/sinon-server.js
	@cp node_modules/angular/angular.js examples/blog/build/angular.js
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --colors --devtool cheap-module-inline-source-map --content-base examples/blog --port 8000

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress --devtool source-map
	@cp -Rf build examples/blog/
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test:
	@./node_modules/.bin/grunt test:local
