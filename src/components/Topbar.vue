<template>
    <div id="top-bar">
        <h1>
            {{meta.title}}
            <span>{{ currentPage.name }}</span>
        </h1>
        <button @click="onClick" id="toggle-nav"></button>
    </div>
</template>

<script>
    export default {
        name: 'topbar',
        props: {
            state: Object,
            meta: Object,
            currentPage: Object
        },
        data () {
            return {}
        },
        methods: {
            onClick: function () {
                this.state.menuVisible = !this.state.menuVisible;
            }
        }
    }
</script>
