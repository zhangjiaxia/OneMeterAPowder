<template>
	<view>
		<view class="uni-flex topitem vertical">
			<image src="/static/bg.png" class="bg"></image>
			<view class="uni-flex uni-row info">
				<view class="uni-flex">
					<image :src="userInfo.avatarUrl || '/static/head.png'" class="head"></image>
				</view>
				<view class="uni-flex uni-column rest">
					<view class="nick">{{userInfo.nickName || '御翔绝瞬'}}</view>
					<view>
						<image src="/static/common.png" class="rate" style="margin-right: 10rpx;"></image>
						<image src="/static/silver.png" class="rate"></image>
					</view>
					<view class="time">会员到期时间：2021-3-16</view>
				</view>
				<!-- <view class="uni-flex vertical" style="margin-right: 60rpx;">
					<image src="/static/back.png" class="arrow"></image>
				</view> -->
			</view>
		</view>
		<authPage>
			<view class="uni-flex uni-row vertical commission">
				<view class="uni-flex uni-column rest" style="margin-left: 50rpx;">
					<view class="price">2000</view>
					<view class="canapply">可提佣金</view>
				</view>
				<view class="uni-flex content apply">
					点击提现
				</view>
			</view>
		</authPage>
		<view class="uni-flex uni-column manage">
			<authPage>
				<view class="uni-flex uni-row vertical order" @click="$turnPage('/pages/shopping/trade/order?status=0', 'navigateTo')">
					<view class="uni-flex rest orderManage">订单管理</view>
					<view class="uni-flex">
						<!-- <image src="/static/backGrey.png" class="back"></image> -->
						<view class="icon-qianjin back"></view>
					</view>
				</view>
			</authPage>
			<authPage>
				<view class="uni-flex uni-row" style="height: 150rpx;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?status=1', 'navigateTo')">
						<image src="/static/waitPay.png" class="icon"></image>
						<view class="title">待支付</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?status=2', 'navigateTo')">
						<image src="/static/waitGoods.png" class="icon"></image>
						<view class="title">待发货</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?status=3', 'navigateTo')">
						<image src="/static/waitGoods.png" class="icon"></image>
						<view class="title">待收货</view>
					</view>
					<view class="uni-flex rest content">
						<image src="/static/afterSale.png" class="icon"></image>
						<view class="title">售后</view>
					</view>
				</view>
			</authPage>
		</view>
		<view class="uni-flex uni-column manage">
			<view class="uni-flex uni-row vertical order">
				<view class="uni-flex rest orderManage">我的服务</view>
			</view>
			<authPage>
				<view class="uni-flex uni-row" style="height: 150rpx;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
						<image src="/static/commission.png" class="icon"></image>
						<view class="title">佣金明细</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/my-points', 'navigateTo')">
						<image src="/static/commission.png" class="icon"></image>
						<view class="title">积分明细</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/cash', 'navigateTo')">
						<image src="/static/withdraw.png" class="icon"></image>
						<view class="title">我要提现</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/income-record', 'navigateTo')">
						<image src="/static/commission.png" class="icon"></image>
						<view class="title">提现明细</view>
					</view>
				</view>
				<view class="uni-flex uni-row" style="margin: 28rpx 0;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
						<image src="/static/team.png" class="icon"></image>
						<view class="title">我的团队</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/address', 'navigateTo')">
						<image src="/static/address.png" class="icon"></image>
						<view class="title">收货地址</view>
					</view>
					<view class="uni-flex rest content">
						<image src="/static/service.png" class="icon"></image>
						<view class="title">联系客服</view>
					</view>
					<view class="uni-flex rest content">
						<image src="/static/about.png" class="icon"></image>
						<view class="title">关于我们</view>
					</view>
				</view>
			</authPage>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			authPage
		},
		computed: mapState(['userInfos']),
		data() {
			return {
				detail: {},
				userInfo: {}
			}
		},
		watch:{
			userInfos(val) {
				//用户的授权信息存本地，全局变量是为了第一次授权时快速响应
				if(val) {
					this.userInfo = uni.getStorageSync('userInfo')
				}
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.userInfo = this.userInfos.nickName ? this.userInfos : uni.getStorageSync('userInfo')
		},
		methods: {
			getUserInfo() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.showDetail, {}, false).then((res) => {
					that.userInfo = res.data
				});
			}
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
	.topitem {
		height: 220rpx;
		position: relative;
		.bg {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
	}
	.info {
		width: 100%;
		view {
			line-height: 1.5;
		}
		.head {
			width: 120rpx;
			height: 120rpx;
			margin-left: 50rpx;
			margin-right: 20rpx;
			border-radius: 50%;
		}
		.rate {
			width: 80rpx;
			height: 30rpx;
		}
		.arrow {
			width: 17rpx;
			height: 26rpx;
		}
		.nick {
			font-size:30rpx;
			color: #FFFFFF;
		}
		.time {
			font-size:20rpx;
			color: #FFFFFF;
		}
	}
	.commission {
		width:100%;
		height:100rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 11px 0px rgba(4,0,0,0.06);
		margin: 20rpx 0;
		view {
			line-height: 1.2;
		}
		.price {
			color: #0071CF;
			font-weight: bold;
			font-size: 36rpx;
		}
		.canapply {
			color: #A9A6A9;
			font-size: 22rpx;
		}
		.apply {
			width:150rpx;
			height:50rpx;
			background:rgba(0,113,207,1);
			border-radius:25rpx;
			color: #FFFFFF;
			margin-right: 30rpx;
		}
	}
	.manage {
		background: #FFFFFF;
		margin-bottom: 20rpx;
		.order {
			border-bottom: 1px solid #F9F7F9;
			height: 80rpx;
			.orderManage {
				font-size: 30rpx;
				color: #333333;
				margin-left: 30rpx;
			}
			.back {
				font-size: 26rpx !important;
				margin-right: 30rpx;
			}
		}
		.title {
			font-size: 24rpx;
			color: #333333;
		}
		.icon {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
