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

At this point, you can added some arguements to each task control function (`next` style likes `generator`):

```js
function Task1(state, next) {
    // ... Async or Sync Code
    
    // run next task
    next()
}
```

Then task will be strictly executed in accordance with the order you `use()`

What are the benefits? In the life cycle of the whole task, you don't need to define any variables, just hand it to the `state`. So, you can hide the details of each task (separate tasks to files), and only need to focus on the holistic task process.

## API

### Usync.app(globalState)
- `globalState`: state objects needed in task lifecycle (<Array/Object/undefined>)
- `return value`: a instance of `Usync`

If `globalState` is empty, so will generate an empty state object by default

If `globalState` is an object, then the first parameter of each task's handler will be the `globalState`, the second arguement will be the `next` which must be called to run the next task

If `globalState` is an state Array, then the Array will be smooth, as the parameters of the controller in turn, the last arguement will be `next` function.

## Inspiration

Koa / Promise / Generator
