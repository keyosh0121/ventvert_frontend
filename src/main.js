import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from './plugins/axios';

Vue.config.productionTip = false
Vue.use(axios)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
