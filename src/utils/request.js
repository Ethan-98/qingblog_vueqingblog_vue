import axios from 'axios'
import store from '../store/index.js'
import Nprogress from 'nprogress'


Nprogress.configure({showSpinner:false})
const request=axios.create({
    baseURL:'',
    timeout: 12000,
    headers:{
        'Content-Type':'application/json',
        'Accept': 'application/json'
    }
})


//拦截器
request.interceptors.request.use(
    config=>{
        Nprogress.start();
        config.headers['token']=store.state.token;
        return config;
    },
    error=>{
        return Promise.reject(error);
    }
)

//响应拦截器
request.interceptors.request.use(
    response=>{
        Nprogress.done();
        return response;
    },
    error=>{
        Nprogress.done();
        return Promise.reject(error)

    }
)


export default request