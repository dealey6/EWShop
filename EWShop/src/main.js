import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css'

import {PullRefresh,List,Popup,Grid,GridItem,AddressEdit,AddressList, Icon,SubmitBar,CheckboxGroup,SwipeCell,Stepper,Checkbox,Field,Form,Tag, Button, Image as VanImage, Card,Tab, Tabs, Swipe, SwipeItem,Lazyload,Badge,Sidebar, SidebarItem, Collapse, CollapseItem,  Empty, Divider,  Uploader,Loading,Skeleton,RadioGroup, Radio, Cell, CellGroup, CouponCell, CouponList,ContactEdit,Dialog } from 'vant';

createApp(App)
    .use(Swipe).use(SwipeItem).use(Lazyload,{
    loading:require('./assets/images/default.png')
}).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem)
    .use(Tab).use(Tabs).use(Card).use(VanImage).use(Tag).use(Button).use(Form).use(Field)
    .use(Checkbox).use(Stepper).use(SwipeCell).use(CheckboxGroup).use(SubmitBar).use(Icon).use(AddressList).use(AddressEdit)
    .use(GridItem).use(Grid).use(Popup).use(List).use(PullRefresh).use(Empty).use(Divider)
    .use(Uploader).use(Loading).use(Skeleton).use(RadioGroup).use(Radio).use(CellGroup).use(Cell).use(CouponCell).use(CouponList).use(ContactEdit).use(Dialog)
    .use(store).use(router).mount('#app')