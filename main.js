import Vue from 'vue'
import App from './App'
import store from './store' //全局变量

Vue.config.productionTip = false
Vue.prototype.$store = store;

//注册全局跳转
Vue.prototype.$turnPage = (url, turnType) => {
    if(turnType === 'navigateTo') { //保留当前页面，跳转到应用内的某个页面
		uni.navigateTo({
		    url: url
		});
	} else if(turnType === 'switchTab') { //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面wx.redirectTo
		uni.switchTab({
		    url: url
		});
	} else if(turnType === 'redirectTo') { //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
		uni.redirectTo({
		  url: url
		})
	} else if(turnType === 'reLaunch') { //关闭所有页面，打开到应用内的某个页面
		uni.reLaunch({
		  url: url
		})
	} else if(turnType === 'navigateBack') { //关闭当前页面，返回上一页面或多级页面
		uni.navigateBack({
		  delta: url
		})
	}
};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
