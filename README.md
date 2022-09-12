# IPC Mocha Reporter ☕ 🧱

### Custom Mocha reporter that sends test data to IPC channels. Useful when you want to get test information in the separate process or when running Mocha programmatically.

![build](https://github.com/SpanishWaterDog/ipc-mocha-reporter/actions/workflows/ci.yml/badge.svg?branch=main)
[![CodeQL](https://github.com/SpanishWaterDog/ipc-mocha-reporter/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/SpanishWaterDog/ipc-mocha-reporter/actions/workflows/codeql.yml)
![npm version](https://badgen.net/npm/v/@nikkoni/ipc-mocha-reporter)
![npm downloads](https://badgen.net/npm/dt/@nikkoni/ipc-mocha-reporter)  
![Mocha reporter](https://badgen.net/badge/mocha/reporter/:color?icon=https://seeklogo.com/images/M/mocha-logo-66DA231220-seeklogo.com.png)
![Cypress reporter](https://badgen.net/badge/cypress/reporter/:color?icon=https://docs.cypress.io/_nuxt/img/cypress-logo.a2e1292.svg)

## Table of Contents

- [Configuration](#Configuration)
- [Instalation](#Instalation)
- [Usage](#Usage)
  - [Mocha](#Mocha)
  - [Cypress](#Cypress)
- [Events](#Events)
- [Example](#Example)

---

## Configuration

### ipcMode

Defines whether reporter is run in client or server mode.  
Available options:

- client - use Unix/Windows sockets - reporter run as client
- server - use Unix/Windows sockets - reporter run as server
- client-net - use TCP, TLS or UDP sockets - reporter run as client
- server-net - use TCP, TLS or UDP sockets - reporter run as server

More information about sockets and their advantages/disadvantages can be found in [`node-ipc` documentation](https://www.npmjs.com/package/node-ipc#types-of-ipc-sockets).

### ipcSocketId

The id of this socket or service.  
This field has higher priority over id in `nodeIpcConfig` object.  
Type: `string`

### sendAllData

If true all reporter data will be passed directly to ipc.  
If false [only test states](#Events) will be sent.

Type: `boolean`  
Default: `false`

### nodeIpcConfig

Object passed to `node-ipc`.  
You can use it to set hostname, port, logging or more advanced options.
All available fields can be found in [`node-ipc` documentation](https://www.npmjs.com/package/node-ipc#ipc-config).

---

## Instalation

### NPM

```batch
npm i @nikkoni/ipc-mocha-reporter
```

### Yarn

```batch
yarn add @nikkoni/ipc-mocha-reporter
```

---

## Usage

### Mocha

There are multiple ways you can set reporter in Mocha

#### .mocharc.json

```JSON
  "reporter": "@nikkoni/ipc-mocha-reporter",
  "reporter-option": ["ipcMode=client", "ipcSocketId=custom-id"], // array, not object
```

You can also use JavaScript object, YAML or JSONC as seen [here](https://github.com/mochajs/mocha/tree/master/example/config)

#### Run programmatically

```JavaScript
  import Mocha from 'mocha';

  const mocha = new Mocha();
  mocha.reporter('@nikkoni/ipc-mocha-reporter', { ipcMode: 'client', ipcSocketId: 'custom-id' });
```

#### From command-line / bash script

```bash
mocha --reporter "@nikkoni/ipc-mocha-reporter" --reporter-option "ipcMode=client,ipcSocketId=custom-id"
```

<br />

### Cypress

#### cypress.config.js

```JavaScript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  reporter: '@nikkoni/ipc-mocha-reporter',
  reporterOptions: {
    ipcMode: 'client-net',
    ipcSocketId: 'custom-id',
    nodeIpcConfig: {
      silent: false
    }
  }
})
```

#### Run programmatically

```JavaScript
import cypress from 'cypress';

cypress
  .run({
    reporter: '@nikkoni/ipc-mocha-reporter',
    reporterOptions: {
      ipcMode: 'client-net',
      ipcSocketId: 'custom-id',
      nodeIpcConfig: {
        silent: false
      }
    }
  })
```

#### From command-line / bash script

```bash
cypress run --reporter "@nikkoni/ipc-mocha-reporter" --reporter-option "ipcMode=client,ipcSocketId=custom-id"
```

---

## Events

Event names are the same as [mocha event names](https://mochajs.org/api/runner.js.html).

If [sendAllData](#sendAllData) parameter is set to false the following data will be sent:
| Event constant name | Event name | Data type |
| ------------- |:-------------:| -----:|
| EVENT_RUN_BEGIN | start | `{}` |
| EVENT_SUITE_BEGIN | suite | `[ {[title]: "pending"} ]` |
| EVENT_TEST_PASS | pass | `[ {[title]: "pass"} ]` |
| EVENT_TEST_FAIL | fail | `[ {[title]: "fail"} ]` |
| EVENT_SUITE_END | suite end | `[ {[title]: state} ]` |
| EVENT_RUN_END | end | `{}` |

If [sendAllData](#sendAllData) parameter is set to true data types will be the same as [mocha listener argument](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0a44325a7f5dd4ce778c3d4dd34c8d0ef620c1e7/types/mocha/index.d.ts#L1601).

<br />

There is an additional event `kill` that you can use to disconnect and force kill reporter process.

---

## Example

Example in JavaScript

```JavaScript
import Mocha from 'mocha';
import ipc from 'node-ipc'

const mocha = new Mocha();
mocha.reporter(
  '@nikkoni/ipc-mocha-reporter',
  { ipcMode: 'client', ipcSocketId: 'ipc-reporter' },
);

ipc.config.id = 'ipc-reporter';
ipc.serve(() => {
  ipc.server.on(RunnerConstants.EVENT_TEST_PASS, (data) => {
    const [[name, state]] = Object.entries(data);
    console.log(`Test ${name} is ${state}`);
  });
});

ipc.server.start();
mochaRunner = mocha.run();
```
