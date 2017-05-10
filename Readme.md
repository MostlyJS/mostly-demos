MostlyJS Demos
==============

[![Build Status](https://travis-ci.org/mostlyjs/mostly-demos.svg)](https://travis-ci.org/mostlyjs/mostly-demos)

## Code structure

The MostlyJS microservices demo project splits codebases into multiple separate independently packages in one repository using a [Monorepos](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) approach.

But instead of using [Lerna](https://lernajs.io/), the project follows a simple [Alle Monorepo](https://github.com/boennemann/alle) architecture. You have a file system looks like this:

```
|-- my-project-repo/
|   |-- package.json
|   |-- packages/node_modules
|   |   |-- package-1/
|   |   |   |-- package.json
|   |   |-- package-2/
|   |   |   |-- package.json
```

Each services/modules lives under the packages/node_modules, so that you can require common modules in a very simple way without resorting to `npm link`.


```javascript
var package1 = require('package-1');
```

_Because require() just walks up the file tree until it finds a node_modules folder with a sub-folder that matches the package name._

The project uses gulp to build the project and PM2 for production deployment.

The project contains the following seperated packages:

### express-gateway

An Express demo application serve as a RESTful gateway for calling MostlyJS microservices. Request will be mapping to corresponding microservice.

### feathers-service

Sample microservice writing with Feathers.

### poplarjs-service

Sample microservice writing with Poplarjs.

### feathers-mongoose-services

More complicated sample microservices writing with Feathers using MongoDB.

### common

Common modules to be used by other services, for demo only.

## Usage

### Install and Run NATS Server

[https://nats.io/documentation/tutorials/gnatsd-install](https://nats.io/documentation/tutorials/gnatsd-install)

### Install dependencies in each packages using [YARN](https://yarnpkg.com/)

```bash
$ bin/yarn_packages.sh
```

### Run with gulp

```bash
$ gulp
```

### Run with PM2

```bash
$ bin/run_development.sh
```

# License

MIT