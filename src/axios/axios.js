import axios from 'axios'

// import cookie from '../../static/js/cookie.js'

// axios默认配置
axios.defaults.timeout = 10000;   // 超时时间

axios.defaults.baseURL = 'http://localhost:8080/qingblog/';  // 默认地址
axios.defaults.withCredentials = true

axios.interceptors.request.use(
  config => {
    //跨域用不了session，在这留着用token吧
    return config;
  },
  error => {
    return Promise.reject(error.response);
  });

// 路由响应拦截
// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.resultCode == "404") {
      console.log("response.data.resultCode是404")
      //404可以用router push到404界面
      //也可以捕获token验证失败，push到登录
      return
    } else {
      return response;
    }
  },
  error => {
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  });
export default axios;