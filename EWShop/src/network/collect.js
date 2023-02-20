import {request} from './request';

export function myCollects(page=1) {
    return request({
        url:`/api/collects?page=${page}`,
    })
}

export function setCollect(id) {
    return request({
        url:'/api/collects/goods/'+id,
        method:'post'
    })
}