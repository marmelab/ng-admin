/*
 * _postinstall.js is a script that runs automatically after the `npm install`
 */
// Get platform from node
var os = require('os');
var platform = os.platform();

if (platform === 'darwin' || platform == 'linux') {
  // Call child process and execute
  var exec = require('child_process').exec;

  exec('./node_modules/protractor/bin/webdriver-manager update --versions.chrome=2.24', function (error, stdout, stderr) {
    console.log('Setting up Selenium Server');
    console.log(stdout);

    if (error !== null) {
      console.log(error);
    } else {
      console.log('Selenium Server setup was successful.');
    }
  });

  return;
} else if (platform === 'win32') {
  var exec = require('child_process').exec;

  exec('node.exe node_modules/protractor/bin/webdriver-manager update --versions.chrome=2.24', function (error, stdout, stderr) {
    console.log('Setting up Selenium Server');
    console.log(stdout);

    if (error !== null) {
      console.log(error);
    } else {
      console.log('Selenium Server setup was successful.');
    }
  });

  return;
}

console.error('Unknown environment. Please log an issue at https://github.com/marmelab/ng-admin/issues:', platform);
process.exit(1);
