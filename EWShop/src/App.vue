<template>

    <!-- <router-view/>-->


    <router-view v-slot="{ Component }">
        <keep-alive :include="includeList">
            <component :is="Component"></component>
        </keep-alive>
    </router-view>


</template>


<script>
import {onMounted} from 'vue'
import {useStore} from 'vuex'

export default {
    data() {
        return {
            includeList: []
        }
    },
    watch: {
        $route(to) {
            //监听路由变化，把配置路由中keepAlive为true的name添加到include动态数组中
            const that = this;
            if (to.meta.keepAlive && that.includeList.indexOf(to.name) === -1) {
                that.includeList.push(to.name);
            }
        }
    },
    setup() {
        const store = useStore();


        onMounted(() => {


            if (store.state.user.isLogin) {
                store.dispatch('updateCart');
            }

        })
    },
    created() {},
    mounted() {
        //窗口尺寸改变
        window.addEventListener("resize", () => this.Refresh());
    },
    methods: {
        Refresh() {
            this.$router.go(0);
        },
    },
    destroyed() {
        // 销毁
        window.removeEventListener("resize", this.Refresh());
    },
}
</script>


<style lang="scss">

@import "assets/css/base.css";
@import "assets/css/iconfont.css";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}


</style>
