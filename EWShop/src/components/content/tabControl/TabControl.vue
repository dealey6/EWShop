<template>
    <div class="tab-control">
        <div class="tab-control-item"
             v-for="(item, index) in titles" :key="index"
             @click="itemClick(index)"
             :class="{active:index == $store.state.homeTabsCurrentIndex}"
        >
            <span>{{ item }}</span>
        </div>

    </div>
</template>

<script>
import {ref} from 'vue';
import {useStore} from 'vuex';

export default {
    name: "TabControl",
    props: {
        titles: {
            type: Array,
            defualt() {
                return []
            }
        }
    },
    setup(props, {emit}) {
        const store = useStore();


        const itemClick = (index) => {

            store.commit('setHomeTabsCurrentIndex', index);

            emit('tabClick', index);
        }


        return {
            itemClick
        }
    }
}
</script>

<style scoped lang="scss">
.tab-control {
    background: var(--color-daohanglan);
    display: flex;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    width: 100%;
    z-index: 9;

    position: sticky;
    top: 44px;

    .tab-control-item {
        flex: 1;

        span {
            padding: 6px;
        }
    }

    .active {
        color: var(--color-cl);

        span {
            border-bottom: 3px solid var(--color-cl);
        }
    }
}
</style>