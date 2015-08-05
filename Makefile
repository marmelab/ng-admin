.PHONY: build

install:
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@grunt

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress
	@cp -Rf build examples/blog/
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test:
	@grunt test:local
