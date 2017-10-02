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

Each "semaphore take" node should be paired with a "semaphore leave" node.

Additionally it's a good idea to use a node-red catch node that will call a "semaphore leave" in the event that any
node between the take and leave should throw an error.

Use with care, it can be easy to set yourself up in a dead lock situation.

**Config**

Add a semaphore node and setup a semaphore config.  Each semaphore config may have a single set capacity.

Acknowledgements
----------------

The node-red-contrib-semaphore uses the following open source software:

- [semaphore](https://github.com/abrkn/semaphore.js) nodejs semaphore library.

