import Vue from 'vue';
import App from './App.vue';
import store from "./store/index.js";

import './assets/tailwind.css'
import './assets/dark.min.css'

import './assets/sass/styles.scss';

// Todo: Update this when publishing
// import drizzleVuePlugin from '@drizzle/vue-plugin'
//
// import drizzleVuePlugin from '@drizzle/vue-plugin'
// import drizzleOptions from './drizzleOptions'

// Vue.use(drizzleVuePlugin, { store, drizzleOptions })

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
