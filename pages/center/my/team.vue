<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="uni-flex uni-row title">
			<view class="uni-flex rest content" @click="setType(1)">
				<view class="uni-flex content" :class="{fans: params.type == 1}">一级粉丝</view>
			</view>
			<view class="uni-flex rest content" @click="setType(3)">
				<view class="uni-flex content" :class="{fans: params.type == 3}">二级粉丝</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row info" v-for="(item, index) in teamList" :key="index">
			<view class="uni-flex content rank">
				{{index + 1}}
			</view>
			<view class="uni-flex content">
				<image :src="item.headimgurl" class="head"></image>
			</view>
			<view class="uni-flex uni-column content rest nick">
				{{item.nickname}}
			</view>
			<view class="uni-flex content num">
				{{item.update_time}}
			</view>
		</view>
		<view class="empty-text" v-if="teamList.length == 0">暂无团队数据</view>
		<view class="empty-text" v-if="(teamList.length == teamData.total) && teamList.length > 0">已经到底了</view>
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
					iconText: '我的团队' //导航栏文字
				},
				teamData: {}, //团队数据
				teamList: [], //团队列表
				params: {
					page: 1, //页数
					size: 10, //每页几条
					type: 1 //1:一级用户2:一级会员用户3二级用户4:二级会员用户
				}, //分页参数
			}
		},
		onShow() {
			this.initData()
		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.teamList.length >= this.teamData.total) {
				return;
			}
			this.params.page++;
			this.getTeamList()
		},
		methods: {
			//切换一级和二级粉丝
			setType(type) {
				this.params.type = type
				this.initData()
			},
			initData() {
				//重置分页参数
				this.teamData = {}
				this.teamList = []
				this.params.page = 1
				this.getTeamList()
			},
			//获取一级粉丝和二级粉丝
			getTeamList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.teamPageList, this.params, false).then((res) => {
					that.teamData = res.data
					if(that.params.page == 1) {
						that.teamList = res.data.data
					} else {
						that.teamList = that.teamList.concat(res.data.data)
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
	.title {
		height:100rpx;
		background:rgba(255,255,255,1);
		font-size: 30rpx;
		.base {
			color: #666666;
		}
		.fans {
			height: 100%;
			color: #ff0033;
			border-bottom: 4rpx solid #ff0033;
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
</style>
