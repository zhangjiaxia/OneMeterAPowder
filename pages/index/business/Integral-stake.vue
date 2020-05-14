<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<image src="/static/stakeimg.png" class="chartbg"></image>
		<view class="layout" style="padding-top: 40rpx;">
			<view class="uni-flex uni-column vertical topitem">
				<view class="uni-flex uni-row vertical info" style="margin: 16rpx 0;">
					<view class="uni-flex">
						<image :src="userInfo.avatarUrl" class="head"></image>
					</view>
					<view class="uni-flex uni-column rest">
						<view class="nick">{{userInfo.nickName}}</view>
						<view class="nick">
							我的积分:<text style="color: #EC524A;">{{userDetail.total_integral || ''}}</text>分
						</view>
					</view>
				</view>
				<view class="uni-flex uni-row" style="width: 100%;margin-bottom: 24rpx;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
						<view class="desc content">团队成员明细</view>
					</view>
					<view class="uni-flex rest content">
						<view class="desc content">团队积分明细</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row content">
			<image src="/static/chart.png" class="chartimg"></image>
		</view>
		<view class="layout">
			<view class="uni-flex uni-column defined">
				<view class="uni-flex key">积分定义</view>
				<view class="uni-flex val">
					指的是用户本身+用户自身邀请的粉丝（含一、二级粉丝）在本平台消费金额的总和，按1:1的比例转换的积分。
				</view>
			</view>
			<view class="uni-flex uni-column defined">
				<view class="uni-flex key">积分权益</view>
				<view class="uni-flex val">
					积分达1000分以上的用户有资格分享公司上市时增发的20%（暂定）股票，获得股份的具体数量以用户的积分为准，按比例分配。
				</view>
			</view>
			<view>
				<view class="uni-flex uni-row rankbar">
					<view class="uni-flex rest content" style="background: #A8C0F0;">我的积分排名</view>
					<view class="uni-flex rest content" style="background: linear-gradient(90deg,#FC7322,#FFA01A);">平台用户积分排行榜</view>
				</view>
				<view class="empty-text" v-if="rankList.length == 0">暂无佣金排名数据</view>
				<view class="ranklist" v-else>
					<view class="uni-flex uni-row vertical item" :style="{'border-bottom': index == rankList.length - 1 ? 'none' : '1px solid #EEEEEE'}"
						v-for="(item, index) in rankList" :key="index" v-if="item.nickname">
						<view class="uni-flex uni-column content" style="width: 140rpx;">
							<view v-if="index < 3">
								<image :src="'/static/school/rank' + index + '.png'" style="width: 76rpx;height: 56rpx;"></image>
							</view>
							<view class="num" v-else>{{item.rankingNumber}}</view>
						</view>
						<view class="uni-flex rest vertical">
							<image :src="item.headimgurl" class="head"></image>
							<text class="nick">{{item.nickname}}</text>
						</view>
						<view class="uni-flex vertical" style="margin-right: 19rpx;">
							<image src="/static/school/star.png" style="width: 40rpx;height: 40rpx;"></image>
						</view>
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
					iconText: '积分股权' //导航栏文字
				},
				teamList: [],
				userDetail: {}, //获取用户详情
				userInfo: {}, //获取用户授权信息
				rankList: [] //佣金排名
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow() {
			this.getUserDetail()
			this.getRanking()
		},
		methods: {
			//获取用户详情
			getUserDetail() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
					that.userDetail = res.data
				});
			},
			//获取排名列表
			getRanking() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.teamRankingList, {}).then((res) => {
					that.rankList = res.data
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
		background: #EFEFEF;
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
		.topitem {
			height: 270rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			.desc {
				width: 300rpx;
				height: 80rpx;
				color: #FFFFFF;
				background:linear-gradient(90deg,#FC7322,#FFA01A);
				border-radius: 80rpx;
			}
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
		}
		.defined {
			.key {
				color: #313131;
				font-size: 35rpx;
				margin-left: 33rpx;
				margin-bottom: 22rpx;
			}
			.val {
				color: #333333;
				font-size: 29rpx;
				font-weight: lighter;
				background: #FFFFFF;
				padding: 30rpx;
				padding-top: 20rpx;
				margin-bottom: 57rpx;
			}
		}
		.rankbar {
			height: 82rpx;
			color: #FFFFFF;
			font-size: 32rpx;
		}
		.ranklist {
			background: #FFFFFF;
			.item {
				height: 120rpx;
				border-bottom: 1px solid #EEEEEE;
				.num {
					font-size: 30rpx;
					color: #333333;
				}
				.me {
					font-size: 28rpx;
					color: #999999;
				}
				.head {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-left: 50rpx;
				}
				.nick {
					color: #333333;
					font-size: 24rpx;
					margin-left: 30rpx;
				}
				.money {
					font-size: 24rpx;
					color: #ff0033;
				}
			}
		}
	}
</style>
