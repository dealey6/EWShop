<template>
    <div class="address-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                模拟支付
            </template>
        </nav-bar>

        <div class="card">
            <van-image style="text-align: center"
                       width="64px"
                       lazy-load
                       :src="type == 'wechat' ? wxicon : zfbicon"
            />

            <div style="text-align: center;padding:30px;line-height: 40px">
                <p style="font-size:20px;">支付金额</p>
                <p style="font-size:30px;color:red">
                    <small>￥</small>{{info.amount}}.<small>00</small>
                </p>
            </div>

            <van-cell style="text-align: left" title="订单NO." :value="info.order_no" />


            <van-cell  style="text-align: left"  title="收款方" value="图书兄弟" label="模拟支付，改变支付状态，完成购物流程，请放心付款。" />
        </div>


        <div style="margin: 16px">
            <van-button @click="toPay()" round block type="primary" native-type="submit">
                立即支付
            </van-button>
        </div>
    </div>
</template>

<script>
    import { ref, reactive, toRefs, onMounted } from 'vue'
    import NavBar from "components/common/navbar/NavBar";
    import { getOrderDetail,paytest } from 'network/order'

    import { useRoute, useRouter } from 'vue-router'
    import { Toast, Dialog } from 'vant';
    export default {
        components: {
            NavBar
        },
        setup() {
            const route = useRoute();
            const router = useRouter();


            let type = ref(route.query['type']);
            let orderId = route.query['orderid'];
            const state = reactive({
                info:{},
                wxicon:require('@/assets/images/wx.png'),
                zfbicon:require('@/assets/images/zfb.png')
            })


            console.log(type, orderId);

            onMounted(()=>{

                getOrderDetail(orderId).then(res=>{
                    state.info = res.data;
                })
            })


            const toPay = () =>{
                console.log(type, "##");

                paytest(orderId, {type:type.value}).then(res=>{


                    let option = {};

                    if(type.value == "aliyun") {
                        option = {
                            title: '支付成功，'+res.data.out_trade_no,
                            message: '已支付'+(res.data.total_amount/100)+'.00, 购买了'+res.data.subject,
                        }
                    }else {
                        option = {
                            title: '支付成功，'+res.data.out_trade_no,
                            message: '已支付'+(res.data.total_fee/100)+'.00, 购买了'+res.data.body,
                        }
                    }

                    Dialog.alert(option).then(() => {
                        router.push({path:'/orderdetail', query:{id:orderId}})
                    });

                })
            }

            return {
                ...toRefs(state),
                type,
                toPay
            }
        },
    }
</script>

<style lang="scss" scoped>
.card {
    margin-top: 100px;

}

</style>


