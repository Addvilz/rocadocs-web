// move to json
var data = {};

var currentPage = {
    name: data.name,
    html: data.html
};

Vue.component('menu-item', {
    template: '#menu-item-template',
    props: {
        model: Object
    },
    data: function () {
        return {
            open: true === this.model.open
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        onClick: function () {
            if (this.isFolder) {
                this.open = !this.open
            }

            currentPage.html = this.model.html;
            currentPage.name = this.model.name;
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

var request = new XMLHttpRequest();
request.open('GET', 'data.json', true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        data = JSON.parse(request.responseText);
    } else {
    }
};

request.onerror = function() {
};

request.send();

var demo = new Vue({
    el: '#app',
    data: {
        treeData: data,
        pageData: currentPage
    },
    watch: {
        pageData: {
            handler: function (val) {
                document.title = val.name;
            },
            deep: true
        }
    },
    mounted: function () {
        document.title = this.pageData.name
    }
});
