<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="layout">
			<view class="uni-flex uni-row vertical address">
				<view class="uni-flex">
					<!-- <image src="/static/location.png" class="location"></image> -->
					<view class="icon-dizhi location"></view>
				</view>
				<view class="uni-flex uni-column rest">
					<view class="uni-flex">
						<view class="uni-flex nick">{{orderDetail.receiver}}</view>
						<view class="uni-flex phone">{{orderDetail.receiverPhone}}</view>
					</view>
					<view class="uni-flex position">{{orderDetail.receiverAreaName}}{{orderDetail.receiverAddr}}</view>
				</view>
				<!-- <view class="uni-flex">
					<view class="icon-qianjin backGrey"></view>
				</view> -->
			</view>
			<view class="order" v-for="(item, index) in orderDetail.cartList" :key="index">
				<view class="uni-flex uni-row orderitem" @click="shopDetailPage(item)">
					<view class="uni-flex">
						<image :src="item.goodsPhotoUrl" class="goodsimg"></image>
					</view>
					<view class="uni-flex uni-column rest goodsinfo">
						<view class="title">{{item.name.substring(0,20) + '...'}}</view>
						<view class="prop">
							<text class="size" v-for="(subItem, i) in item.skuPropertyList" :key="i">{{subItem.val}}</text>
							<!-- <text class="size">100ml*1瓶</text> -->
						</view>
					</view>
					<view class="uni-flex uni-column goodsdata">
						<view class="title">￥{{isVip ? item.vipPrice : item.price}}</view>
						<view class="number">x{{item.quantity}}</view>
					</view>
				</view>
				<view class="uni-flex settle">
					<view class="uni-flex rest horizontalright totaldesc">
						共{{orderCount[index]}}件商品
					</view>
					<view class="uni-flex totalspace">
						<text class="total">合计:</text>
						<text class="totalnum">￥{{isVip ? (item.quantity * item.vipPrice * 100 / 100) : (item.quantity * item.price * 100 / 100)}}</text>
					</view>
				</view>
			</view>
			<view class="uni-flex uni-column ordersettle">
				<view class="uni-flex vertical space" style="border: none;">
					<view class="uni-flex rest subbase">商品总价</view>
					<view class="uni-flex subbase">￥{{orderDetail.orderPrice}}</view>
				</view>
				<view class="uni-flex vertical space">
					<view class="uni-flex rest base">订单总价</view>
					<view class="uni-flex base">￥{{orderDetail.orderPrice}}</view>
				</view>
				<view class="uni-flex vertical space">
					<view class="uni-flex rest base">微信支付</view>
					<view class="uni-flex base" style="color: #FC1E1E;">￥{{orderDetail.payPrice}}</view>
				</view>
				<view class="uni-flex vertical space" style="border: none;margin-bottom: 36rpx;">
					<view class="uni-flex rest base">发票信息</view>
					<view class="uni-flex vertical subbase">
						个人(普通发票)商品明细
						<!-- <image src="/static/center/backGrey.png" class="back"></image> -->
						<view class="icon-qianjin back"></view>
					</view>
				</view>
			</view>
			<view class="uni-flex uni-column orderinfo">
				<view class="uni-flex rest uni-row vertical">
					<view class="uni-flex subbase numberleft">订单号</view>
					<view class="uni-flex rest subbase">{{orderDetail.orderNo}}</view>
					<view class="uni-flex">
						<text class="copy">复制</text>
					</view>
				</view>
				<view class="uni-flex rest uni-row vertical">
					<view class="uni-flex subbase timeleft">下单时间</view>
					<view class="uni-flex rest subbase">{{orderDetail.update_time}}</view>
				</view>
			</view>
		</view>
		<!-- <view class="uni-flex content confirmpay">确认支付</view> -->
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
					iconText: '订单详情' //导航栏文字
				},
				orderDetail: {}, //订单详情
				orderCount: [], //每个订单的商品个数
				isVip: 0 //是否为会员
			}
		},
		onLoad(options) {
			this.getOrderDetail(options.id)
		},
		onShow() {
			this.isVip = uni.getStorageSync('isVip')
		},
		methods: {
			//获取订单详情
			getOrderDetail(id) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.orderDetail, {noId: id}, false).then((res) => {
					that.orderDetail = res.data
					for(var item of that.orderDetail.cartList) {
						that.orderCount.push(item.quantity)
					}
				});
			},
			shopDetailPage(item) {
				console.log('详情', item)
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail?spuId='+item.spuId, 'navigateTo')
			},
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
		padding-top: 20rpx;
		width: 710rpx;
		margin: 0 auto;
	}
	.address {
		width:710rpx;
		height:160rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.08);
		border-radius:15rpx;
		.location {
			color: #ff0033;
			font-size: 66rpx !important;
			margin-left: 40rpx;
			margin-right: 30rpx;
		}
		.backGrey {
			font-size: 25rpx !important;
			margin-right: 30rpx;
		}
		.nick {
			font-size: 32rpx;
			color: #333333;
			margin-right: 30rpx;
		}
		.phone {
			color: #999999;
			font-size: 30rpx;
		}
		.position {
			font-size: 28rpx;
			color: #333333;
		}
	}
	.title {
		font-size: 24rpx;
		color: #333333;
	}
	.order {
		width:710rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 10px 0px rgba(0, 0, 0, 0.08);
		border-radius:15rpx;
		margin-top: 20rpx;
	}
	.orderitem {
		padding-top: 50rpx;
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
	.ordersettle {
		margin: 20rpx 0;
		width:710rpx;
		// height:300rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 10px 0px rgba(0, 0, 0, 0.08);
		border-radius:15rpx;
		.space {
			margin-left: 19rpx;
			margin-right: 29rpx;
			height: 80rpx;
			border-bottom: 1px solid #EEEEEE;
		}
	}
	.base {
		font-size: 30rpx;
		color: #333333;
	}
	.subbase {
		font-size: 24rpx;
		color: #999999;
		.back {
			font-size: 25rpx !important;
			margin-left: 14rpx;
		}
	}
	.orderinfo {
		width:710rpx;
		height:120rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.08);
		border-radius:15rpx;
		margin-bottom: 20rpx;
		.copy {
			margin-right: 30rpx;
			border: 1px dashed #999999;
			color: #999999;
			font-size: 22rpx;
			padding: 0 6rpx;
		}
		.numberleft {
			margin-left: 19rpx;
			margin-right: 79rpx;
		}
		.timeleft {
			margin-left: 19rpx;
			margin-right: 57rpx;
		}
	}
	.confirmpay {
		width:100%;
		height:80rpx;
		background:rgba(0,113,207,1);
		color: #FFFFFF;
		margin-top: 22rpx;
		position: fixed;
		bottom: 0;
	}
</style>
