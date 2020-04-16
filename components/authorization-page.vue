<template>
	<view>
		<view style="position: relative;" v-if="!userInfos.nickName">
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
				//token: '' //先用存储本地的token判断
			};
		},
		computed: mapState(['token', 'userInfos']),
		mounted() {
			//console.log('授权mounted',this.userInfos)
		},
		methods: {
			prevent() { }, //阻止父级元素跳转
			bindGetUserInfo(res){
				//console.log(res)
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
			    //console.log(res);
				if (res.detail.encryptedData) {
					let params = {
						sessionKey: this.userInfos.sessionKey,
						openId: this.userInfos.openId,
						rawData: this.userInfos.rawData,
						signature: this.userInfos.signature,
						encryptedData: res.detail.encryptedData,
						iv: res.detail.iv
					}
					let that = this;
					interfaceurl.checkAuth(interfaceurl.getMobile, params).then((res) => {
						that.userInfos.mobile = res.data.mobile;
						that.$store.commit('setUserInfo', that.userInfos);
						uni.setStorageSync('userInfos', that.userInfos);
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
