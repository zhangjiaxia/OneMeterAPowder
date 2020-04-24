<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="uni-flex uni-row content point">
			<image src="/static/pointbg.png" class="pointbg"></image>
			<view class="uni-flex uni-column">
				<view class="uni-flex horizontally">
					<image :src="userInfo.avatarUrl" class="head"></image>
				</view>
				<view class="uni-flex horizontally nick">{{userInfo.nickName}}</view>
				<view class="uni-flex horizontally num">我的积分：{{total_integral}}</view>
			</view>
		</view>
		<view>
			<view class="uni-flex vertical title">积分明细</view>
			<view class="uni-flex uni-row detail" v-for="(item, index) in pointsList" :key="index">
				<view class="uni-flex">
					<image :src="item.headimgurl" class="icon"></image>
				</view>
				<view class="uni-flex uni-row rest">
					<view class="uni-flex uni-column rest" style="margin-top: 28rpx;">
						<view class="uni-flex name">购物消费{{item.order_price}}元</view>
						<!-- <view class="uni-flex reason">购物消费</view> -->
						<view class="uni-flex reason">{{item.update_time}}</view>
					</view>
					<view class="uni-flex content jifen">
						+{{item.profit}}积分
					</view>
				</view>
			</view>
		</view>
		<view class="empty-text" v-if="pointsList.length == 0">暂无数据</view>
		<view class="empty-text" v-if="(pointsList.length == pointsData.total) && pointsList.length > 0">已经到底了</view>
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
					iconText: '我的积分' //导航栏文字
				},
				params: {
					page: 1, //页数
					size: 10, //每页几条
					type: 2 //1佣金,2积分
				}, //分页参数
				pointsData: {}, //积分数据
				pointsList: [], //积分列表
				userInfo: {}, //获取用户授权信息
				total_integral: 0 //我的积分
			}
		},
		onLoad(options) {
			this.total_integral = options.total_integral
			this.userInfo = uni.getStorageSync('userInfo')
		},
		onShow() {
			this.initData()
		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.pointsList.length >= this.pointsData.total) {
				return;
			}
			this.params.page++;
			this.getPoints()
		},
		methods: {
			initData() {
				//重置分页参数
				this.pointsData = {}
				this.pointsList = []
				this.params.page = 1
				this.getPoints();
			},
			getPoints() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.profitRecord, this.params).then((res) => {
					that.pointsData = res.data;
					if(that.params.page == 1) {
						that.pointsList = res.data.data
					} else {
						that.pointsList = that.pointsList.concat(res.data.data)
					}
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
			color: #ff0033;
			font-size: 36rpx;
			margin-right: 30rpx;
		}
	}
</style>
