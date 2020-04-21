<template>
	<view class="container">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="record-item" v-for="(item, index) in withdrawList" :key="index">
			<view>
				<view class="record-item-top">
					<view class="icon-qiandaisel record-icon"></view>
					<text>佣金收入</text>
				</view>
				<view class="time">{{item.update_time || ''}}</view>
			</view>
			<view class="num">+{{item.amount}}</view>
		</view>
		<view class="empty-text" v-if="withdrawList.length == 0">暂无数据</view>
		<view class="empty-text" v-if="(withdrawList.length == withdrawData.total) && withdrawList.length > 0">已经到底了</view>
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
					iconText: '提现明细' //导航栏文字
				},
				params: {
					page: 1, //页数
					size: 10, //每页几条
				}, //分页参数
				withdrawData: {}, //提现数据
				withdrawList: [] // 提现列表
			}
		},
		onShow() {
			this.initData()
		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.withdrawList.length >= this.withdrawData.total) {
				return;
			}
			this.params.page++;
			this.getWithdraw()
		},
		methods: {
			initData() {
				//重置分页参数
				this.withdrawData = {}
				this.withdrawList = []
				this.params.page = 1
				this.getWithdraw();
			},
			getWithdraw() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.cashOutRecord, this.params).then((res) => {
					that.withdrawData = res.data;
					if(that.params.page == 1) {
						that.withdrawList = res.data.data
					} else {
						that.withdrawList = that.withdrawList.concat(res.data.data)
					}
				});
			}
		}
	}
</script>

<style>
.record-item{
	background: #ffffff;
	padding: 20upx 30upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.record-item-top{
	display: flex;
	align-items: center;
}
.time{
	margin-top: 10upx;
	color: #999999;
	font-size: 26upx;
}
.record-icon{
	color: #D65E31;
	font-size: 60rpx !important;
	border-radius: 100%;
	margin-right: 20upx;
}
.num{
	font-size: 36upx;
	color: #FF162E;
}
</style>
