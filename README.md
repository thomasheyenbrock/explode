# Explode

What comes after the reaction? The explosion!

![Exploding Death Star](https://media.giphy.com/media/1vRlMcPvrYMY8/giphy.gif)

## What is this?

I wanted to challenge myself. So I thought:

> Why not try to build [React](https://reactjs.org) from scratch?

But I don't want to copy some existing stuff. Well, let's say not completely. For sure I will copy big parts of the API design. What I want to avoid completely are classes. I want to build my version of React that ONLY works with hooks.

## TFD (Time for development)

For good measure I am developing next to a timer when I work on this. I want to measure how fast I can go.

Here is the total time I spent on this:

| **Total**  | **1h 5min** |
| ---------- | ----------- |
| 2019-04-11 | 1h 5min     |
| 2019-04-23 | 50min       |

## Roadmap

### Goal 1: Implementing the initial render

The first goal is to render some components defined with JSX to the DOM.

#### Step 1: Implement `createElement`

The `createElement` function takes a component and its props and returns a normalized data structure called `element`. One `element` can contain multiple other `element` objects which correspond to the children defined in JSX.

Every time when you use JSX you will end up with a tree of `element` objects. However you don't have to create the tree yourself, JSX does that by calling `createElement` properly.

#### Step 2: Implement the `fiber`-tree

To keep track of the current state of the application, we will need a data structure that contains all relevant informations. We will use `fiber` for that.

Building the `fiber`-tree is the first thing that happens when we call `render`.

In this step you will build the initial `fiber`-tree from the `element`-tree. Later we will incrementally modify this tree, once we have to handle state updates.

#### Step 3: Perform work on the `fiber`-tree

Everything we do with `fiber`-nodes is called work. It could be for example updating, reordering or deleting. For that we need an algorithm that traverses the fiber tree.

#### Step 4: Render the `fiber`-tree

This is the final step to reach the first goal. We will traverse the fiber tree that we initially obtained, create the DOM nodes and inject them into the container-element of our application.

For now, all the work we do is inserting elements. But we also have to handle other kind of work, like mentioned in Step 3. This will be our second goal.

### Goal 2: Handling updates

We can only handle the initial call to `render` with our library until this point. Now we want to handle the case where we call `render` again, possibly with different props or even completely different elements.

#### Step 1: Modifying fibers

We need a function that takes an `element`, compares it to an existing `fiber` and modifies it if there are changes. The function has to work recoursively on all children.

#### Step 2: Queueing work

We have to determine the work that has to be done for individual fibers. We have to handle updates (text content and attribute values), reorderings of children and deleting elements.

The work should be stored as callback functions inside the `fiber`-nodes. We will call those functions `effects`.

#### Step 3: Implementing the `effect`-list

We don't want to traverse the complete tree again when we update the DOM, because not every `fiber` will contain effects. Therefore we will build an `effect`-list. This list consists of pointers between those `fibers` that contain effects.

#### Step 4: Flushing work to the DOM

We traverse the `effect`-list and execute all queued `effect` callbacks. Those will flush our updates to the DOM.

### Goal 3: Adding state
