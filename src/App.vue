<template>
    <div v-if="state.loaded" id="app">
        <div id="sidebar-outer">
            <sidebar id="sidebar" :tree="data.tree" :page="currentPage" :state="state"></sidebar>
        </div>
        <div id="content">
            <div v-if="!state.query.q" id="page-outer">
                <page :page="currentPage"></page>
            </div>
            <div v-if="state.query.q">
                <div v-if="!state.search.results.length">
                    Nothing found
                </div>
                <result-page v-for="search_page in state.search.results" :page="search_page"></result-page>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="loader">
            <div class="">Doing magic...</div>
            <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>
        </div>
    </div>
</template>

<script>
    'use strict';

    import Page from './components/Page.vue'
    import ResultPage from './components/ResultPage.vue'
    import Sidebar from './components/Sidebar.vue'

    export default {
        name: 'app',
        components: {
            Page,
            ResultPage,
            Sidebar
        },
        data () {
            return {
                state: objectStore.state,
                currentPage: objectStore.currentPage,
                data: objectStore.data
            }
        }
    }
</script>

<style lang="scss">
    @import './assets/style.scss';
    @import './assets/code.scss';
    @import '../node_modules/spinkit/scss/spinners/11-folding-cube.scss';
</style>
