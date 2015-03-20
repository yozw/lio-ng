# Linear and Integer Optimization App

This is the source code for the app at http://online-optimizer.appspot.com.

## Running the website locally
Prerequisites:

* Download and install the [Google App Engine SDK](https://cloud.google.com/appengine/downloads).
* Download and install [Node.js](http://nodejs.org/).
* Download and install [UglifyJS](https://github.com/mishoo/UglifyJS).


### Running unit tests
The tests are run using the [Karma](http://karma-runner.github.io/) framework. Once Node.js is installed (see above), Karma may be installed as follows:

    npm install -g karma

(The flag `-g` indicates a global installation; this will install Karma into your global `node_modules` directory. Removing `-g` results in a local installation, i.e., it will install Karma into your current directory's `node_modules`.)


