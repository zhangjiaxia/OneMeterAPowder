<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<image src="/static/chartbg.png" class="chartbg"></image>
		<view class="layout">
			<view class="uni-flex uni-column vertical topitem">
				<view class="uni-flex uni-row vertical info" style="margin: 16rpx 0;">
					<view class="uni-flex">
						<image :src="userInfo.avatarUrl" class="head"></image>
					</view>
					<view class="uni-flex uni-column rest">
						<view class="nick">{{userInfo.nickName}}</view>
						<view class="nick">ID:{{userDetail.invitation_code || ''}}</view>
					</view>
					<view class="uni-flex uni-column rest content desc">
						<view>法律保障协议</view>
					</view>
				</view>
				<view class="remark">升级成为合伙人，共享平台发展红利</view>
			</view>
		</view>
		<view class="uni-flex uni-row content">
			<image src="/static/chart.png" class="chartimg"></image>
		</view>
		<view class="layout" style="padding-top: 0rpx;">
			<view class="uni-flex uni-column bottom-item">
				<image src="/static/oldbg.png" class="oldimg"></image>
				<view class="uni-flex content title">原始股权用户福利</view>
				<view class="uni-flex uni-row vertical bar">
					<view class="uni-flex content num">
						<text>1</text>
					</view>
					<view class="uni-flex">
						<text class="base">200人共享</text> <text class="active">10%</text> 
						<text class="base">原始股权</text>
					</view>
				</view>
				<view class="uni-flex uni-row vertical bar">
					<view class="uni-flex content num">
						<text>2</text>
					</view>
					<view class="uni-flex">
						<text class="base">小投入</text> <text class="active">大回报</text> 
						<text class="base">享原始股权红利</text>
					</view>
				</view>
				<view class="uni-flex uni-row vertical bar">
					<view class="uni-flex content num">
						<text>3</text>
					</view>
					<view class="uni-flex">
						<text class="base">平台将利润回馈用户</text> 
						<text class="active">共创财富</text>
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
					iconText: '原始股权' //导航栏文字
				},
				teamList: [],
				userDetail: {}, //获取用户详情
				userInfo: {} //获取用户授权信息
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
			this.getUserDetail()
		},
		onShow() {
		 
		},
		methods: {
			//获取用户详情
			getUserDetail() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
					that.userDetail = res.data
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
		background: #EFF1F2;
	}
	.chartimg {
		width: 729rpx;
		height: 443rpx;
	}
	.chartbg {
		width: 750rpx;
		height: 289rpx;
		position: absolute;
		z-index: -1;
	}
	.layout {
		margin: 0 auto;
		width: 687rpx;
		padding-top: 40rpx;
		.topitem {
			height: 260rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
		}
		.info {
			width: 100%;
			height: 100%;
			color: #333333;
			view {
				line-height: 1.5;
			}
			.head {
				width: 118rpx;
				height: 118rpx;
				margin-left: 50rpx;
				margin-right: 20rpx;
				border-radius: 50%;
			}
			.nick {
				font-size:32rpx;
			}
			.desc {
				width: 260rpx;
				height: 80rpx;
				color: #FFFFFF;
				background:linear-gradient(90deg,#FC7322,#FFA01A);
				margin-right: 30rpx;
				border-radius: 80rpx;
			}
		}
		.remark {
			font-size: 30rpx;
			color: #5873E4;
			margin-left: 40rpx;
			margin-bottom: 10rpx;
		}
		.place {
			margin: 22rpx auto;
			width:690rpx;
			height:100rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px 4rpx 9rpx 0px rgba(185,214,243,0.23);
			border-radius:15rpx;
			.rank {
				color: #333333;
				font-size: 36rpx;
				font-weight:bolder;
				margin-left: 30rpx;
			}
			.ranking {
				font-size: 40rpx;
				color: #ff0033;
				font-weight:bolder;
				margin-right: 30rpx;
			}
		}
	}
	.oldimg {
		width: 686rpx;
		height: 550rpx;
		position: absolute;
		z-index: -1;
	}
	.bottom-item {
		font-size: 34rpx;
		.title {
			font-size:38rpx;
			color: #FFFFFF;
			margin-top: 30rpx;
			margin-bottom: 34rpx;
		}
		.bar {
			width:640rpx;
			height:120rpx;
			background:rgba(255,255,255,1);
			border-radius:8rpx;
			margin: 0 auto;
			margin-bottom: 20rpx;
			.num {
				width:80rpx;
				height:80rpx;
				border-radius: 50%;
				background:linear-gradient(135deg,#FFADAF,#FF5055);
				margin-left: 30rpx;
				margin-right: 44rpx;
				text {
					color: #FFFFFF;
					font-size: 42rpx;
					font-weight: bold;
					box-shadow:0px 4px 22px 0px rgba(114,114,114,0.3);
				}
			}
			.base {
				color: #333333;
			}
			.active {
				color: #F86826;
			}
		}
	}
</style>
