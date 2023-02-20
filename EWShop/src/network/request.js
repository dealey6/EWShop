import axios from 'axios';
import {Notify, Toast} from 'vant';
import router from '../router'

export function request(config){

    const instance = axios.create({
        baseURL:'https://api.shop.eduwork.cn',
        timeout:5000
    });

    //请求拦截
    instance.interceptors.request.use(config=>{
        Toast.loading({
            message: '加载中...',
            forbidClick: true,
        });


        // 如果API需要认证， 在这统一设置
        const token = window.localStorage.getItem('token');

        if(token) {
            config.headers.Authorization = 'Bearer '+token;
        }

        return config;
    }, err=>{

    })

    //响应拦截
    instance.interceptors.response.use(res=>{
        Toast.clear();
        return res;
    }, err=>{

        // 如果没有授权， 去login
        if(err.response) {

            if (err.response.status == '401') {
                Toast.fail('请先登录')
                router.push({path: '/login'})
            }
            if (err.response.status == '500') {
                Toast.fail('（服务器内部错误） 服务器遇到错误，无法完成请求')
            }
            if (err.response.status == '400') {
                Toast.fail('（错误请求）服务器不理解请求的语法')
            }
            if (err.response.status == '422') {
                Toast.fail('（验证错误） 请求参数未通过验证')
            }
            // 如果有错误， 在这里可以提示
            Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])
        }
    })

    return instance(config)
}