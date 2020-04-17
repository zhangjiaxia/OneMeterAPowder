<script>
	import store from '@/store' //引入全局变量的token
	export default {
		onLaunch: function() {
			//console.log('App Launch')
		},
		onShow: function() {
			store.commit('updateToken', uni.getStorageSync('token'))
			store.commit('setUserInfos', uni.getStorageSync('userInfo'))
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style>
	@import "./common/iconfont.css"; 
	/*每个页面公共css */
	page{
		height: 100%;
		font-size: 30upx;
		color: #333333;
		overflow: unset;
	}
	/*导航栏吸顶效果,由于封装成组件后会多一层view，导致苹果手机不吸顶*/
	.bar-sticky {
		position: sticky;
		position: -webkit-sticky;
		top: 0;
		z-index: 101;
	}
	.container{
	  min-height: 100%;
	  background: #EEEEEE;
	  position: relative;
	  box-sizing: border-box;
	}
	.empty-text{
	  text-align: center;
	  font-size: 26upx;
	  color: #999999;
	  margin: 50rpx;
	}
	.common-btn{
	  width: 100%;
	  height: 39px;
	  line-height: 39px;
	  text-align: center;
	  font-size: 32upx;
	  background: #4C7DE3;
	  border-radius: 10upx;
	  color: #ffffff;
	}
</style>
