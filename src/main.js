'use strict';

import Vue from 'vue'
import App from './App'
import EventEmitter from 'events';
import lunr from 'lunr';

window.eventBus = new EventEmitter();

window.checkRecursiveOpen = function (targetId, model) {
    if (model.children &&
        model.children.length) {
        var i;
        for (i = 0; i < model.children.length; i++) {
            var child = model.children[i];
            if (child.id === targetId) {
                return true;
            }
            if (checkRecursiveOpen(targetId, child)) {
                return true;
            }
        }
    }
    return false;
};

window.article = function (id) {
    if (id && objectStore.data.index[id]) {
        eventBus.emit('page-display', objectStore.data.index[id])
    }
};

eventBus.on('page-display', (page) => {
    objectStore.currentPage.name = page.name;
    objectStore.currentPage.html = page.html;
    objectStore.currentPage.id = page.id;
    page.open = true;

    if (page.id && objectStore.state.params.article !== page.id) {
        var url = '/?article=' + page.id;

        history.pushState(
            {
                id: page.id
            },
            page.name,
            url
        );
    }
});

eventBus.on('navigated', () => {
    if (objectStore.state.params.article && objectStore.data.index[objectStore.state.params.article]) {
        eventBus.emit('page-display', objectStore.data.index[objectStore.state.params.article])
    }
});

eventBus.on('popstate', () => {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    objectStore.state.params = {
        article: null
    };

    while (match = search.exec(query)) {
        objectStore.state.params[decode(match[1])] = decode(match[2]);
    }

    eventBus.emit('navigated');
});

eventBus.on('data-loaded', ()=> {
    eventBus.emit('popstate');
});

eventBus.on('reset-search', () => {
    objectStore.state.query.q = null;
    objectStore.state.search.results = [];
});

window.onpopstate = () => {
    eventBus.emit('popstate')
};

window.objectStore = {
    searchIndex: lunr(function () {
        this.field('name', {boost: 10});
        this.field('html')
    }),
    meta: {
        title: 'Roca'
    },
    state: {
        loaded: false,
        params: {},
        query: {
            q: null
        },
        search: {
            results: []
        }
    },
    data: {
        title: null,
        tree: {},
        index: {}
    },
    currentPage: {
        name: null,
        html: null,
        id: null
    }
};

window.app = new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
    data: {
        currentPage: objectStore.currentPage,
        meta: objectStore.meta,
        dataTree: objectStore.data.tree,
        query: objectStore.state.query
    },
    watch: {
        currentPage: {
            handler: function (page) {
                document.title = objectStore.meta.title + ' - ' + page.name;

                window.scrollTo(0, 0);

                if (document.location.hash) {
                    // put to end of the stack to allow for redraw
                    setTimeout(() => {
                        const target = document.getElementById(document.location.hash.substr(1));
                        if (target) {
                            target.scrollIntoView();
                        }
                    }, 4);
                }
            },
            deep: true
        },
        query: {
            handler: function (qu) {
                const results = objectStore.searchIndex.search(qu.q);

                objectStore.state.search.results = [];

                for (const result of results) {
                    const candidate = objectStore.data.index[result.ref];
                    objectStore.state.search.results.push(candidate);
                }
            },
            deep: true
        }
    },
    beforeCreate: function () {
        const createIndex = (tree, root) => {
            for (let id in tree) {
                if (!tree.hasOwnProperty(id)) {
                    continue;
                }
                const page = tree[id];
                if (page.children && page.children.length) {
                    createIndex(page.children, root);
                }
                if (!page.id) {
                    continue;
                }
                root[page.id] = page;
                objectStore.searchIndex.add({
                    name: page.name,
                    html: page.html,
                    id: page.id
                });
            }
            return root;
        };
        const xhr = new XMLHttpRequest();
        xhr.open('get', '/data.json?h=' + document.location.hostname, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status == 200) {
                objectStore.data.tree = xhr.response.tree;
                objectStore.data.index = createIndex(xhr.response.tree.children, {});
                objectStore.data.title = xhr.response.title;

                objectStore.data.tree.open = true;

                objectStore.meta.title = xhr.response.title;

                objectStore.currentPage.name = xhr.response.tree.name;
                objectStore.currentPage.html = xhr.response.tree.html;

                objectStore.state.loaded = true;

                eventBus.emit('data-loaded');
            } else {
                eventBus.emit('data-failed', xhr.status)
            }
        };
        xhr.send();
    }
});
