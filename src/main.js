import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'
import axios from './axios/axios'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import clipboard from 'clipboard'

Vue.prototype.ClipboardJS = clipboard;
Vue.use(ViewUI);
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(mavonEditor)

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
