<template>
    <div class="goods-item" @click="itemClick">
        <img v-lazy="product.cover_url" alt="">
        <div class="goods-info">
            <p>{{product.title}}</p>
            <span class="price"><small>￥</small>{{product.price.toFixed(2)}}</span>
            <span class="collect" >{{product.collects_count}}</span>
        </div>
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'
    export default {
        name: "GoodsListItem",
        props: {
            product: Object,
            default(){
                return {}
            }
        },
        setup(props) {
            const router = useRouter();



            return {
                itemClick:()=>{
                    router.push({path:'/detail', query:{id:props.product.id}});
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .goods-item {
        width:48%;
        padding-bottom: 40px;
        margin-bottom:20px;
        position: relative;
        box-shadow:2px 3px 4px #e9e9e9;

        img {
            width:100%;
            border-radius: 5px;
        }

        .goods-info {
            font-size:12px;
            position: absolute;
            bottom: 5px;
            left:0;
            right:0;
            overflow: hidden;
            text-align: center;

            p {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: 3px;
            }

            .price {
                color:red;
                margin-right:25px;
            }

            .collect {
                    position: relative;
            }


            .collect::before {
                content: '';
                position: absolute;

                width:14px;
                height:14px;

                left:-15px;
                top:-2px;
                background:url('~assets/images/collect.png')  no-repeat  0px/12px 12px;
            }


        }


    }

</style>