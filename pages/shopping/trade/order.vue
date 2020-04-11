<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view class="layout">
			<view class="uni-flex vertical searchbar">
				<view class="uni-flex">
					<view class="icon-search search"></view>
				</view>
				<view class="uni-flex searchorder">搜索订单</view>
			</view>
			<view class="uni-flex uni-row" style="margin: 28rpx 0;">
				<view class="uni-flex rest content" @click="selectTab(index, item.val)" v-for="(item, index) in tabList" :key="index">
					<text :class="{active: tabIndex == index}">{{item.text}}</text>
				</view>
			</view>
			<view class="order" v-for="(item, index) in orderPageList" :key="index" 
				@click="$turnPage('/pages/shopping/trade/order-detail?id='+item.orderId, 'navigateTo')">
				<view class="uni-flex uni-row time">
					<view class="uni-flex rest date">
						{{item.confirmTime}}
					</view>
					<view class="uni-flex tip">
						{{item.orderStatusName}}
					</view>
				</view>
				<view class="uni-flex uni-row orderitem" v-for="(subItem, i) in item.skuList" :key="i">
					<view class="uni-flex">
						<image :src="subItem.goodsPhotoUrl" class="goodsimg"></image>
					</view>
					<view class="uni-flex uni-column rest goodsinfo">
						<view class="title">{{subItem.prodName.substring(0,20) + '...'}}</view>
						<view class="prop">
							<text class="size" v-for="(thirdItem, x) in subItem.skuDetail.skuPropertyList" :key="x">{{thirdItem.val}}</text>
							<!-- <text class="size">100ml*1瓶</text> -->
						</view>
					</view>
					<view class="uni-flex uni-column goodsdata">
						<view class="title">￥{{subItem.price}}</view>
						<view class="horizontalright number">x{{subItem.quantity}}</view>
					</view>
				</view>
				<view class="uni-flex settle">
					<view class="uni-flex rest horizontalright totaldesc">
						共{{orderCount[index]}}件商品
					</view>
					<view class="uni-flex totalspace">
						<text class="total">合计:</text>
						<text class="totalnum">￥{{item.payAmount}}</text>
					</view>
				</view>
				<view class="uni-flex vertical btnop" v-if="item.orderStatus === 20">
					<view class="uni-flex rest horizontalright">
						<view class="btnleft content">提醒发货</view>
					</view>
					<view class="uni-flex">
						<view class="btnright content">查看订单</view>
					</view>
				</view>
				<view class="uni-flex vertical btnop" v-if="item.orderStatus === 30">
					<view class="uni-flex rest horizontalright">
						<view class="btnleft content">查看物流</view>
					</view>
					<view class="uni-flex">
						<view class="btnright content">确认收货</view>
					</view>
				</view>
				<view class="uni-flex vertical btnop" v-if="item.orderStatus === 70 || item.orderStatus === 80">
					<view class="uni-flex rest horizontalright">
						<view class="btnleft content">查看订单</view>
					</view>
					<view class="uni-flex">
						<view class="btnright content">取消售后</view>
					</view>
				</view>
				<view class="uni-flex vertical btnop" v-if="item.orderStatus === 40">
					<view class="uni-flex rest horizontalright">
						<view class="btnleft content">删除订单</view>
					</view>
					<view class="uni-flex">
						<view class="btnright content">查看订单</view>
					</view>
				</view>
			</view>
			<view class="uni-flex uni-row horizontally vertical notice">
				<view class="line"></view>
				<text class="space">已经没有了哦</text>
				<view class="line"></view>
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
					background: '#0071CF',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '我的订单' //导航栏文字
				},
				tabIndex: 0, //订单状态索引
				tabList: [{
					text: '全部',
					val: ''
				},{
					text: '待发货',
					val: '20'
				},{
					text: '待收货',
					val: '30'
				},{
					text: '售后',
					val: '70,80'
				},{
					text: '已完成',
					val: '40'
				}],
				params: {
					page: 1, //页数
					size: 3, //每页几条
					status: ''
				}, //分页参数
				orderPageData: {}, //订单数据
				orderPageList: [], //订单列表
				orderCount: [] //每个订单的商品个数
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.initData()
		},
		onReachBottom() {
			if (this.orderPageList.length >= this.orderPageData.total) {
				return
			}
			this.params.page++;
			this.getOrderPageList()
		},
		methods: {
			initData() {
				//重置分页参数
				this.orderPageData = {}
				this.orderPageList = []
				this.params.page = 1
				this.getOrderPageList();
			},
			getOrderPageList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.orderPageList, this.params).then((res) => {
					that.orderPageData = res.data
					if(that.params.page == 1) {
						that.orderPageList = res.data.data
					} else {
						that.orderPageList = that.orderPageList.concat(res.data.data)
					}
					that.orderCount = []
					let num = 0;
					for(var item of that.orderPageList) {
						for(var subItem of item.skuList) {
							num += subItem.quantity
						}
						that.orderCount.push(num)
						num = 0;
					}
				});
			},
			selectTab(index, status) {
				this.tabIndex = index
				this.params.status = status
				this.initData();
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
	.layout {
		margin: 0 auto;
		width: 700rpx;
		padding-top: 20rpx;
	}
	.notice {
		color: #999999;
		margin-top: 30rpx;

		.line {
			width: 50rpx;
			height: 4rpx;
			background: #999999;
		}

		.space {
			margin: 0 10rpx;
		}
	}
	.active {
		color: #0071CF;
		border-bottom: 1px solid #0071CF;
	}
	.searchbar {
		// margin-top: 20rpx;
		width: 100%;
		height: 70rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 3px 0px rgba(255, 255, 255, 0.2);
		border-radius: 35rpx;
		.search {
			font-size: 28rpx;
			margin-left: 41rpx;
			margin-right: 15rpx;
		}
		.searchorder {
			font-size: 24rpx;
			color: #AAAAAA;
		}
	}
	.order {
		width: 710rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.08);
		border-radius: 15rpx;
		margin-top: 20rpx;
		padding-bottom: 24rpx;
	}
	.time {
		padding: 20rpx;
		font-size: 24rpx;

		.date {
			color: #999999;
		}

		.tip {
			color: #1275BE;
		}
	}
	.orderitem {
		// padding-top: 50rpx;
		margin-bottom: 27rpx;
		.goodsimg {
			width: 159rpx;
			height: 159rpx;
			margin-left: 20rpx;
			margin-right: 30rpx;
		}
		.goodsinfo {
			.prop {
				background: #F3F0F3;
				.size {
					color: #A09DA1;
					margin-right: 10rpx;
					padding: 6rpx;
					display: inline-flex;
					margin-bottom: 10rpx;
					font-size: 23rpx;
					border-radius: 6rpx;
				}
			}
		}
		.goodsdata {
			margin-left: 40rpx;
			margin-right: 30rpx;
			.number {
				color: #999999;
				font-size: 20rpx;
				text-align: right;
			}
		}
	}
	.settle {
		font-size: 24rpx;

		.totaldesc {
			color: #999999;
		}
		.totalspace {
			margin-left: 10px;
			margin-right: 20px;
			margin-bottom: 40rpx;
			.total {
				color: #333333;
			}
			.totalnum {
				color: #FF0808;
			}
		}
	}
	.btnop {
		font-size: 26rpx;
		.btnleft {
			width: 164rpx;
			height: 55rpx;
			color: #868387;
			border: 1px solid #EBE8EB;
			border-radius: 40rpx;
		}
		.btnright {
			width: 160rpx;
			height: 50rpx;
			color: #FFFFFF;
			background: #0171D2;
			border-radius: 40rpx;
			margin-left: 16rpx;
			margin-right: 25rpx;
		}
	}
</style>
