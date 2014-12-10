.PHONY: build

install:
	bower install
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@grunt

build:
	@grunt build

test:
	@grunt test:local
