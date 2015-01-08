.PHONY: build

install:
	bower install
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@grunt

build-dev:
	@grunt build:dev
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (no minification)"

build:
	@grunt build
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test:
	@grunt test:local
