<template>
  <div class="order-detail-box">
    <nav-bar class="nav-bar">
      <template v-slot:default>
        定单详情
      </template>
    </nav-bar>
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：</label>
        <span>{{statusString}}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{detail.order_no}}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{detail.created_at}}</span>
      </div>

      <van-button v-if="detail.status == 1"  @click="showPay = true" style="margin-bottom: 10px" color="#ff6a00" block>去支付</van-button>
      <van-button v-else-if="detail.status == 2"  @click="sendGoods" block >催发货</van-button>
      <van-button v-else-if="detail.status == 3"  @click="handleConfirmOrder" block >确认收货</van-button>
      <van-button v-else-if="detail.status == 4"   block >交易完成</van-button>
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥ {{total + '.00'}}</span>
      </div>
      <div class="price-item">
        <label>配送方式：</label>
        <span>{{kd}}</span>
      </div>
    </div>

       <van-card
            v-for="item in detail.orderDetails.data" :key="item.id"
            :num="item.num"
            :thumb="item.goods.cover_url"
            @click="itemClick(item.goods.id)"
    >

      <template #title>
        <div class="title">{{item.goods.title}}</div>
      </template>
      <template #price>
        <div class="price"><small>￥</small>{{item.price+'.00'}}</div>
      </template>
      <template #desc>
        <div class="desc">全场包邮</div>
      </template>
    </van-card>


    <div style="width:100%;height:50px;">

    </div>

   <!-- <van-popup
      v-model:show="showPay"
      position="bottom"
      :style="{ height: '40%' }"
    >

      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-grid :border="false" :column-num="2">
          <van-grid-item  text="支付宝">
            支付宝二维码<br>
            <van-image width="150" height="150" :src="aliyun" />
          </van-grid-item>
          <van-grid-item text="微信支付">
            微信二维码<br>
            <van-image width="150" height="150" :src="wechat" />
          </van-grid-item>
        </van-grid>

      </div>
    </van-popup>-->
    <van-popup
            closeable
            :close-on-click-overlay="false"
            v-model:show="showPay"
            position="bottom"
            :style="{ height: '30%' }"
            @close="close"
    >
      <h3 class="zftit">选择支付方式</h3>
      <van-radio-group v-model="checked">
        <van-cell-group inset>

          <van-cell title="微信支付"  clickable @click="checked = '1'">
            <template #icon>
              <van-icon class="iconw" :name="wxicon" />
            </template>
            <template  #right-icon>
              <van-radio name="1" />
            </template>
          </van-cell>
          <van-cell title="支付宝支付" clickable @click="checked = '2'">
            <template #icon>
              <van-icon  class="iconw" :name="zfbicon" />
            </template>
            <template #right-icon>
              <van-radio name="2" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <van-button @click="topay(checked)" color="linear-gradient(to right, #ff6034, #ee0a24)" style="position: absolute;bottom: 0" type="primary" block>使用{{checked=='1' ? '微信' : '支付宝'}}支付(模拟)</van-button>
      <!-- <van-grid :border="false" :column-num="2">
           <van-grid-item>
               支付宝二维码<br>
               <van-image width="150" height="150" :src="aliyun" />
           </van-grid-item>
           <van-grid-item>
               微信二维码<br>
               <van-image width="150" height="150" :src="wechat" />
           </van-grid-item>
       </van-grid>-->

    </van-popup>
  </div>
</template>

