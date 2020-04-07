<template>
	<view>
		<view style="position: relative;" v-if="!token">
			<button class="auth" plain="true" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo" @click.stop="prevent"></button>
			<slot></slot>
		</view>
		<view style="position: relative;" v-else-if="token && !showUserOrPhone">
			<button class='auth' plain="true" open-type='getPhoneNumber' @getphonenumber="getPhoneNumber"></button>
			<slot></slot>
		</view>
		<slot v-else></slot>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		props: {
			show: {
			  type: Boolean
			},
			//显示用户信息或手机
			showUserOrPhone: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				
			};
		},
		computed: mapState(['token', 'userInfo']),
		mounted() {
			
		},
		methods: {
			prevent() { }, //阻止父级元素跳转
			bindGetUserInfo(res){
				console.log(res)
				if(res.detail.rawData){
					interfaceurl.login(res.detail);
				} else {
					uni.showModal({
					    showCancel: false,
					    content: '授权失败'
					});
				}
			},
			getPhoneNumber(res) {
			    console.log(res);
				if (res.detail.encryptedData) {
					let params = {
						sessionKey: this.userInfo.sessionKey,
						openId: this.userInfo.openId,
						rawData: this.userInfo.rawData,
						signature: this.userInfo.signature,
						encryptedData: res.detail.encryptedData,
						iv: res.detail.iv
					}
					let that = this;
					interfaceurl.checkAuth(interfaceurl.getMobile, params).then((res) => {
						that.userInfo.mobile = res.data.mobile;
						that.$store.commit('setUserInfo', that.userInfo);
						uni.setStorageSync('userInfo', that.userInfo);
					});
				} else {
					uni.showModal({
					    showCancel: false,
					    content: '您取消了授权，请允许授权，以便提供更好的服务'
					});
				}
			}
		}
	}
</script>

<style>
.auth {
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0;
}
</style>
