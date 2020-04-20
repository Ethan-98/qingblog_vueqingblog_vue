import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/login',
    name: 'Login',
    component: () =>import('@/views/login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component:() => import('@/views/login/Register.vue')
  },
  {
    path: '/',
    name: 'Home',
    component:() => import('@/views/home/Home.vue')
  },
  {
    path: '/editBlog',
    name: 'EditBlog',
    component:()=>import('@/views/blog/EditBlog.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component:()=>import('@/views/blog/ViewBlog.vue')
  },
  {
    path: '/myInfo',
    name: 'MyInfo',
    component:()=>import('@/views/personalInfo/MyInfo.vue')
  },
  {
    path: '/alertInfo',
    name: 'AlertInfo',
    component:()=>import('@/views/personalInfo/AlertInfo.vue')
  },
  {
    path: '/alertPwd',
    name: 'AlertPwd',
    component:()=>import('@/views/personalInfo/AlertPwd.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((from,to,next)=>{
  console.log(from+to+"");
  NProgress.start();
  next();
})
router.afterEach(()=>{
  NProgress.done()
})

export default router
