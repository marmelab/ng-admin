.PHONY: build

install:
	bower install
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --colors --host=0.0.0.0 &
	@grunt

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --progress
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test: build
	@grunt test:local
