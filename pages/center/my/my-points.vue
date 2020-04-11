<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view class="uni-flex uni-row content point">
			<image src="/static/pointbg.png" class="pointbg"></image>
			<view class="uni-flex uni-column">
				<view class="uni-flex horizontally">
					<image :src="userInfo.avatarUrl" class="head"></image>
				</view>
				<view class="uni-flex horizontally nick">{{userInfo.nickName}}</view>
				<view class="uni-flex horizontally num">我的积分：5000</view>
			</view>
		</view>
		<view>
			<view class="uni-flex vertical title">积分明细</view>
			<view class="uni-flex uni-row detail" v-for="(item, index) in list" :key="index">
				<view class="uni-flex">
					<image src="/static/head.png" class="icon"></image>
				</view>
				<view class="uni-flex uni-row rest">
					<view class="uni-flex uni-column rest" style="margin-top: 28rpx;">
						<view class="uni-flex name">江中食疗旗舰店消费500元</view>
						<view class="uni-flex reason">购物消费</view>
						<view class="uni-flex reason">今天  12:15</view>
					</view>
					<view class="uni-flex content jifen">
						+500积分
					</view>
				</view>
			</view>
		</view>
		<view style="margin-bottom: 29rpx;">
			<view class="uni-flex vertical title" style="background: #F7F4F8;">2019年</view>
			<view class="uni-flex uni-row detail" v-for="(item, index) in list" :key="index">
				<view class="uni-flex">
					<image src="/static/head.png" class="icon"></image>
				</view>
				<view class="uni-flex uni-row rest">
					<view class="uni-flex uni-column rest" style="margin-top: 28rpx;">
						<view class="uni-flex name">江中食疗旗舰店消费500元</view>
						<view class="uni-flex reason">购物消费</view>
						<view class="uni-flex reason">今天  12:15</view>
					</view>
					<view class="uni-flex content jifen">
						+500积分
					</view>
				</view>
			</view>
		</view>
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
					background: '#0071CF',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '我的积分' //导航栏文字
				},
				list: [{},{}],
				userInfo: {} //获取用户授权信息
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			
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
	.point {
		width: 711rpx;
		height: 332rpx;
		margin: 0 auto;
		.pointbg {
			width: 100%;
			height: 332rpx;
			position: absolute;
			z-index: -1;
		}
		.head {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
		}
		.nick {
			color: #333333;
			font-size: 30rpx;
		}
		.num {
			color: #333333;
			font-size: 26rpx;
		}
	}
	.title {
		height: 80rpx;
		border-bottom: 1px solid #F2EFF3;
		padding-left: 30rpx;
		background: #FFFFFF;
	}
	.detail {
		height: 180rpx;
		background: #FFFFFF;
		border-bottom: 1px solid #F2EFF3;
		.icon {
			width: 65rpx;
			height: 65rpx;
			border-radius: 50%;
			margin-left: 30rpx;
			margin-right: 16rpx;
			margin-top: 18rpx;
		}
		.name {
			color: #333333;
			font-size: 26rpx;
		}
		.reason {
			font-size: 22rpx;
			color: #999999;
		}
		.jifen {
			color: #0071CF;
			font-size: 36rpx;
			margin-right: 30rpx;
		}
	}
</style>
