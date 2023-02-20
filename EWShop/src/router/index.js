import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../views/home/Home');
const Category = () => import('../views/category/Category');
const Profile = () => import('../views/profile/Profile');
const ShopCart = () => import('../views/shopcart/ShopCart');
const Detail = () => import('../views/detail/Detail');
const Register = () => import('../views/profile/Register');
const Login = () => import('../views/profile/Login');
const Collect = () => import('../views/collect/Collect');

const Address = () => import('../views/profile/Address');
const PayTest = () => import('../views/paytest/PayTest');
const AddressEdit = () => import('../views/profile/AddressEdit');
const Order = () => import('../views/order/Order');
const OrderDetail = () => import('../views/order/OrderDetail');
const CreateOrder = () => import('../views/order/CreateOrder');
const About = () => import('../views/about/About');

import store from '../store';
import {Notify, Toast} from "vant";

const routes = [
  {
    path: '/',
    alias:['/','/home'],
    name: 'Home',
    component: Home,
    meta:{
      title:'图书兄弟',
      keepAlive:true,
    }
  },

  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:'图书兄弟-商品分类',
      keepAlive:true,
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta:{
      title:'图书兄弟-购物车',
      isAuthRequired:true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:'图书兄弟-个人中心',
      isAuthRequired:true
    }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: Collect,
    meta:{
      title:'我的收藏',
      isAuthRequired:true
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'图书兄弟-商品详情',
      keepAlive:true,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'图书兄弟-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'图书兄弟-用户登录'
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: {
      title:'图书兄弟-地址管理',
      isAuthRequired:true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title:'图书兄弟-编辑地址',
      isAuthRequired:true
    }
  },
  {
    path: '/paytest',
    name: 'PayTest',
    component: PayTest,
    meta: {
      title:'图书兄弟-模拟支付',
      isAuthRequired:true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta: {
      title:'图书兄弟-生成订单',
      isAuthRequired:true
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta: {
      title:'图书兄弟-订单预览',
      isAuthRequired:true
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title:'图书兄弟-订单详情',
      isAuthRequired:true
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于我们',
      keepAlive:true,
    }
  }

  /*{
    path: '/detail/:id',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'图书兄弟-商品详情'
    }
  },*/

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next)=>{

  if(to.meta.isAuthRequired && store.state.user.isLogin === false) {
    Notify('你还没有登录， 请先登录')
    return next('/login')
  }else{
    next();
  }

  document.title = to.meta.title

})

export default router
