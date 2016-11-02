<template>
    <div id="search">
        <input type="search" v-model="state.query.q" placeholder="Search...">
    </div>
</template>

<script>
    'use strict';

    export default {
        name: 'search',
        props: {
            state: null
        }
    }
</script>
