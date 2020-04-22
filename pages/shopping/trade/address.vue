<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view style="padding-top: 20rpx;">
			<view v-for="(item,index) in addressList" :key="index" class="swipelayout" @click="chooseAddress(item)">
				<uni-swipe-action :options="options" :show="isOpened" :auto-close="true" @click.stop="delAddress(item.addressId)">
					<view class="uni-flex uni-row vertical addresslist">
						<view class="uni-flex uni-column rest left">
							<view>
								<text class="name">{{item.receiver}}</text>
								<text class="name">{{item.receiverPhone}}</text>
							</view>
							<view class="uni-flex vertical">
								<view class="uni-flex content default" v-if="item.isDefault == 1">默认</view>
								<view class="uni-flex address">{{item.receiverAddr}}</view>
							</view>
						</view>
						<view class="uni-flex right address" @click.stop="edit(item)">编辑</view>
					</view>
				</uni-swipe-action>
			</view>
			<view class="empty-text" v-if="(addressList.length == addressData.total) && addressList.length > 0">已经到底了</view>
			<view class="empty-text" v-if="addressList.length == 0">暂无数据</view>
			<view class="uni-flex content">
				<view class="uni-flex content addbtn" @click="turn">新建地址</view>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components:{ uniSwipeAction, navigationBar },
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '收货地址' //导航栏文字
				},
				addressData: {}, //收货地址数据
				addressList: [], //收货列表
				params: {
					page: 1, //页数
					size: 10 //每页几条
				}, //分页参数
				isOpened: false, //是否显示右滑删除
				//右滑删除
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C7C6CD',
						color: '#ffffff',
						borderRadius: '0 10rpx 10rpx 0'
					}
				}]
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.initData()
		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.addressList.length >= this.cartList.total) {
				return;
			}
			this.params.page++;
			this.getAddressList()
		},
		methods: {
			chooseAddress(address) {
				var pages = getCurrentPages();
				var parentPages = pages[pages.length - 2].route //获取上级页面路径
				//如果上级页面是订单结算页面，则实现点击选择某个地址返回上一页面
				if(parentPages === 'pages/shopping/trade/confirm-order') {
					//获取用户选择的某个收货地址，并跳转上一页面
					this.$store.commit('setSelectAddress', address)
					this.$turnPage('1', 'navigateBack')
				}
			},
			turn() {
				let isDefault = this.addressList.length > 0
				this.$turnPage('/pages/shopping/trade/address-add?isDefault='+isDefault, 'navigateTo')
			},
			edit(item) {
				this.$turnPage('/pages/shopping/trade/address-add?item='+JSON.stringify(item), 'navigateTo')
			},
			initData() {
				//重置分页参数
				this.addressData = {}
				this.addressList = []
				this.params.page = 1
				this.getAddressList();
			},
			getAddressList() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.addressPageList, this.params).then((res) => {
					that.addressData = res.data
					if(that.params.page == 1) {
						that.addressList = res.data.data
					} else {
						that.addressList = that.addressList.concat(res.data.data)
					}
				});
			},
			delAddress(addressId) {
				let that = this
				interfaceurl.checkAuth(interfaceurl.addressDelete, { addressId }).then((res) => {
					that.initData()
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
	.uni-swipe_content {
		border-radius: 15rpx;
	}
	.swipelayout {
		width: 723rpx;
		margin: 0 auto;
		margin-bottom: 20rpx;
	}
	.addresslist {
		border-radius: 15rpx;
		width: 723rpx;
		height: 182rpx;
		background: #FFFFFF;
		.left {
			margin-left: 20rpx;
			.name {
				margin-right: 40rpx;
				font-size: 30rpx;
				color: #333333;
				font-weight: bold;
			}
			.default {
				margin-right: 20rpx;
				background:#ff0033;
				border-radius:15rpx;
				color: #FFFFFF;
				width: 70rpx;
				height: 30rpx;
				font-size: 22rpx;
			}
			.address {
				font-size: 30rpx;
				color: #666666;
			}
		}
		.right {
			margin-right: 40rpx;
		}
	}
	.addbtn {
		width: 600rpx;
		height: 80rpx;
		background: #ff0033;
		color: #FFFFFF;
		border-radius: 40rpx;
		position: absolute;
		bottom: 30rpx;
	}
</style>
