<p align="center">
    <pre style="background-color: #fff;">
          _   _  ___  _   _  _ __    ___
         | | | |/ __|| | | || '_ \  / __|
         | |_| |\__ \| |_| || | | || (__
          \__,_||___/ \__, ||_| |_| \___|
                      |___/
                  Version 0.0.9
    </pre>
</div>


<br/>

# Usync

The core of `Usync` is uniform serial execution, which can be run in browser or Node.js enviroment.

In addition, it supports task segmentation and task tree design. The root task state is added by default. Because `Usync` is very lightweight, core API is scarce, so `Usync` provides a set of hook and extension methods for life cycles that allow you to easily extend `Usync`.

```js
app.use([task1,task2,task3 ... ]).start()
```


<br/>

# Quick Start

```js
// Create a task whose name is 'Work'
var app = Usync.app('Work')

// Define three subtasks
function task1(root, next) {
    // root: The root state that continues to pass down during the life cycle of 'Work' task
    // next: Call the next task
    setTimeout(() => next(), 200)
}

function task2(root, next) {
    setTimeout(() => next(), 300)
}

function task3(root, next) {
    setTimeout(() => next(), 200)
}

// Define task queues
app.use([task1,task2,task3])

// Running task
app.start()
```

<br/>

# features

1. the type of subtask supports: Function / Usync / Promise / Async Function
2. Provide Lifecycle Hook and Plugin mechanisms to facilitate extension
3. Provide a root state (Root State) which is valid in the task life cycle by default

<br/>

# API

<br/>

# `Usync.app([state])`
- `state` Array | Object | String
- `return value` A Usync app instance

It's important to note that the state parameter is optional, and when the entire life cycle of the app needs to depend on a certain initialization state, we can inject it through state, for example:

```js
let root = {
    // Initialize root status
} 
let app = Usync.app(root)
```

Next, we can use the root state at each task in the app lifecycle:

```js
app.use(function task1(root) {
    fx(root) // Perform some operations on the root state
});
```

Besides, Usync also initializes some values:

attribute | description
---|---
app.$current | Current task
root.$prev | previous task
root.$next | next task


> Note: when the state is not set, the Usync constructor will generate a root empty object by default



# `Usync.prototype.use(task)`
- `task` Function | Usync | Promise | Async Function | Array
- `return value` this

该方法用于向Usync App中添加子任务。`use()`方法支持链式调用，也支持一个数组的传入。

```js
app.use(task1).use(task2).use(task3)
// 等价于
app.use([task1, task2, task3])
```

上述示例的执行顺序为: `task1 => task2 => task3`。

`use()`的使用示例可以参见以下示例：

类型|示例
---|---
Function | [Demo](examples/1_function.js)
Promise | [Demo](examples/2_promise.js)
Async/Await | [Demo](examples/3_async.js)
Usync | [Demo](examples/4_task_tree.js)

> 注意：当task需要为一个具名函数。和 [orchestrator](https://github.com/robrich/orchestrator) 以及依赖其的 [gulp](https://github.com/gulpjs/gulp) 的设计理念(`taskName`+`taskHandler`)不一样，Usync只需要一个`taskHandler`，Usync将会把该`taskHandler`的name作为该task的name。

可以clone本项目运行example来查看默认的exmaple的运行结果：

> 请注意：以下的log效果并不是Usync默认支持的，因为Usync core不会有任何`Node`或者`Browser`独有的API，这个`Colorful and indent console`是通过Usync的第一个插件 [logger](plugins/logger.js) 实现的。

```
git clone https://github.com/toxichl/usync.git
npm i && npm run example
```

<img src="./static/example.gif"/>



## 生命周期

Usync目前提供的生命周期的钩子函数如下：

钩子 | 参数 |描述
---|---|---
`init` | `(UsyncApp)` | 在一个UsyncApp创建结束之前
`beforeUse` | `(UsyncApp, task)` | 在一个 task 即将被一个 UsyncApp use 之前
`appStart` | `(root)` | 一个`Usync app`开始运行之前 
`appEnd` | `(root)` | 一个`Usync app`结束运行之前 
`taskStart` | `(root)` | 一个`task`开始运行之前 
`taskEnd` | `(root)` | 一个`task`结束运行之前

其中，root state上可用的属性如下：

属性|说明
---|---
root.$current | 当前的task
root.$prev | 上一个task
root.$next | 下一个task

一个task上可用的属性如下：

属性|说明
---|---
task.name| task的name
task.$parent | task的父代

关于如何使用这些钩子，需要借助 [Usync.extend()](# `Usync.extend(object)`) 或 [Usync.prototype.extend()](# `Usync.prototype.extend(object)`)，请继续往下看。



# `Usync.extend(object)`
- `object` 一个或生命周期钩子处理函数组成的对象
- `return value` 无

`extend()` 接受一个包含一个或多个键值为 [生命周期钩子](#lifeCycle)， 键值为一个函数，其中，函数所传入的参数请参见上节。一个简单的`extend()` 例子如下：

```js
Usync.extend({
    taskStart(root) {
        console.log(`Starting ${root.$current.name}`)
    },
    taskEnd(root) {
        console.log(`Finished ${root.$current.name}`)
    }
})
```

实际上，这个就是实现插件 [logger](plugins/logger.js) 最核心的一部分，是否非常简单？



# `Usync.prototype.extend(object)`
- `object` 一个或生命周期钩子处理函数组成的对象
- `return value` 无

和`Usync.extend()`的功能一样，区别在于，`Usync.extend()`拓展的钩子函数将对所有的`UsyncApp`生效，而`Usync.prototype.extend()`仅对当前的`UsyncApp`生效。请根据不同的场景下灵活选择。



# `Usync.plugin(plugin)`
- `plugin` Object | Function
- `return value` 无

> 插件的API设计灵感来自 [Vue](https://cn.vuejs.org/v2/guide/plugins.html)

`Usync`采用了和`Vue`一致的插件API设计，`Usync`的插件应当有一个公开方法`install`。该方法的第一个参数是`Usync`的构造器，第二个参数为可选的选项对象。

可以参照 [logger](plugins/logger.js) 的实现来学习如何结合生命周期的钩子和plugin API来为`Usync`书写一个插件。










