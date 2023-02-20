<template>
    <div>
        <nav-bar>
            <template v-slot:default>新用户注册</template>
        </nav-bar>

        <div class="userform">
            <div class="logo">
                <img src="~assets/images/ewshop_logo.png" alt="">
            </div>
            <van-form @submit="onSubmit">
                <van-field
                        v-model="name"
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

                <van-field
                        v-model="password_confirmation"
                        type="password"
                        name="确认密码"
                        label="确认密码"
                        placeholder="确认密码"
                        :rules="[{ required: true, message: '请填写一致密码' }]"
                />

                <van-field
                        v-model="email"
                        name="电子邮箱"
                        label="电子邮箱"
                        placeholder="请输入正确电子邮箱格式"
                        :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <div style="margin: 16px;">
                    <div class="link-login" @click="$router.push({path:'/login'})">
                        已有账号，立即登录
                    </div>
                    <van-button round block  style="background: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);" native-type="submit">提交</van-button>
                </div>
            </van-form>

        </div>

    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {ref, reactive, toRefs} from 'vue';
    import {Notify,Toast } from 'vant';
    import {register} from 'network/user.js'
    import {useRouter} from 'vue-router';

    export default {
        name: "Register",
        components: {
            NavBar
        },
        setup() {
            const userinfo = reactive({
                name:'',
                password:'',
                password_confirmation:'',
                email:''
            })


            const router = useRouter();
            const onSubmit = () =>{
                // 先验证 ...
                if(userinfo.password != userinfo.password_confirmation) {
                    Notify('两次密码不一致....');
                }else{
                    register(userinfo).then(res=>{
                       // console.log(res);

                        if(res.status == '201'){
                            Toast.success('注册成功')

                            setTimeout(()=>{
                                router.push({path:'/login'})
                            }, 1000)
                        }

                        userinfo.password_confirmation = '';
                        userinfo.password = '';
                    })
                }

                // 提交给服务器
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