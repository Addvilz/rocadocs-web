var eventBus = new Vue();

Vue.component('menu-item', {
    template: '#menu-item-template',
    props: {
        model: Object
    },
    data: function () {
        var hash = document.location.hash.substr(1);

        var checkRecursiveOpen = function (model) {
            if (model.children &&
                model.children.length) {
                var i;
                for (i = 0; i < model.children.length; i++) {
                    var child = model.children[i];
                    if (child.id === hash || child.open) {
                        return true;
                    }
                    if (checkRecursiveOpen(child)) {
                        return true;
                    }
                }
            }
        };

        var childOpen = checkRecursiveOpen(this.model);

        if (hash === this.model.id) {
            eventBus.$emit('change-page', this.model);
        }

        return {
            open: true === this.model.open ||
            hash === this.model.id ||
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
            this.open = false;
            eventBus.$emit('change-page', this.model)
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

var demo = new Vue({
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
        request.open('GET', 'data.json', true);

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
        this.changeTitle(this.pageData.name);
    },
    created: function () {
        var self = this;

        eventBus.$on('change-page', this.changePage);

        var recursiveGetModel = function (model, hash) {
            if (model.children &&
                model.children.length) {
                var i;
                for (i = 0; i < model.children.length; i++) {
                    var child = model.children[i];
                    if (child.id === hash) {
                        return child
                    }
                    var submodel = recursiveGetModel(child, hash);

                    if (submodel) {
                        return submodel;
                    }
                }
            }
        };

        window.onhashchange = function () {
            var model = recursiveGetModel(self.treeData, document.location.hash.substr(1));
            model.open = true;
            self.changePage(model);
        }
    },
    methods: {
        changePage: function (page) {
            this.pageData.name = page.name;
            this.pageData.html = page.html;
            window.scrollTo(0, 0);
            if (page.id) {
                document.location.hash = page.id;
            }
        },
        changeTitle: function (pageName) {
            document.title = this.title + ' - ' + pageName;
        }
    }
});
