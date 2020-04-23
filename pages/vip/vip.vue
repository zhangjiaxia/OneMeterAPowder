<template>
	<view class="">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle" :showBack="false"></navigationBar>
		</view>
		<view class="uni-flex topitem vertical">
			<image src="/static/bg.png" class="bg"></image>
			<authPage>
				<view class="uni-flex uni-row info">
					<view class="uni-flex">
						<image :src="userInfo.avatarUrl || '/static/head.png'" class="head"></image>
					</view>
					<view class="uni-flex uni-column rest">
						<view class="nick">
							{{userInfo.nickName || '御翔绝瞬'}}
							<image src="/static/VIPicon.png" class="gold" v-if="userDetail.is_vip==1"></image>
							<image src="/static/goldactive.png" class="gold" v-if="userDetail.grade==3"></image>
						</view>
						<view @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
							<text style="color: #FFFFFF;">{{userDetail.gradeName}}</text>
							<!-- <image src="/static/silver.png" class="rate" v-if="userDetail.is_vip==1"></image>
							<image src="/static/coconel.png" class="rate" v-else></image> -->
						</view>
						<view class="idnumber">ID:{{userDetail.invitation_code || ''}}</view>
						<view class="time" v-if="userDetail.is_vip==1">VIP会员到期时间：{{userDetail.vip_valid_date || ''}}</view>
					</view>
				</view>
			</authPage>
		</view>
		<view class="uni-flex uni-row vertical commission">
			<view class="uni-flex uni-column rest content" @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
				<view class="money">我的佣金</view>
				<view class="money">{{userDetail.total_profit || 0}}</view>
				<view class="tip">
					（已到帐金额:<text class="active">{{userDetail.cash_out_profit || 0}}元</text>）
				</view>
			</view>
			<view class="uni-flex">
				<view class="line"></view>
			</view>
			<view class="uni-flex uni-column rest content" @click="$turnPage('/pages/center/my/cash', 'navigateTo')">
				<view class="money">待提现</view>
				<view class="money">{{userDetail.frozen_profit}}</view>
				<view class="tip">（提现中:<text class="active">{{userDetail.frozen_profit || 0}}元</text>）</view>
			</view>
		</view>
		<view class="uni-flex uni-column commissiondetail">
			<view class="uni-flex uni-row rest vertical" style="border-bottom: 1px solid #EEEEEE;">
				<view class="uni-flex rest content vline" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
					<view class="title">一级粉丝</view>
					<view class="number">
						<text class="active">{{userNumber.firstUserNumber || 0}}</text>人
					</view>
				</view>
				<view class="uni-flex rest content vline" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
					<view class="title">一级VIP会员</view>
					<view class="number">
						<text class="active">{{userNumber.firstVipNumber || 0}}</text>人
					</view>
				</view>
				<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
					<view class="title">佣金收益</view>
					<view class="number">
						<text class="active">{{userDetail.first_profit || 0}}</text>元
					</view>
				</view>
			</view>
			<view class="uni-flex uni-row rest vertical">
				<view class="uni-flex rest content vline" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
					<view class="title">二级粉丝</view>
					<view class="number">
						<text class="active">{{userNumber.secondUserNumber || 0}}</text>人
					</view>
				</view>
				<view class="uni-flex rest content vline" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
					<view class="title">二级VIP会员</view>
					<view class="number">
						<text class="active">{{userNumber.secondVipNumber || 0}}</text>人
					</view>
				</view>
				<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
					<view class="title">佣金收益</view>
					<view class="number">
						<text class="active">{{userDetail.second_profit || 0}}</text>元
					</view>
				</view>
			</view>
		</view>
		<view class="ranking">
			<view class="uni-flex vertical rank">
				佣金排名
			</view>
			<view class="empty-text" v-if="rankList.length == 0">暂无佣金排名数据</view>
			<view class="ranklist" v-else>
				<view class="uni-flex uni-row vertical item" :style="{'border-bottom': index == rankList.length - 1 ? 'none' : '1px solid #EEEEEE'}"
					v-for="(item, index) in rankList" :key="index" v-if="item.nickname">
					<view class="uni-flex uni-column content" style="width: 140rpx;">
						<view class="num">{{item.rankingNumber}}</view>
						<view class="me">{{index == 0 ? '我的排名' : '排名'}}</view>
					</view>
					<view class="uni-flex rest vertical">
						<image :src="item.headimgurl" class="head"></image>
						<text class="nick">{{item.nickname}}</text>
					</view>
					<view class="uni-flex vertical" style="margin-right: 19rpx;">
						<text class="money active">{{item.total_profit || 0}}</text>
						<text class="mum">佣金</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			authPage,
			navigationBar
		},
		computed: mapState(['userInfos']),
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: 'VIP' //导航栏文字
				},
				rankList: [], //佣金排名
				userInfo: {}, //获取用户信息
				userDetail: {}, //获取用户详情
				userNumber: {} //获取用户的粉丝和会员人数
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
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			if(uni.getStorageSync('token')) {
				this.getUserDetail();
				this.getUserNumber();
				this.getRanking()
			}
		},
		methods: {
			//获取用户详情
			getUserDetail() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
					that.userDetail = res.data
				});
			},
			//获取用户的粉丝和会员人数
			getUserNumber() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.surveyList, {}).then((res) => {
					that.userNumber = res.data
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
		background: #F6F6F6;
	}
	.active {
		color: #ff0033;
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
			width: 60rpx;
			height: 30rpx;
		}
		.arrow {
			width: 17rpx;
			height: 26rpx;
		}
		.nick {
			font-size:30rpx;
			color: #FFFFFF;
			.vip {
				width: 56rpx;
				height: 25rpx;
				margin-left: 20rpx;
			}
			.gold {
				width: 40rpx;
				height: 31rpx;
				margin-left: 16rpx;
			}
		}
		.idnumber {
			font-size: 20rpx;
			color: #FFFFFF;
		}
		.time {
			font-size:20rpx;
			color: #FFFFFF;
		}
	}
	.commission {
		margin: 20rpx auto;
		width:730rpx;
		height:160rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 1px 6rpx 0px rgba(116,114,114,0.13);
		border-radius:20rpx;
		color: #333333;
		view {
			line-height: 1.3;
		}
		.line {
			width:2rpx;
			height:80rpx;
			background:rgba(51,51,51,1);
		}
		.money {
			font-size: 30rpx;
		}
		.tip {
			font-size: 20rpx;
		}
	}
	.commissiondetail {
		width:730rpx;
		height:250rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2rpx 12rpx 0px rgba(116,114,114,0.2);
		border-radius:20rpx;
		margin: 0 auto;
		.vline {
			height: 100%;
			border-right: 1px solid #EEEEEE;
		}
	}
	.ranking {
		width:730rpx;
		background:rgba(255,255,255,1);
		border-radius:20rpx;
		margin: 0 auto;
		margin-top: 28rpx;
		margin-bottom: 47rpx;
		.rank {
			height:100rpx;
			border-bottom: 1px solid #EEEEEE;
			margin-left: 20rpx;
			.title {
				font-size: 28rpx;
				color: #333333;
			}
		}
		.ranklist {
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
