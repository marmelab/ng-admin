.PHONY: build

install:
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@./node_modules/.bin/grunt

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress --devtool source-map
	@cp -Rf build examples/blog/
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test:
	@./node_modules/.bin/grunt test:local
