<template>
	<view class="">
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view class="uni-flex uni-row verticalbottom today">
			<view class="uni-flex uni-row space">
				<view class="uni-flex rest">
					<text class="key">今日获得佣金:</text>
					<text class="val">58</text>
				</view>
				<view class="uni-flex">
					<view class="key">总共获得佣金:</view>
					<view class="val">5800</view>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row info" v-for="(item, index) in pointsList" :key="index">
			<view class="uni-flex content rank">
				{{index + 1}}
			</view>
			<view class="uni-flex content">
				<image src="/static/head.png" class="head"></image>
			</view>
			<view class="uni-flex uni-column content rest">
				<view class="uni-flex uni-column" style="margin-left: -100rpx;">
					<view class="nick">
						此心水墨
						<text class="date">(一级粉丝)</text>
					</view>
					<view class="date">2020-10-10 12:12:12</view>
				</view>
			</view>
			<view class="uni-flex content num">
				+58佣金
			</view>
		</view>
		<view class="empty-text" v-if="pointsList.length == 0">暂无数据</view>
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
					iconText: '佣金明细' //导航栏文字
				},
				params: {
					page: 1, //页数
					size: 10, //每页几条
					type: 2 //1佣金,2积分
				}, //分页参数
				pointsData: {}, //积分数据
				pointsList: [], //积分列表
			}
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
	.today {
		height: 80rpx;
		background: #F6F6F6;
		padding: 0 30rpx;
		.space {
			margin-bottom: 10rpx;
			width: 100%;
			.key {
				color: #666666;
				font-size: 24rpx;
			}
			.val {
				color: #0071CF;
				font-size: 24rpx;
			}
		}
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
			font-size: 24rpx;
			color: #333333;
		}
		.date {
			color: #999999;
			font-size: 24rpx;
		}
		.num {
			color: #0071CF;
			font-size: 30rpx;
			margin-right: 30rpx;
		}
	}
</style>
