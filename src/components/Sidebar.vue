<template>
    <div id="sidebar">
        <search :state="state"></search>
        <ul>
            <tree-item class="menu-item" :model="tree" :page="page"></tree-item>
        </ul>
    </div>
</template>

<script>
    'use strict';

    import TreeItem from './sidebar/Item.vue'
    import Search from './sidebar/Search.vue'

    export default {
        name: 'sidebar',
        components: {
            TreeItem,
            Search
        },
        props: {
            tree: {},
            page: {},
            state: {}
        }
    }
</script>
