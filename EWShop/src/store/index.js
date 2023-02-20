import { createStore } from 'vuex'
import {getCart} from 'network/cart'

export default createStore({
  state: {
      homeTabsCurrentIndex:0,
        cartCount:0,
        user:{
          isLogin:window.localStorage.getItem('token') ? true : false
        }
  },
  mutations: {
      setHomeTabsCurrentIndex(state, payload) {
        state.homeTabsCurrentIndex = payload;
      },
        setIsLogin(state, payload) {
          state.user.isLogin = payload;
        },
        addCart(state, payload){
          state.cartCount = payload.count;
        }
  },
  actions: {
      updateCart({commit}) {
          getCart().then(res=>{
              commit('addCart', {count:res.data.data.length || 0})
          })
      }
  },
  modules: {
  }
})
