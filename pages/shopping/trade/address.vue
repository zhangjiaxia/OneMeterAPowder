<template>
	<view style="padding-top: 20rpx;">
		<view class="uni-flex uni-row vertical addresslist" v-for="(item,index) in addressList" :key="index">
			<view class="uni-flex uni-column rest left">
				<view>
					<text class="name">{{item.receiver}}</text>
					<text class="name">{{item.receiverPhone}}</text>
				</view>
				<view class="uni-flex vertical">
					<view class="uni-flex content default" v-if="item.isDefault == 1">默认</view>
					<view class="uni-flex address">{{item.receiverAddr}}</view>
				</view>
			</view>
			<!-- <view class="uni-flex"></view> -->
			<view class="uni-flex right address" @click="$turnPage('/pages/shopping/trade/address-add?item='+JSON.stringify(item), 'navigateTo')">编辑</view>
		</view>
		<view class="uni-flex content">
			<view class="uni-flex content addbtn" @click="$turnPage('/pages/shopping/trade/address-add', 'navigateTo')">新建地址</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				addressList: [],
				origin: 1
			}
		},
		onLoad(options) {
		  if(options.origin) {
			this.origin = options.origin
		  }
		},
		onShow() {
			this.getAddressList()
		},
		methods: {
			getAddressList() {
				let that = this
				let params = {
					page: 1,
					size: 10
				}
				interfaceurl.checkAuth(interfaceurl.addressPageList, params, false).then((res) => {
					that.addressList = res.data.data
				});
			},
			// selectAddress(item) {
			// 	if(this.origin == 1){
			// 		return
			// 	}
			// 	uni.setStorageSync('addressItem', item)
			// 	uni.navigateBack({
			// 	  delta: 1
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	page {
		background: #F7F4F8;
	}
	.addresslist {
		border-radius: 15rpx;
		width: 723rpx;
		height: 182rpx;
		background: #FFFFFF;
		margin: 0 auto;
		margin-bottom: 20rpx;
		.left {
			margin-left: 20rpx;
			.name {
				margin-right: 40rpx;
				font-size: 30rpx;
				color: #333333;
				font-weight: bold;
			}
			.default {
				margin-right: 20rpx;
				background:rgba(131,195,249,1);
				border-radius:15rpx;
				color: #FFFFFF;
				width: 70rpx;
				height: 30rpx;
				font-size: 22rpx;
			}
			.address {
				font-size: 30rpx;
				color: #666666;
			}
		}
		.right {
			margin-right: 40rpx;
		}
	}
	.addbtn {
		width: 600rpx;
		height: 80rpx;
		background: #0070D1;
		color: #FFFFFF;
		border-radius: 40rpx;
		position: absolute;
		bottom: 30rpx;
	}
</style>
