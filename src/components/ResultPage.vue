<template>
    <div class="result-page">
        <h1 @click="onClick" class="page-title">{{page.name}}</h1>
        <div v-html="page.html"></div>
    </div>
</template>

<script>
    export default {
        name: 'result-page',
        props: {
            page: Object
        },
        data () {
            return {}
        },
        methods: {
            onClick: function () {
                eventBus.emit('reset-search');
                article(this.page.id);
            }
        }
    }
</script>
