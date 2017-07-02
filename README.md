# Usync

## Usages

Here are three tasks that may contain asynchronous code

```js
function Task1() {}
function Task2() {}
function Task3() {}
```

If the three tasks share one or more global state, and needs to be strictly executed serially, This time, you will need Usync:

```js
// Intialize state, state can be a object or an array
// The state will be passed into every task's controller as arguments 
var app = Usync.app(state)

// Define task execution order
app.use(Task1)
   .use(Task2)
   .use(Task3)
    
// Run app 
app.start()  
```

At this point, you can added some parameters to each task control function (`next` style likes `generator`):

```js
function Task1(state, next) {
    // ... Async or Sync Code
    
    // run next task
    next()
}
```

Then task will be strictly executed in accordance with the order you `use()`

What are the benefits? In the life cycle of the whole task, you don't need to define any variables, just hand it to the `state`. So, you can hide the details of each task (separate to a file), and only need to focus on the holistic task process.

