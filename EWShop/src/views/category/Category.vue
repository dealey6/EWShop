<template>
    <div>
        <nav-bar>
            <template v-slot:default>商品分类</template>
        </nav-bar>

        <div id="mainbox">
            <div class="ordertab">

                <van-tabs v-model:active="active" @click-tab="tabClick">
                    <van-tab title="销量排序"></van-tab>
                    <van-tab title="价格排序"></van-tab>
                    <van-tab title="评论排序"></van-tab>

                </van-tabs>
            </div>


            <van-sidebar class="leftmenu" v-model="activeKey">
                <van-skeleton :row="10" :loading="loading">
                    <van-collapse v-model="activeName" accordion>
                        <van-collapse-item v-for="item in categories" :key="item.id"
                                           :title="item.name"
                                           :name="item.name">

                            <van-sidebar-item
                                v-for="sub in item.children"
                                :title="sub.name"
                                :key="sub.id"
                                @click="getGoods(sub.id)"
                            />

                        </van-collapse-item>

                    </van-collapse>
                </van-skeleton>
            </van-sidebar>


            <div class="goodslist">
                <div class="content">
                    <van-card v-if="showGoods.length >0"
                              style="padding:5px;"
                              v-for="item in showGoods" :key="item.id"
                              @click="itemClick(item.id)"
                              :tag="item.comments_count >= 0 ? '流行' : '标签'"
                              :title="item.title"

                    >
                        <template #thumb>
                            <div class="thumb"><img v-lazy="item.cover_url" alt=""></div>
                        </template>

                        <template #desc>
                            <div class="price"><small>￥</small>{{ item.price + '.00' }}</div>
                        </template>
                        <template #price>
                            <div class="sales">商品销量</div>
                        </template>

                        <template #num>
                            <div class="num">x{{ item.sales }}</div>
                        </template>
                    </van-card>
                    <div v-else style="text-align:center;font-size:14px;padding-top:60px;">
                        <van-loading v-if="loadshow" size="24px">加载中...</van-loading>
                        <span v-else>该分类下没有商品</span>
                    </div>
                </div>
            </div>


        </div>

        <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
        <menu-bar></menu-bar>
    </div>
</template>

<script>
import MenuBar from "components/content/menubar/MenuBar";
import NavBar from "components/common/navbar/NavBar";
import BackTop from "components/common/backtop/BackTop";

import {getCategory, getCategoryGoods} from 'network/category'

import {onMounted, ref, reactive, computed, watchEffect, watch, nextTick} from 'vue';
import {useRouter} from 'vue-router';

import BScroll from 'better-scroll';
import {Toast} from 'vant'


export default {
    name: "Category",
    components: {
        NavBar,
        BackTop,
        MenuBar,
    },


    setup() {
        const loading = ref(true);
        let active = ref(0);
        let activeKey = ref(0);
        const activeName = ref(1);
        let isShowBackTop = ref(false);
        let loadshow = ref(true);

        const router = useRouter();
        // 获取所有分类
        const categories = ref([]);
        // 当前分类的id
        let currentCid = ref(0);  //从1开始
        // 当前排序的参数
        let currentOrder = ref('sales');

        let bscroll = null;

        // 数据模型
        const goods = reactive({
            sales: {page: 0, list: []},
            price: {page: 0, list: []},
            comments_count: {page: 0, list: []},
        })


        // 计算属性， 获取选项的对应数据
        const showGoods = computed(() => {

            return goods[currentOrder.value].list;
        })


        const init = () => {
            loadshow.value = true;

            getCategoryGoods('sales', currentCid.value).then(res => {
                goods.sales.list = res.data.goods.data;
                goods.sales.page = 1;
                loadshow.value = false;

            })
            getCategoryGoods('price', currentCid.value).then(res => {
                goods.price.list = res.data.goods.data;
                goods.price.page = 1;
                loadshow.value = false;
            })
            getCategoryGoods('comments_count', currentCid.value).then(res => {
                goods.comments_count.list = res.data.goods.data;
                goods.comments_count.page = 1;
                loadshow.value = false;
            })

        }


        onMounted(() => {

            getCategory().then(res => {
                loadshow.value = true;
                if (res.status != 'undefined' && res.status == '200') {
                    categories.value = res.data.categories;
                    loadshow.value = false;
                    loading.value = false;
                }

            })

            init();

            bscroll = new BScroll(document.querySelector('.goodslist'), {
                probeType: 3,  // 0, 1, 2, 3, 3 只要在运运就触发scroll事件
                click: true, // 是否允许点击
                pullUpLoad: true //上拉加载更多， 默认是false
            });

            bscroll.on('scroll', (position) => {

                isShowBackTop.value = (-position.y) > 500;


            });

            // 获取下一页数据， 加到对应类型的，list里面
            let page = ref(0);

            bscroll.on('pullingUp', () => {
                page.value = goods[currentOrder.value].page + 1;


                // 完成上拉， 等数据请求完成， 要将新数据展示出来finishPullUp();
                bscroll.finishPullUp();

                //重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。例：scroll.refresh();
                nextTick(() => {
                    bscroll && bscroll.refresh();
                })
            });

            // 当页数有变化时，才加载下一页数据
            watch(page, (newv, oldv) => {
                if (newv != oldv) {
                    loadNextPageData();
                }

            })

            // 加载下一页数据
            const loadNextPageData = () => {

                getCategoryGoods(currentOrder.value, currentCid.value, page.value).then(res => {
                    if (res != undefined && res.status == '200') {
                        if (res.data.goods.data.length > 0) {
                            goods[currentOrder.value].list.push(...res.data.goods.data);
                            goods[currentOrder.value].page += 1;
                        } else {
                            Toast.fail('没有更多数据了');
                        }

                    }
                })
            }

        })

        const getGoods = cid => {
            currentCid.value = cid;
            currentOrder.value = 'sales';
            active.value = 0;
            init();


            nextTick(() => {
                bscroll && bscroll.refresh();
            })

        }

        const tabClick = index => {
            let orders = ['sales', 'price', 'comments_count'];

            currentOrder.value = orders[index.name];


            nextTick(() => {
                bscroll && bscroll.refresh();
            })


        }


        const bTop = () => {
            bscroll.scrollTo(0, 0, 500)
        }

        const itemClick = id => {
            router.push({path: '/detail', query: {id}});
        }

        return {
            active,
            activeKey,
            tabClick,
            activeName,
            categories,
            currentCid,
            getGoods,
            showGoods,
            bTop,
            isShowBackTop,
            itemClick,
            loadshow,
            loading
        }
    }
}
</script>

<style scoped lang="scss">
#mainbox {
    margin-top: 45px;
    display: flex;

    .ordertab {
        flex: 1;
        float: right;
        height: 50px;
        z-index: 9;
        position: fixed;
        top: 45px;
        right: 0;
        left: 130px;
    }

    .leftmenu {
        position: fixed;
        top: 95px;
        left: 0;
        width: 130px;
    }

    .goodslist {
        flex: 1;
        position: absolute;
        top: 100px;
        left: 120px;
        right: 0;
        height: 100vh;
        padding: 10px;
        text-align: left !important;

        .content {

        }
    }

    .price {
        color: #ff6a00;
        font-size: 16px;
        margin-top: 10px;
    }

    .sales {
        position: relative;
        top: -10px;
        color: #666;
        font-size: 12px;
    }

    .num {
        position: relative;
        top: -10px;
    }

    .thumb {
        width: 80px;

        img {
            width: 80px
        }
    }
}

.van-card__thumb {
    width: 68px !important
}
</style>