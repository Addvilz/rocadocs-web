<template>
    <li>
        <div @click="onClick" @dblclick="onDoubleClick">
            <span v-if="isFolder" class="icon folder" :class="{open: open}"></span>
            <span v-else class="icon file"></span>
            {{model.name}}
        </div>
        <ul v-show="open || hasOpenChild" v-if="isFolder">
            <tree-item class="tree-item" v-for="model in model.children" :model="model" :page="page"></tree-item>
        </ul>
    </li>
</template>

<script>
    'use strict';

    export default {
        name: 'tree-item',
        props: {
            model: {},
            page: {}
        },
        data: function () {
            return {
                open: true === this.model.open ||
                (this.page.id && checkRecursiveOpen(this.page.id, this.model))
            };
        },
        computed: {
            isFolder: function () {
                return this.model.children && this.model.children.length;
            },
            hasOpenChild: function () {
                if (!this.page.id) {
                    return;
                }
                const isOpen = checkRecursiveOpen(this.page.id, this.model);
                if (isOpen && !this.model.open) {
                    this.model.open = true;
                }
                return isOpen;
            }
        },
        methods: {
            onClick: function () {
                eventBus.emit('page-display', this.model);
            },
            onDoubleClick: function () {
                if (this.isFolder) {
                    this.open = !this.open
                }
            }
        }
    }
</script>
