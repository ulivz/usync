# Changelog

`0.0.16` / 2017-7-17

- Update build

`0.0.15` / 2017-7-17

- Remove some unuseful code

`0.0.14` / 2017-7-16

- Add logo

`0.0.13` / 2017-7-16

- Fix a build bug
- Refactor code

`0.0.12` / 2017-7-16

- Fix a release bug

`0.0.11` / 2017-7-15

- Change the summary
- Refactor the code style

`0.0.10` / 2017-7-13

- Add `beforeUse` lifeCycle
- Add `init` lifeCycle
- rewrite `looger` plugin, and seperated the indent logic from core to plugin
- Rewrite README and add Chinese README

`0.0.9` / 2017-7-11

- Add `Usync.plugin()` API
- Add `Usync.extend()` API
- Add a example for `Async/Await`

`0.0.8` / 2017-7-11

- Add support for native `Promise` and add a example
- Enhance `error catch`

`0.0.7` / 2017-7-11

- Rewrite by `typescript`
- Fix some bugs

`0.0.6` / 2017-7-11

- Migrate build tool from `roolup` to `webpack3.0`

`0.0.5` / 2017-7-8

- Add lifecycle `appStart`/`appEnd` / `taskStart` / `taskEnd`
- Add syntax `use([task1, task2, task3])`
- Change core API `(state1, state2, ...) to (state, options) / ([state1, state2, ...], options)`
- Add `time` record
- Remove `next` reference in `root`
- Rename static method `app` to `createApp`


`0.0.4` / 2017-7-2

- First released version
- Support `(root, next)` syntax
- Support `use(Usync-Instance)`
- Add `next` reference in `root`