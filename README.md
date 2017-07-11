<div>
    <code>
      _   _  ____ __   __ _   _   ____
     | | | |/ ___|\ \ / /| \ | | / ___|
     | | | |\___ \ \ V / |  \| || |
     | |_| | ___) | | |  | |\  || |___
      \___/ |____/  |_|  |_| \_| \____|
    </code>
</div>

## Usages

Here are three tasks that may contain asynchronous code

```js
function task1() {}
function task2() {}
function task3() {}
```

If the three tasks share one or more global state, and needs to be strictly executed serially, This time, you will need Usync:

```js
// Intialize state, state can be a object or an array
// The state will be passed into every task's controller as arguments 
var app = Usync.app(state)

// Define task execution order
app.use(task1)
   .use(task2)
   .use(task3)
    
// Run app 
app.start()  
```

At this point, you can write task controller like this (`next` style likes `generator` ?):

```js
function task1(state, next) {
    // ... Async or Sync Code
    
    // Call next() to execute the next task
    next()
}
```

Then task will be strictly executed in accordance with the order you `use()`

What are the benefits? In the life cycle of the whole task, you don't need to define any variables, just hand it to the `state`. So, you can hide the details of each task (separate tasks to files), and only need to focus on the holistic task process.

## API

# `Usync.app(state)`
- `state` Array | Object | String | undefined
- `return value` a intance of Usync

```js
var app = Usync.app()
```

If `state` is empty, so will generate an empty `state` object by default. the `state` will shuttle throughout the whole life cycle.


# `app.use(taskHandler)`
- `taskHandler` Function | Usync Instance
- `return value` this

if the task handler is a function, the parameters of the function as follows:

    state1 , state2, ... , next

The number of state parameters depends on the number of object passed in at initialization.

If you initialize as follows:

    var app = Usync.app(A)
    
then You can write your task handler like this:

```js
function task(A , next) {
    // Do something
    
    next()  
}

app.use(task)
```

And if you write this:

    var app = Usync.app(A, B, C)
    
You can use:

```js
function task(A, B, C, next) {
    // Do something
    
    next()  
}

app.use(task)
```
