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

# 核心

`Usync`的核心是始终如一的串行执行（Uniform Synchronous），可以在浏览器或者Node环境中运行。

此外，它支持任务的切分和任务树的设计。并默认加入了任务状态。由于`Usync`仅仅并支持提供了一些生命周期的钩子函数和拓展方法，让你能够轻松地拓展`Usync`。

```js
app.use([task1,task2,task3 ... ]).start()
```

# 快速上手


```js
// 创建一个 name 为 'Work' 的任务
var app = Usync.app('Work')

// 定义三个子任务
function task1(root, next) {
    // root: Work 任务生命周期内不断向下传递的对象
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

# 特性

1. 子任务类型支持：Function / Usync / Promise / Async Function
2. 提供生命周期钩子（Lifecycle Hook）和插件（Plugin）机制，方便拓展
3. 默认支持任务生命周期内有效的根状态（Root State）

# API
# `Usync.app([state])`
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

> 注意：当state参数未设定时，usync会默认生成一个root空对象。

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

use方法的使用示例可以参见以下示例：

类型|示例
---|---
Function | [Demo](examples/1_function.js)
Promise | [Demo](examples/2_promise.js)
Async/Await| [Demo](examples/3_async.js)
Usync | [Demo](examples/4_task_tree.js)

> 注意：当task需要为一个具名函数。和 [orchestrator](https://github.com/robrich/orchestrator) 以及依赖其的 [gulp](https://github.com/gulpjs/gulp) 的设计理念(`taskName`+`taskHandler`)不一样，Usync只需要一个`taskHandler`，Usync将会把该`taskHandler`的name作为该task的name。

可以clone本项目运行example来查看默认的exmaple的运行结果：

```
git clone https://github.com/toxichl/usync.git
npm i && npm run example
```

<img src="./static/example.gif"/>
