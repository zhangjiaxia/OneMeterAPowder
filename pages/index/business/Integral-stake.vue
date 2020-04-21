<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="layout">
			<view class="uni-flex uni-column vertical topitem">
				<image src="/static/chartbg.png" class="chartbg"></image>
				<view class="uni-flex uni-row vertical info" style="margin: 16rpx 0;">
					<view class="uni-flex">
						<image :src="userInfo.avatarUrl" class="head"></image>
					</view>
					<view class="uni-flex uni-column rest">
						<view class="nick">{{userInfo.nickName}}</view>
						<view class="nick">我的积分:5000分</view>
					</view>
				</view>
				<view class="uni-flex uni-row info">
					<view class="uni-flex uni-column rest content" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
						<view class="desc">团队成员</view>
						<view class="desc">明细</view>
					</view>
					<view class="uni-flex content">|</view>
					<view class="uni-flex uni-column rest content" @click="$turnPage('/pages/center/my/my-points', 'navigateTo')">
						<view class="desc">团队积分</view>
						<view class="desc">明细</view>
					</view>
				</view>
			</view>
			<!-- <view class="remark">PS：达到50个配送原始股，终生有效!</view> -->
			<view class="uni-flex uni-row vertical place">
				<view class="uni-flex rest rank">我的排名</view>
				<view class="uni-flex ranking">
					2316名
					<!-- <image src="" class=""></image> -->
				</view>
			</view>
			<view class="chart">
				<view class="charttitle">市值曲线图</view>
				<view>
					<image src="/static/chart.png" class="chartimg"></image>
				</view>
			</view>
			<view class="uni-flex uni-row description">
				<view class="uni-flex" style="margin-right: 10rpx;">
					<text class="star">*</text>
					<text class="define">积分定义：</text>
				</view>
				<view class="uni-flex rest">
					<text class="define">指的是用户本身+用户自身邀请的粉丝（含一、二级粉丝）在本平台消费金额的总和，按100:1的比例转换的积分。</text>
				</view>
			</view>
			<view class="uni-flex uni-row description">
				<view class="uni-flex" style="margin-right: 10rpx;">
					<text class="star">*</text>
					<text class="define">积分权益：</text>
				</view>
				<view class="uni-flex rest">
					<text class="define">积分达1000分以上的用户有资格分享公司上市时增发的20%（暂定）股票，获得股份的具体数量以用户的积分为准，按比例分配。</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '积分股权' //导航栏文字
				},
				teamList: [],
				detail: {},
				userInfo: {} //获取用户授权信息
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow() {
		 
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
		background: #EFEFEF;
	}
	.layout {
		margin: 0 auto;
		width: 707rpx;
		padding-top: 16rpx;
		.topitem {
			height: 287rpx;
		}
		.chartbg {
			width: 707rpx;
			height: 287rpx;
			position: absolute;
			z-index: -1;
		}
		.info {
			width: 100%;
			color: #FFFFFF;
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
			.nick {
				font-size:30rpx;
				
			}
			.desc {
				border-bottom: 1px solid #FFFFFF;
			}
		}
		.remark {
			font-size: 22rpx;
			color: #0684ED;
			margin-left: 40rpx;
		}
		.place {
			margin-top: 12rpx;
			margin-bottom: 20rpx;
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
				color: #FF162E;
				font-weight:bolder;
				margin-right: 30rpx;
			}
		}
		.chart {
			width:690rpx;
			height:400rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px 4rpx 9rpx 0px rgba(185,214,243,0.23);
			border-radius:15rpx;
			.charttitle {
				font-size: 30rpx;
				color: #333333;
				margin-left: 30rpx;
				margin-bottom: 6rpx;
			}
			.chartimg {
				width: 650rpx;
				height: 330rpx;
				margin-left: 20rpx;
				// border: 1px dashed;
			}
		}
		.description {
			margin-top: 24rpx;
			width: 666rpx;
			.star {
				color: #FF0000;
				font-size: 30rpx;
			}
			.define {
				color: #AAAAAA;
				font-size: 24rpx;
			}
		}
	}
</style>
