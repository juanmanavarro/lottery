import Vue from 'vue';
import App from './App.vue';

import './assets/tailwind.css'
import './assets/dark.min.css'
import './assets/sass/styles.scss';

import Toasted from 'vue-toasted';

Vue.config.productionTip = false;
Vue.use(Toasted, {
  theme: 'toasted-primary',
  position: 'bottom-right',
  duration : 5000
});

new Vue({
  render: h => h(App)
}).$mount('#app');
