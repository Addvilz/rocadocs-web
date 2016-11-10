<template>
    <div v-if="state.loaded" id="app">
        <topbar :state="state" :meta="meta" :currentPage="currentPage"></topbar>
        <div id="sidebar-outer">
            <sidebar id="sidebar" :tree="data.tree" :page="currentPage" :state="state" :class="{open: state.menuVisible}"></sidebar>
        </div>
        <div id="content">
            <div v-if="!state.query.q" id="page-outer">
                <page :page="currentPage"></page>
            </div>
            <div v-if="state.query.q">
                <div v-if="!state.search.results.length">
                    Nothing found
                </div>
                <div v-else>
                    Found {{state.search.results.length}} results:
                </div>
                <result-page v-for="search_page in state.search.results" :page="search_page"></result-page>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="loader">
            <div class="loading">
                Loading contents...
                <div class="sk-folding-cube">
                    <div class="sk-cube1 sk-cube"></div>
                    <div class="sk-cube2 sk-cube"></div>
                    <div class="sk-cube4 sk-cube"></div>
                    <div class="sk-cube3 sk-cube"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    'use strict';

    import Page from './components/Page.vue'
    import ResultPage from './components/ResultPage.vue'
    import Sidebar from './components/Sidebar.vue'
    import Topbar from './components/Topbar.vue'

    export default {
        name: 'app',
        components: {
            Page,
            ResultPage,
            Sidebar,
            Topbar
        },
        data () {
            return {
                state: objectStore.state,
                currentPage: objectStore.currentPage,
                data: objectStore.data,
                meta: objectStore.meta
            }
        }
    }
</script>

<style lang="scss">
    @import './assets/style.scss';
    @import './assets/code.scss';
    @import './assets/print.scss';
    @import './assets/mobile.scss';
    @import '../node_modules/spinkit/scss/spinners/11-folding-cube.scss';
</style>

