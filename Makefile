.PHONY: build

install:
	bower install
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@grunt

build: devel
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress
	@cp -Rf build examples/blog/
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

devel:
	@NODE_ENV=development ./node_modules/webpack/bin/webpack.js -d --progress
	@echo "Files build/ng-admin.css and build/ng-admin.js updated"


test:
	@grunt test:local
