import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import RegisterUser from "../views/RegisterUser.vue";
import DailyPost from "../views/DailyPost.vue";
import MyCondition from "../views/MyCondition";
import EmployeeCondition from "../views/EmployeeCondition";
import Aggregate from "../views/Aggregate";
import EmployeeList from "../views/EmployeeList";
import AdminSetting from "../views/AdminSetting";
import Home from "../views/Home.vue";
import Top from "../views/Top.vue";
import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/registerUser",
    name: "RegisterUser",
    component: RegisterUser,
  },
  {
    path: "/top",
    name: "Top",
    component: Top,
  },
  {
    path: "/home",
    name: "Home",
    //ログインしていたら上記のパスに飛ぶことを許可する
    component: Home,
    beforeEnter(to, from, next) {
      if (store.getters.getStatus === 1) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/dailyPost",
    name: "DailyPost",
    component: DailyPost,
    //ログインしていたら上記のパスに飛ぶことを許可する
    beforeEnter(to, from, next) {
      if (store.getters.getStatus === 1) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/employeeCondition/:userId",
    name: "EmployeeCondition",
    component: EmployeeCondition,
    //ログインしていたら上記のパスに飛ぶことを許可する
    beforeEnter(to, from, next) {
      if (store.getters.getStatus === 1) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/myCondition",
    name: "MyCondition",
    component: MyCondition,
    //ログインしていたら上記のパスに飛ぶことを許可する
    beforeEnter(to, from, next) {
      if (store.getters.getStatus === 1) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/aggregate",
    name: "Aggregate",
    component: Aggregate,
    //ログインしていたら上記のパスに飛ぶことを許可する
    beforeEnter(to, from, next) {
      if (store.getters.getStatus === 1) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/employeeList",
    name: "EmployeeList",
    component: EmployeeList,
    //ログインしていたら上記のパスに飛ぶことを許可する
    beforeEnter(to, from, next) {
      if (store.getters.getStatus === 1) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/adminSetting",
    name: "AdminSetting",
    component: AdminSetting,
    //ログインしていたら上記のパスに飛ぶことを許可する
    beforeEnter(to, from, next) {
      if (store.getters.getStatus === 1) {
        next();
      } else {
        next("/");
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
