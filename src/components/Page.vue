<template>
    <div class="page">
        <h1 class="page-title">{{page.name}}</h1>
        <div v-html="page.html"></div>
    </div>
</template>

<script>
    export default {
        name: 'page',
        props: {
            page: Object
        },
        data () {
            return {}
        }
    }
</script>
