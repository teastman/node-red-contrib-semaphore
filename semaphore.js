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
        this.capacity = n.capacity || 1;
        this.semaphore = semaphore(this.capacity);
    }

    RED.nodes.registerType('semaphore-config', SemaphoreConfig);

    function SemTakeNode(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        const sem = RED.nodes.getNode(n.config).semaphore;

        node.on('input', (msg) => {
            sem.take(() => {
                node.send(msg);
            });
        });
    }
    
    RED.nodes.registerType('semaphore-take', SemTakeNode);

    function SemLeaveNode(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        const sem = RED.nodes.getNode(n.config).semaphore;

        node.on('input', (msg) => {
            sem.leave();
            node.send(msg);
        });
    }

    RED.nodes.registerType('semaphore-leave', SemLeaveNode);
};
