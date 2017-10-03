node-red-contrib-semaphore
========================
A Node-RED node for using semaphores.

Install
-------
Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-semaphore

Usage
-------

This node allows you to limit simultaneous usage of resources.

`semaphore take` node will queue on available capacity of the underlying semaphore.  The take node will display as it's
status the name, current queue count, and total capacity of the underlying semaphore.

`semaphore leave` node will free up an available spot for the queue to process the next task.

It's a good idea to use a node-red catch node that will call a `semaphore leave` in the event that any
node between the take and leave should throw an error.

Use with care, it can be easy to set yourself up in a dead lock situation.

Acknowledgements
----------------

The node-red-contrib-semaphore uses the following open source software:

- [semaphore](https://github.com/abrkn/semaphore.js) nodejs semaphore library.