<script>
  import {reactive, toRefs, onMounted, computed, ref} from 'vue'
  import NavBar from "components/common/navbar/NavBar";
  import { getOrderDetail, confirmOrder, payOrder,payOrderStatus,viewExpress,paytest  } from 'network/order';
  import { Dialog, Toast } from 'vant'
  import { useRoute, useRouter } from 'vue-router'


  export default {
    name: 'OrderDetail',
    components: {
      NavBar
    },
    setup() {
      const route = useRoute()
      const router = useRouter()


      const state = reactive({
        detail:{
          orderDetails:{
            data:[]
          },
          status:0
        },
        showPay:false,
        orderNo:'',
        aliyun:'',
        wechat:'',
        wxicon:require('@/assets/images/wx.png'),
        zfbicon:require('@/assets/images/zfb.png')
      })

      const checked = ref('1');

      const init = () =>{
         const {id} =  route.query;
         state.orderNo = id;

          getOrderDetail(id).then(res=>{
            state.detail = res.data;
          })

      }

      onMounted(() => {
          Toast.loading({message:'加载中...', forbidClick:true});
          init();
          Toast.clear();
      })

      const statusString = computed(()=>{
        // 1下单 2支付 3发货 4收货 5过期
        let status = ['', '已下单', '已支付', '等待发货', '确认收货', '已过期'];

        return status[state.detail.status];
      })

      const total = computed(()=>{
          let sum = 0;

        state.detail.orderDetails.data.forEach(item=>{
              sum += item.num * item.price;
          })
          return sum;
      })

      const kd = computed(()=>{
        console.log(state.detail)

          let mess = "";

          const kd_type = {'SF':'顺风快递', "YTO":'圆通快递', "YD":'韵达快递'}
          if(state.detail.status >= 3) {
              mess =kd_type[state.detail.express_type.toUpperCase()]+"，单号："+state.detail.express_no;
          }else{
              mess = "普通快递";
          }
          return mess;
      })

      const showPayFn = () =>{
          state.showPay = true;

          payOrder(state.orderNo, {type:'aliyun'}).then(res=>{
            state.aliyun = res.data.qr_code_url;
          })

        // type= wechat  微信不支持沙箱测试
          payOrder(state.orderNo, {type:'aliyun'}).then(res=>{
            state.wechat = res.data.qr_code_url;
        })
          // 轮询查看
          const timer = setInterval(()=>{
            payOrderStatus(state.orderNo).then(res=>{
              if(res == '2') {
                clearInterval(timer);
                state.showPay = false;
                router.push({path:'/orderdetail', query:{id:state.orderNo}})
              }

            })
          }, 2000)

      }

      const handleConfirmOrder = ()=>{
        Dialog.confirm({
          title:'是否确认订单'
        }).then(()=>{
          confirmOrder(state.orderNo).then(res=>{

              Toast('确认成功');
              init();


          })
        }).catch(()=>{

        })
    }
      const topay = (checked) => {
        let types = ['', 'wechat','aliyun']
        router.push({ path: '/paytest', query:{type:types[checked], orderid:state.orderNo}});
      }



      const close = () =>{
        Dialog.close();
      }

      const sendGoods = () =>{
        Dialog.alert({
          message: '收到， 马上安排...',
        }).then(() => {
          // on close
        });
      }

      return {
        ...toRefs(state),
        statusString,
        total,
        showPayFn,
        handleConfirmOrder,
        close,
        checked,
        sendGoods,
        topay,
        kd,
        itemClick:goods_id=>{
          router.push({path:'/detail', query:{id:goods_id}});
        }
      }

    }
  }
</script>

<style lang="scss">
  .van-cell__title{
    text-align: left;
    padding-left: 20px;
  }
  .iconw {
    .van-icon__image {
      width:25px;
      height:25px;
    }

  }
  .zftit {
    font-size:14px;
    padding:15px;
    text-align: center;
  }
</style>

<style lang="scss" scoped>
  .order-detail-box {
    text-align: left;
    background: #f7f7f7;
    .order-status {
      background: #fff;
      margin-top: 44px;
      padding: 20px;
      font-size: 15px;
      .status-item {
        margin-bottom: 10px;
        label {
          color: #999;
        }
        span {

        }
      }
    }
    .order-price {
      background: #fff;
      margin: 20px 0;
      padding: 20px;
      font-size: 15px;
      .price-item {
        margin-bottom: 10px;
        label {
          color: #999;
        }
        span {

        }
      }
    }
    .van-card {
      margin-top: 0;
    }
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .title {
      font-size:14px;
      font-weight: bold;
    }
    .desc {
      margin:10px 0;
    }
    .price {
      font-size:16px;
      color:#ff6a00;
    }
  }
</style>
