import Vue from 'vue';
import App from './App.vue';
import mondaySdk from 'monday-sdk-js';
import axios from 'axios';

Vue.prototype.wait = async function(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

Vue.prototype.BIDSERVER_URL="https://741488bdca8b.ngrok.io";

Vue.prototype.$api = axios.create();

Vue.prototype.monday = mondaySdk();

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
