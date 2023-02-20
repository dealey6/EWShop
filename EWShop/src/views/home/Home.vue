<template>
    <div id="home">
        <nav-bar>
            <template v-slot:default>图书兄弟</template>
        </nav-bar>


        <tab-control v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>

        <div class="wrapper">
            <div class="content">

                <div ref="banref">
                    <van-skeleton :row="5" :loading="loading">
                        <home-swiper :banners="banners"></home-swiper>

                        <recommend-view :recommends="recommends"></recommend-view>
                    </van-skeleton>

                </div>

                <tab-control @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>
                <van-skeleton :row="10" :loading="loading">
                    <goods-list :goods="showGoods"></goods-list>
                </van-skeleton>


            </div>
        </div>

        <back-top @bTop="bTop" v-show="isTabFixed"></back-top>

        <menu-bar></menu-bar>
    </div>
</template>

<script>
import MenuBar from "components/content/menubar/MenuBar";
import NavBar from "components/common/navbar/NavBar";
import RecommendView from "./ChildComps/RecommendView";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/common/backtop/BackTop";
import HomeSwiper from "./ChildComps/HomeSwiper";
import {getHomeAllData, getHomeGoods} from 'network/home';
import {ref, reactive, onMounted, computed, watchEffect, nextTick} from 'vue'

import BScroll from 'better-scroll'


export default {
    name: "Home",
    components: {
        NavBar,
        RecommendView,
        TabControl,
        GoodsList,
        BackTop,
        HomeSwiper,
        MenuBar
    },
    setup() {
        const loading = ref(true);


        let isTabFixed = ref(false);

        const recommends = ref([]);

        let currentType = ref('sales');

        let banref = ref(null);

        const banners = ref([]);

        const goods = reactive({
            sales: {page: 1, list: []},
            new: {page: 1, list: []},
            recommend: {page: 1, list: []}
        })

        const showGoods = computed(() => {
            return goods[currentType.value].list;
        })


        let bscroll = null;
        onMounted(() => {
            getHomeAllData().then(res => {
                //console.log(res.data.goods.data);
                recommends.value = res.data.goods.data;
                banners.value = res.data.slides;
                loading.value = false;
            })

            getHomeGoods('sales').then(res => {
                goods.sales.list = res.data.goods.data;
            })

            getHomeGoods('recommend').then(res => {
                goods.recommend.list = res.data.goods.data;
            })

            getHomeGoods('new').then(res => {
                goods.new.list = res.data.goods.data;
            })


            bscroll = new BScroll(document.querySelector('.wrapper'), {
                click: true,
                pullUpLoad: true,
                probeType: 3
            });

            bscroll.on('scroll', (position) => {
                //  console.log('当前位置：'+(-position.y));

                isTabFixed.value = (-position.y) >= banref.value.offsetHeight

                //   console.log(banref.value.offsetHeight);


            })

            bscroll.on('pullingUp', () => {


                const page = goods[currentType.value].page + 1;
                getHomeGoods(currentType.value, page).then(res => {
                    goods[currentType.value].list.push(...res.data.goods.data)
                    goods[currentType.value].page += 1;
                })


                bscroll.finishPullUp();
                bscroll.refresh();

                //  console.log('当前类型：'+currentType.value+",当前页："+page)
            })


        })

        const tabClick = (index) => {
            let types = ['sales', 'new', 'recommend'];

            currentType.value = types[index];


            nextTick(() => {
                bscroll && bscroll.refresh();
            })

        }

        const bTop = () => {
            bscroll.scrollTo(0, 0, 500);
        }


        return {
            loading,
            recommends,
            currentType,
            tabClick,
            goods,
            showGoods,
            isTabFixed,
            banref,
            bTop,
            banners
        }
    }

}
</script>

<style scoped lang="scss">
.banner {
    img {
        width: 100%;
        height: auto;
    }
}

#home {
    height: 100vh;
    position: relative;
}


.wrapper {
    position: absolute;
    top: 45px;
    bottom: 50px;
    left: 0px;
    right: 0px;
    overflow: hidden;

    .content {

    }
}

</style>