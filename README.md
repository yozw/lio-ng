## Linear and Integer Optimization App

This is the source code for the app at http://online-optimizer.appspot.com.

### Getting started
First install the prerequisites:

* [Git](http://git-scm.com/downloads)
* [python](https://www.python.org/downloads/)
* [pip](https://pip.pypa.io/en/latest/installing.html)
* [Google App Engine SDK](https://cloud.google.com/appengine/downloads).
* [UglifyJS](https://github.com/mishoo/UglifyJS).
* [Node.js](http://nodejs.org/).

Check out the source code for the app:

    git clone https://github.com/yozw/lio-ng.git

This will create a new directory, called `lio-ng`. Change the working directory to `lio-ng`
and run the `setup.sh` script: (This script installs python dependencies for Google App Engine
into subdirectories of `lio-ng`)

    cd lio-ng
    ./setup.sh


### Scripts
The main source directory contains several useful scripts:

* `devserver.sh` starts a local development server for the app at http://localhost:8080.
* `prodserver.sh` builds the application for deployment and starts the production server
locally at http://localhost:8080.
* `make.sh` builds the application for deployment.
* `deploy-prod.sh` builds the application for deployment, and deploys it to the production server.
* `deploy-test.sh` builds the application for deployment, and deploys it to the test server.


### Directory structure
The directory structure is as follows:

* `src/` contains the source code for the app.
* `test/` contains unit tests (which use the Karma framework; see below).


### Running unit tests
The tests are run using the [Karma](http://karma-runner.github.io/) framework. Once Node.js is installed (see above), Karma may be installed as follows:

    npm install -g karma

(The flag `-g` indicates a global installation; this will install Karma into your global `node_modules` directory. Removing `-g` results in a local installation, i.e., it will install Karma into your current directory's `node_modules`.)

