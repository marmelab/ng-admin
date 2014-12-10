install:
	bower install
	npm install
	./node_modules/protractor/bin/webdriver-manager update

test:
	@grunt test