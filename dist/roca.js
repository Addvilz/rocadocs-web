var eventBus = new Vue();

var urlParams;

window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    urlParams = {
        article: null
    };

    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
};

window.onpopstate();

var checkRecursiveOpen = function (targetId, model) {
    if (model.children &&
        model.children.length) {
        var i;
        for (i = 0; i < model.children.length; i++) {
            var child = model.children[i];
            if (child.id === targetId || child.open) {
                return true;
            }
            if (checkRecursiveOpen(targetId, child)) {
                return true;
            }
        }
    }
};

Vue.component('menu-item', {
    template: '#menu-item-template',
    props: {
        model: Object
    },
    data: function () {
        var currentId = urlParams.article;
        var childOpen = false;

        if (currentId) {
            childOpen = checkRecursiveOpen(currentId, this.model);
        }

        if (currentId === this.model.id) {
            eventBus.$emit('load-page', this.model);
        }

        return {
            open: true === this.model.open ||
            currentId === this.model.id ||
            true === childOpen
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children &&
                this.model.children.length;
        }
    },
    methods: {
        onClick: function () {
            eventBus.$emit('change-page', this.model);
            eventBus.$emit('load-page', this.model);
        },
        onDoubleClick: function () {
            if (this.isFolder) {
                this.open = !this.open
            }
        }
    }
});

Vue.component('md-page', {
    template: '#md-page-template',
    props: {
        model: Object
    },
    data: function () {
        return {}
    }
});

var app = new Vue({
    el: '#app',
    data: {
        title: 'Roca',
        treeData: {
            open: true
        },
        pageData: {
            name: '',
            html: ''
        }
    },
    beforeCreate: function () {
        var self = this;

        var request = new XMLHttpRequest();
        request.open('GET', 'data.json?hostname=' + document.location.hostname, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                self.title = data.title;
                self.treeData = data.tree;
                self.pageData = {
                    name: self.treeData.name,
                    html: self.treeData.html,
                    open: self.treeData.open
                };
            }
        };

        request.onerror = function () {
        };

        request.send();
    },
    watch: {
        pageData: {
            handler: function (val) {
                this.changeTitle(val.name);
            },
            deep: true
        }
    },
    mounted: function () {
        var self = this;

        this.changeTitle(this.pageData.name);

        var findRecursive = function (id, model) {
            if (model.id && model.id === id) {
                return model;
            }

            if (model.children && model.children.length) {
                var i;
                for (i = 0; i < model.children.length; i++) {
                    var child = model.children[i];
                    if (id === child.id) {
                        return child;
                    }
                    var childMatch = findRecursive(id, child);
                    if (childMatch) {
                        return childMatch;
                    }
                }
            }
        };

        window.article = function (target) {
            var page = findRecursive(target, self.treeData);

            if (page) {
                eventBus.$emit('change-page', page);
                eventBus.$emit('load-page', page);
            }
        };
    },
    created: function () {
        eventBus.$on('change-page', this.changePage);
        eventBus.$on('load-page', this.loadPage);
    },
    methods: {
        loadPage: function (page) {
            this.pageData.name = page.name;
            this.pageData.html = page.html;
        },
        changePage: function (page) {
            window.scrollTo(0, 0);

            if (page.id) {
                var url = '/?article=' + page.id;

                history.pushState(
                    {
                        id: page.id
                    },
                    page.name,
                    url
                );
            }
        },
        changeTitle: function (pageName) {
            document.title = this.title + ' - ' + pageName;
        }
    }
});
