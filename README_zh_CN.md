<p align="center">
  <a href="https://github.com/ulivz/usync">
    <img src="./static/logo.png" width="300" height="" style=""/>
  </a>
</p>

<br/>

[![NPM version](https://img.shields.io/npm/v/usync.svg?style=flat)](https://npmjs.com/package/usync) [![NPM downloads](https://img.shields.io/npm/dm/usync.svg?style=flat)](https://npmjs.com/package/usync) 
[![Build status](https://img.shields.io/travis/toxichl/usync.svg?style=flat)](https://npmjs.com/package/usync)  



# 核心

`Usync`的核心是始终如一的串行执行（Uniform Synchronous），可以在浏览器或者Node环境中运行。

此外，它支持任务的切分和任务树的设计。并默认加入了任务状态。由于`Usync`非常轻量，核心API很少，所以`Usync`提供了一组生命周期的钩子函数和拓展方法，让你能够轻松地拓展`Usync`。

```js
app.use([task1,task2,task3 ... ]).start()
```


<br/>

# 快速上手
## 安装

```js
npm i usync -S
// or
yarn add usync
```
如果你想在浏览器中测试Usync，可以使用CDN:

- [UNPKG](https://unpkg.com/usync/dist/) 
- [jsDelivr](https://cdn.jsdelivr.net/npm/usync/dist/)

## 第一个Usync APP

```js
// 创建一个 name 为 'Work' 的任务
var app = Usync.app('Work')

// 定义三个子任务
function task1(root, next) {
    // root: Work 任务生命周期内不断向下传递的对根状态对象
    // next: 调用下一个任务
    setTimeout(() => next(), 200)
}

function task2(root, next) {
    setTimeout(() => next(), 300)
}

function task3(root, next) {
    setTimeout(() => next(), 200)
}

// 定义任务队列
app.use([task1,task2,task3])

// 运行任务
app.start()
```


<br/>

# 特性

1. 子任务类型支持：`Function` / `Usync` / `Promise` / `Async Function`
2. 提供生命周期钩子（Lifecycle Hook）和插件（Plugin）机制，方便拓展
3. 默认支持任务生命周期内有效的根状态（Root State）


<br/>

# API


<br/>

## `Usync.app([state])`
- `state` Array | Object | String
- `return value` 一个Usync的app实例

需要注意的是，state参数是可选的，当app的整个生命周期需要依赖一定的初始化状态时，我们可以通过state注入，举例来说：

```js
let root = {
    // 初始化根状态
} 
let app = Usync.app(root)
```

接下来，我们可以在app生命周期中的每一个任务中使用了：

```js
app.use(function task1(root) {
    fx(root) //对root进行一些操作 
});
```

除此之外，Usync还给root state初始化了一些值：

属性|说明
---|---
`root.$current` | 当前的task
`root.$prev` | 上一个task
`root.$next` | 下一个task


> 注意：当state参数未设定时，Usync构造器会默认生成一个root空对象。


<br/>

## `Usync.prototype.use(task)`
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

> 注意：当task需要为一个具名函数。和 [orchestrator](https://github.com/robrich/orchestrator) 以及依赖其的 [gulp](https://github.com/gulpjs/gulp) 的设计理念`(taskName, taskHandler)`不一样，Usync只需要一个`taskHandler`，Usync将会把该`taskHandler`的name作为该task的name。

可以clone本项目, 来运行本项目提供的 [examples](examples)：

```
git clone https://github.com/toxichl/usync.git
npm i && npm run example
```

<img src="./static/example.gif"/>

> 请注意：上述的log效果并不是Usync内置的，因为Usync core不会有任何`Node`或者`Browser`独有的API，这种log效果是通过Usync的一个插件 [logger](plugins/logger.js) 实现的。


<br/>

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

一个task上可用的属性如下：

属性|说明
---|---
`task.name`| task的name
`task.$parent`| task的父代

关于如何使用这些钩子，需要借助 `Usync.extend()` 或者 `Usync.prototype.extend`，请继续往下看。


<br/>

## `Usync.extend(object)`
- `object` 一个或多个生命周期钩子处理函数组成的对象
- `return value` 无

`extend()` 接受一个对象作为参数，该对象可以包含多个属性，属性名为 [生命周期钩子](#lifeCycle) 的名字， 属性值为一个处理函数，其中，处理函数支持的传入参数请参见上节。一个简单的`extend()`例子如下：

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


<br/>

## `Usync.prototype.extend(object)`
- `object` 一个或生命周期钩子处理函数组成的对象
- `return value` 无

和`Usync.extend()`的功能一样，区别在于，`Usync.extend()` 将会对所有的 `UsyncApp`生效，而 `Usync.prototype.extend()` 仅对当前的`UsyncApp`生效。请根据不同的场景下灵活选择。


<br/>

## `Usync.plugin(plugin)`
- `plugin` Object | Function
- `return value` 无

> 插件的API设计灵感来自 [Vue](https://cn.vuejs.org/v2/guide/plugins.html)

`Usync`采用了和`Vue`一致的插件API设计，`Usync`的插件应当有一个公开方法`install`。该方法的第一个参数是`Usync`的构造器，第二个参数为可选的选项对象。

可以参照 [logger](plugins/logger.js) 的实现来学习如何结合生命周期的钩子和plugin API来为`Usync`书写一个插件。



<br/>

## Author

**usync** © [toxichl](https://github.com/toxichl/usync), Released under the [MIT](LICENSE) License.<br>