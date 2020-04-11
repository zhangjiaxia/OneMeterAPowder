<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view class="uni-flex uni-row title">
			<view class="uni-flex rest content">
				<view class="uni-flex content fans">一级粉丝</view>
			</view>
			<view class="uni-flex rest content">二级粉丝</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row info" v-for="(item, index) in teamList" :key="index">
			<view class="uni-flex content rank">
				{{index + 1}}
			</view>
			<view class="uni-flex content">
				<image src="/static/head.png" class="head"></image>
			</view>
			<view class="uni-flex uni-column content rest nick">
				此心水墨
			</view>
			<view class="uni-flex content num">
				2020-10-10
			</view>
		</view>
	</view>
	<!-- <view class="container">
		<view class="recommand-content">
			<view class="recommand-item" v-for="(item,index) in teamList" :key="index">
				<view style="margin-bottom: 10upx;">
					<text class="recommand-title">{{item.nickname || '新用户'}}</text>
				</view>
				<view style="margin-bottom: 10upx;">
					<text>邀请人: {{detail.nickname}}</text>
				</view>
				<view style="margin-bottom: 10upx;">
					<text>{{item.update_time}}</text>
				</view>
			</view>
		</view>
		<view class="empty-text" v-if="teamList.length == 0">暂无团队数据</view>
	</view> -->
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
					background: '#0071CF',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '我的团队' //导航栏文字
				},
				teamList: [{},{},{},{}],
				detail: {}
			}
		},
		onShow() {
			// this.getUserInfo()
			// this.getTeamList()
		},
		methods: {
			getUserInfo() {
				apiUserInfo()
					.then((res) => {
						if (res.code == 0) {
							this.detail = res.data
						}
					})
			},
			getTeamList() {
				apiTeamList()
					.then((res) => {
						if (res.code == 0) {
							this.teamList = res.data
						}
					})
			}
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	.title {
		height:100rpx;
		background:rgba(255,255,255,1);
		font-size: 30rpx;
		.base {
			color: #666666;
		}
		.fans {
			height: 100%;
			color: #0071CF;
			border-bottom: 4rpx solid #0071CF;
		}
	}
	.line {
		background-color: #F7F4F8;
		height: 10rpx;
	}
	.info {
		height:160rpx;
		background:rgba(255,255,255,1);
		border-bottom: 1px solid #E8E5E8;
		.rank {
			font-size: 30rpx;
			color: #333333;
			margin-left: 30rpx;
			margin-right: 62rpx;
		}
		.head {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
		.nick {
			font-size: 30rpx;
			color: #333333;
		}
		.num {
			color: #999999;
			font-size: 24rpx;
			margin-right: 30rpx;
		}
	}
	/* .container {
		background: #F5F5F5;
		padding: 30upx;
	}

	.recommand-content {
		border-radius: 10upx;
	}

	.recommand-item {
		margin-top: 20upx;
		background: #ffffff;
		font-size: 26upx;
		color: #999999;
		padding: 10upx 30upx;
	}

	.recommand-title {
		font-size: 32upx !important;
		color: #333333;
	}

	.recommand-item image {
		width: 60upx;
		height: 60upx;
		border-radius: 100%;
		margin-right: 10upx;
	}

	.amount {
		color: #EB6100;
	} */
</style>
