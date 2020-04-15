<template>
	<view class="container">
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<image src="/static/vip-bac.png" class="bac" mode="widthFix"></image>
		<view class="bottom-btn" @click="memberCard">立即加入一米一粉会员(299一年)</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					background: '#020202',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '会员权益' //导航栏文字
				},
			}
		},
		methods: {
			memberCard() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.vipPayment, {}).then((res) => {
					uni.requestPayment({
					    timeStamp: res.data.timeStamp,
					    nonceStr: res.data.nonceStr,
					    package: res.data.package,
					    signType: res.data.signType,
					    paySign: res.data.paySign,
					    success: (res) => {
							uni.setStorageSync('isVip', 1)
							uni.showToast({
							    title: '会员充值成功',
							    icon: 'none',
							    duration: 2000
							});
					        // that.$turnPage('/pages/shopping/trade/order', 'redirectTo')
					    },
					    fail: (res) => {
							// that.$turnPage('/pages/shopping/trade/order', 'redirectTo')
							uni.showToast({
							    title: '充值失败',
							    icon: 'none',
							    duration: 2000
							});
					    },
					    complete: () => {
							
					    }
					});
				});
			}
		}
	}
</script>

<style>
.bac{
	width: 100%;
	vertical-align: top;
}
.bottom-btn{
	height: 39px;
	line-height: 39px;
	background: #EEB950;
	color: #ffffff;
	text-align: center;
	position: sticky;
	bottom: 0;
	width: 100%;
}
</style>
