import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";

import routes from "./routes";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  VBTooltipPlugin,
  VBHoverPlugin,
  IconsPlugin,
  FormFilePlugin,
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  VBTooltipPlugin,
  VBHoverPlugin,
  IconsPlugin,
  FormFilePlugin,
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    if (error.response.status == 401) {
      router.push({ name: "login" }).catch(() => {});
    }
    // Do something with response error
    return Promise.reject(error);
  }
);
//axios.defaults.withCredentials = true;
axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

const shared_data = {
  base_url: "http://localhost:3000",
  //base_url: "https://assignment-3-3-oscar-doron.herokuapp.com",
  username: localStorage.username,
  profilePicture: localStorage.profilePicture,
  search: localStorage.search,
  searcRrecipes: localStorage.searcRrecipes,

  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    console.log("login", this.username);
  },
  async  logout() {
    console.log("logout");
    await axios.post(this.base_url + "/user/Logout");
    localStorage.removeItem("username");
    Vue.$cookies.remove("session");
    localStorage.removeItem("profilePicture");
    this.profilePicture = undefined;
    this.username = undefined;
    
  },
  setProfilePicture(profilePicture) {
    localStorage.setItem("profilePicture", profilePicture);
    this.profilePicture = profilePicture;
  },
  setSearch(search){
    localStorage.setItem("search" +this.username , search);
    this.search = search;
  },
  setRecipes(recipes){
    localStorage.setItem("searchRecipes" +this.username , JSON.stringify( recipes));
    this.searcRrecipes = recipes;
  }
};

router.beforeEach((to, from, next) => {
  if (shared_data.username === undefined || !Vue.$cookies.get("session")) {
    if (
      (shared_data.username === undefined && Vue.$cookies.get("session")) ||
      (shared_data.username !== undefined && !Vue.$cookies.get("session"))
    ) {
      shared_data.logout();
    }

    if (to.matched.some((location) => location.meta.requiresAuth)) {
      next({ name: "login" });
    } else next();
  } else next();
});

new Vue({
  router,
  data() {
    return {
      store: shared_data,
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000,
      });
    },
  },
  render: (h) => h(App),
}).$mount("#app");
