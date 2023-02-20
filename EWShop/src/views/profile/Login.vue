<template>
    <div>
        <nav-bar>
            <template v-slot:default>用户登录</template>
        </nav-bar>

        <div class="userform">
            <div class="logo">
                <img src="~assets/images/ewshop_logo.png" alt="">
            </div>


            <van-form @submit="onSubmit">
                <van-field
                        v-model="email"
                        name="用户名"
                        label="用户名"
                        placeholder="用户名"
                        :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                        v-model="password"
                        type="password"
                        name="密码"
                        label="密码"
                        placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]"
                />

                <div style="margin: 16px;">
                    <div class="link-login" @click="$router.push({path:'/register'})">
                        没有账号，立即注册
                    </div>
                    <van-button round block  style="background: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);" native-type="submit">提交</van-button>
                </div>
            </van-form>

        </div>

    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {reactive, toRefs} from 'vue';
    import {login} from 'network/user';
    import {Toast} from 'vant'
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'

    export default {
        name: "Login",
        components: {
            NavBar
        },
        setup() {
            const userinfo = reactive({
                email:'',
                password:'',
            })

            const router = useRouter();
            const store = useStore();

            const onSubmit = () =>{
                login(userinfo).then(res=>{

                   // 将token window.localStorage    setItem(key, value)   getItem(key)
                    window.localStorage.setItem('token', res.data.access_token);
                    store.commit('setIsLogin', true);


                    Toast.success('登录成功')

                    userinfo.email = '';
                    userinfo.password = '';

                    setTimeout(()=>{
                        router.push({path: '/profile'})
                    }, 500)

                })
            }

            return {
                ...toRefs(userinfo),
                onSubmit
            }
        }
    }
</script>

<style scoped lang="scss">
    .link-login {
        font-size:14px;
        margin-bottom: 20px;
        color:var(--color-high-text);
        display: inline-block;
        text-align: left;
        float:left;
    }

    .userform {
        margin:100px 0;
        .logo {
            padding-bottom: 50px;
            img {
                width:150px;
                height:auto;
            }
        }
    }
</style>