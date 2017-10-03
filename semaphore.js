/**
 * Copyright 2017 Tyler Eastman.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function (RED) {
    'use strict';

    const semaphore = require('semaphore');

    function SemaphoreConfig(n) {
        RED.nodes.createNode(this, n);
        const node = this;

        node.name = n.name;
        node.capacity = n.capacity || 1;
        node.semaphore = semaphore(node.capacity);
        node.observers = [];

        node.subscribe = function (fn) {
            node.observers.push(fn);
        };

        node.unsubscribe = function (fn) {
            node.observers = node.observers.filter((observer) => observer !== fn);
        };

        node.broadcast = function () {
            node.observers.forEach((observer) => observer(node));
        };
    }

    RED.nodes.registerType('semaphore-config', SemaphoreConfig);

    function SemTakeNode(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        const config = RED.nodes.getNode(n.config);
        const sem = config.semaphore;

        const updateStatus = function (config) {
            const capacity = config.semaphore.capacity;
            const size = config.semaphore.current + config.semaphore.queue.length;
            const fill = (size > capacity) ? "yellow" : "grey";
            node.status({fill: fill, shape: "dot", text: config.name + ": " + size + " / " + capacity});
            if (size === 0)
                node.status({});
        };
        config.subscribe(updateStatus);

        node.on('input', (msg) => {
            sem.take(() => {
                node.send(msg);
            });
            config.broadcast();
        });

        node.on('close', ()=> {
            config.unsubscribe(updateStatus);
            node.status({});
        });
    }

    RED.nodes.registerType('semaphore-take', SemTakeNode);

    function SemLeaveNode(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        const config = RED.nodes.getNode(n.config);
        const sem = config.semaphore;

        node.on('input', (msg) => {
            sem.leave();
            config.broadcast();
            node.send(msg);
        });
    }

    RED.nodes.registerType('semaphore-leave', SemLeaveNode);
};
