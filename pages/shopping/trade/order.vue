<template>
	<view class="layout">
		<view class="uni-flex vertical searchbar">
			<view class="uni-flex">
				<image src="/static/search.png" class="search"></image>
			</view>
			<view class="uni-flex searchorder">搜索订单</view>
		</view>
		<view class="uni-flex uni-row" style="margin: 28rpx 0;">
			<view class="uni-flex rest content">
				<text class="active">全部</text>
			</view>
			<view class="uni-flex rest content">
				<text>待发货</text>
			</view>
			<view class="uni-flex rest content">
				<text>待收货</text>
			</view>
			<view class="uni-flex rest content">
				<text>售后</text>
			</view>
			<view class="uni-flex rest content">
				<text>已完成</text>
			</view>
		</view>
		<view class="order" v-for="(item, index) in orderPageList.data" :key="index" @click="$turnPage('/pages/shopping/trade/order-detail?id='+item.orderId, 'navigateTo')">
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
			<view class="uni-flex vertical btnop" v-if="item.orderStatus === 50">
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
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				tabIndex: 0,
				tabList: ['全部', '待支付', '待发货', '待收货', '售后'],
				status: 0,
				orderList: [],
				total: 0,
				currentPage: 1,
				pageSize: 20,
				//动态参数
				orderPageList: {}, //订单列表数据
				orderCount: [] //每个订单的商品个数
			}
		},
		onLoad(options) {
			// this.tabIndex = options.status
			// this.getOrderList(1)
		},
		onShow() {
			this.getOrderPageList()
		},
		onReachBottom() {
			if (this.orderList.length >= this.total) {
				return
			}
			this.currentPage++
			this.getOrderList(2)
		},
		methods: {
			getOrderPageList() {
				let that = this;
				let orderParams = {
					page: 1,
					size: 10,
					status: 0
				}
				interfaceurl.checkAuth(interfaceurl.orderPageList, orderParams).then((res) => {
					that.orderPageList = res.data
					that.orderCount = []
					let num = 0;
					for(var item of that.orderPageList.data) {
						for(var subItem of item.skuList) {
							num += subItem.quantity
						}
						that.orderCount.push(num)
						num = 0;
					}
					//console.log(that.orderCount)
				});
			},
			selectTab(index) {
				this.tabIndex = index
				this.getOrderList(1)
			},
			getOrderList(type) {
				let params = {
					page: this.currentPage,
					size: this.pageSize
				}
				const status = this.tabIndex - 1
				if (status >= 0) {
					params.status = status
				} else {
					params.status = ''
				}
				apiOrderList(params)
					.then((res) => {
						if (res.code == 0) {
							this.total = res.data.total
							if (type == 1) {
								this.orderList = res.data.data
							} else {
								this.orderList = this.orderList.concat(res.data.data)
							}
							console.log(this.orderList)
							this.orderList.forEach((item) => {
								let totalNum = 0
								item.goods_cart.forEach((content) => {
									totalNum = totalNum + content.buy_number
								})
								item.totalNum = totalNum
							})
						}
					})
			},
			shopDetailPage(item) {
				if (item.status !== 0) {
					return
				}
				let shopList = []
				item.goods_cart.forEach((item) => {
					const shopItem = {
						goods_id: item.goods_id,
						goods_price: item.goods_price,
						goods_name: item.goods_name,
						goods_cover_img: item.goods_cover_img,
						shopNum: item.buy_number,
						cart_id: item.cart_id,
						is_cash_back: item.is_cash_back || '0'
					}
					shopList.push(shopItem)
				})
				uni.setStorageSync('shopList', shopList)
				uni.navigateTo({
					url: '/pages/confirm-order/confirm-order'
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
	.layout {
		margin: 0 auto;
		width: 700rpx;
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
		margin-top: 20rpx;
		width: 100%;
		height: 70rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2px 3px 0px rgba(255, 255, 255, 0.2);
		border-radius: 35rpx;
		.search {
			width: 28rpx;
			height: 28rpx;
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
				.size {
					background: #F3F0F3;
					color: #A09DA1;
					margin-right: 10rpx;
					padding: 6rpx;
					display: inline-flex;
					margin-bottom: 10rpx;
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
