<template>
    <div id="box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                个人中心
            </template>
        </nav-bar>

        <div class="user-box">
            <div class="user-info">
                <van-form>
                    <div class="info">
                        <div class="avatar">
                            <van-uploader :after-read="afterRead" :accept="'image/*'">
                                <img :src="user.avatar_url"/>
                                <!-- <img src="~assets/images/user.png"/>-->
                            </van-uploader>
                        </div>
                        <div class="user-desc">
                      <span>
                          <span
                              v-if="isUpdateName"
                              @click="isUpdateName = false"
                          >昵&nbsp;&nbsp;&nbsp;&nbsp;称：{{ user.name }}</span>
                         <van-field
                             v-else
                             v-model="user.name"
                             name="用户名"
                             label="昵&nbsp;&nbsp;&nbsp;&nbsp;称："
                             @blur="setName"
                         />

                      </span>
                            <span>登录名：{{ user.email }}</span>
                            <span class="name">签&nbsp;&nbsp;&nbsp;&nbsp;名：成就自己的只需一套精品</span>
                        </div>
                    </div>
                </van-form>
            </div>

            <ul class="user-list">
                <li class="van-hairline--bottom" @click="goTo('/order')">
                    <span>我的订单</span>
                    <van-icon name="arrow"/>
                </li>
                <li class="van-hairline--bottom" @click="goTo('/collect')">
                    <span>我的收藏</span>
                    <van-icon name="arrow"/>
                </li>

                <li class="van-hairline--bottom" @click="goTo('/setting')">
                    <span>账号管理</span>
                    <van-icon name="arrow"/>
                </li>
                <li class="van-hairline--bottom" @click="goTo('/address')">
                    <span>地址管理</span>
                    <van-icon name="arrow"/>
                </li>
                <li class="van-hairline--bottom" @click="goTo('/about')">
                    <span>关于我们</span>
                    <van-icon name="arrow"/>
                </li>
            </ul>
        </div>

        <div style="margin: 16px;">
            <van-button round block style="background: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);"
                        @click="tologout">退出登录
            </van-button>
        </div>
        <menu-bar></menu-bar>
    </div>
</template>

<script>
import MenuBar from "components/content/menubar/MenuBar";
import NavBar from "components/common/navbar/NavBar";
import {ref, reactive, toRefs, onMounted} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {logout, getUser, setUserName, uploadAvatar} from 'network/user'
import {Toast} from 'vant';

export default {
    name: "Profile",

    setup() {
        const router = useRouter()
        const store = useStore();

        let isUpdateName = ref(true)

        const state = reactive({
            user: {
                avatar_url: require('assets/images/user.png'),
                name: '加载中...',
                email: '加载中...'
            }
        })

        onMounted(() => {
            getUser().then(res => {
                state.user = res.data;
            })
        })

        const setName = () => {
            setUserName(state.user.name).then(res => {
                if (res.status == '204') {
                    isUpdateName.value = true;
                }
            })
        }

        const tologout = () => {
            logout().then(res => {
                if (res.status == '204') {
                    Toast.success("退出成功");
                    window.localStorage.setItem('token', '');
                    store.commit('setIsLogin', false);

                    setTimeout(() => {
                        router.push({path: '/login'});
                    }, 500);
                }
            });
        }

        // 跳转方法
        const goTo = (path, query) => {
            router.push({path, query: query || {}});
        }

        const afterRead = (file) => {

            let fd = new FormData()
            fd.append('avatar', file.file)
            uploadAvatar(fd).then(res => {
                if (res.status == '200') {
                    state.user.avatar_url = res.data.avatar;
                }
            })
        }

        return {
            ...toRefs(state),
            tologout,
            goTo,
            isUpdateName,
            setName,
            afterRead
        }
    },

    components: {
        NavBar,
        MenuBar
    }
}
</script>

<style lang="scss">
#box {
    background: #FCFCFC;
    height: 100vh;
}

.user-box {
    .van-cell {
        padding: 2px;

        .van-field__label {
            width: auto;
            margin-right: 0;
        }
    }

    margin-top: 65px;

    .user-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        width: 100%;
        height: 44px;
        line-height: 44px;
        padding: 0 10px;
        color: #252525;
        background: #fff;
        border-bottom: 1px solid #dcdcdc;

        .user-name {
            font-size: 14px;
        }
    }

    .username {
        border: 0px;

    }

    .user-info {
        width: 94%;
        margin: 10px;
        height: 115px;
        //background: linear-gradient(to top, #dbdcd7 0%, #dddcd7 24%, #e2c9cc 30%, #e7627d 46%, #b8235a 59%, #801357 71%, #3d1635 84%, #1c1a27 100%);
        //background:  linear-gradient(to right, #fa709a, #fee140);
        //background-image: linear-gradient(to right, #f83600 0%, #f9d423 100%);
        //background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);
        background: linear-gradient(-225deg, #77FFD2 0%, #6297DB 48%, #1EECFF 100%);
        //background: #504315;
        box-shadow: 0 2px 5px #EFEFEF;
        border-radius: 6px;
        margin-top: 50px;
        text-align: left;

        .avatar {
            left: 50%;
            transform: translate(-20%);
            margin-top: 10px;
            width: 50px;
            height: 50px;
            border: 1px solid #ffffff;
            box-shadow: 0 2px 3px #ffffff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                border-radius: 50%;
            }
        }

        .info {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            padding: 25px 20px;

            img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-top: 4px;
            }

            .user-desc {
                display: flex;
                flex-direction: column;
                margin-left: 10px;
                line-height: 20px;
                font-size: 14px;
                color: #fff;

                span {
                    color: #fff;
                    font-size: 14px;
                    padding: 2px 0;
                }
            }

            .account-setting {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 13px;
                color: #fff;

                .van-icon-setting-o {
                    font-size: 16px;
                    vertical-align: -3px;
                    margin-right: 4px;
                }
            }
        }
    }

    .user-list {
        padding: 0 8px;
        margin-top: 40px;

        li {
            padding-left: 5px;
            padding-right: 5px;
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;

            .van-icon-arrow {
                margin-top: 13px;
            }

            margin: 15px 0 !important;
            background: #FFFFFF;
            border-radius: 3px;
        }
    }
}


</style>
