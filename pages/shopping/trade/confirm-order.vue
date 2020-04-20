<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="layout">
			<view class="uni-flex uni-row vertical address" @click="$turnPage('/pages/shopping/trade/address', 'navigateTo')">
				<view class="uni-flex">
					<view class="icon-dizhi location"></view>
				</view>
				<view class="uni-flex uni-column rest" v-if="defaultAddress">
					<view class="uni-flex">
						<view class="uni-flex nick">{{defaultAddress.receiver}}</view>
						<view class="uni-flex phone">{{defaultAddress.receiverPhone}}</view>
					</view>
					<view class="uni-flex position">{{defaultAddress.receiverAreaName}}</view>
				</view>
				<view class="uni-flex uni-column rest" v-else>
					<view class="noposit">添加收货地址</view>
				</view>
				<view class="uni-flex">
					<view class="icon-qianjin backGrey"></view>
				</view>
			</view>
			<view class="order" v-for="(item, index) in selectOrderGoods" :key="index">
				<view class="uni-flex uni-row orderitem">
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
						<view class="title">￥{{item.price}}</view>
						<view class="number">x{{item.quantity}}</view>
					</view>
				</view>
				<view class="uni-flex settle">
					<view class="uni-flex rest horizontalright totaldesc">
						共{{item.quantity}}件商品
					</view>
					<view class="uni-flex totalspace">
						<text class="total">合计:</text>
						<text class="totalnum">￥{{item.quantity * parseFloat(item.price) * 100 / 100}}</text>
					</view>
				</view>
			</view>
			<view class="uni-flex uni-column ordersettle">
				<view class="uni-flex vertical space" style="border: none;">
					<view class="uni-flex rest subbase">商品总价</view>
					<view class="uni-flex subbase">￥{{totalFee}}</view>
				</view>
				<view class="uni-flex vertical space">
					<view class="uni-flex rest base">订单总价</view>
					<view class="uni-flex base">￥{{totalFee}}</view>
				</view>
				<view class="uni-flex vertical space">
					<view class="uni-flex rest base">微信支付</view>
					<view class="uni-flex base" style="color: #FC1E1E;">￥{{totalFee}}</view>
				</view>
				<view class="uni-flex vertical space" style="border: none;margin-bottom: 36rpx;" 
					@click="$turnPage('/pages/shopping/trade/invoice-info', 'navigateTo')">
					<view class="uni-flex rest base">发票信息</view>
					<view class="uni-flex vertical subbase">
						个人(普通发票)商品明细
						<!-- <image src="/static/center/backGrey.png" class="back"></image> -->
						<view class="icon-qianjin back"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row vertical btnop">
			<view class="uni-flex rest vertical total">合计  ￥{{totalFee}}</view>
			<view class="uni-flex content confirm" @click="submitOrder">提交订单</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			navigationBar
		},
		computed: mapState(['selectOrderGoods', 'selectAddress']),
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '确认订单' //导航栏文字
				},
				totalFee: 0, //订单总额
				defaultAddress: {}, //默认收货地址
				cartId: '', //购物车ID参数，多个购物车用逗号隔开
				params: {
					invoiceType: 1, //发票类型:普通发票
					invoiceContent: 0 //发票内容:0:不开,1:明细
				} //下单支付的参数
			}
		},
		onLoad() {
			console.log('this.selectOrderGoods',this.selectOrderGoods)
			let total = 0;
			this.cartId = ''
			this.selectOrderGoods.forEach((item) => {
				total = total + item.quantity * parseFloat(item.price)
				this.cartId += item.cartId + ','
			})
			this.totalFee = total.toFixed(2)
		},
		onShow() {
			console.log('用户',this.selectAddress)
			if(this.selectAddress && this.selectAddress.addressId) {
				this.defaultAddress = this.selectAddress
				console.log('用户选择了地址',this.defaultAddress)
			} else {
				this.getDefaultAddress()
			}
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			this.params = currPage.data.params; //获取发票信息
			console.log('mydata', currPage)
		},
		methods: {
			getDefaultAddress() {
				let that = this;
				//参数为空查询默认地址
				interfaceurl.checkAuth(interfaceurl.addressInfo, {addressId: ''}).then((res) => {
					that.defaultAddress = res.data
				});
			},
			submitOrder() {
				let that = this;
				if(!that.defaultAddress || !that.defaultAddress.addressId) {
					uni.showToast({
					    title: '收货地址不能为空',
					    icon: 'none',
					    duration: 2000
					});
					return;
				}
				if(this.cartId.length > 0) {
					this.cartId.substring(0, this.cartId.length-1)
				}
				that.params.cartId = that.cartId
				that.params.addressId = that.defaultAddress.addressId
				
				// let params = {
				// 	cartId: that.cartId,
				// 	addressId: that.defaultAddress.addressId,
				// 	invoiceType: 1, //发票类型:普通发票
				// 	invoiceContent: 0, //发票内容
				// 	invoiceHeadType: '', //个人，公司
				// 	invoiceHeadName: '', //invoiceHeadType = 1 必填姓名
				// 	invoiceHeadCompanyName: '', //invoiceHeadType =2 必填公司名称
				// 	registeredAddress: '', //注册地址
				// 	workPhone: '', //单位电话
				// 	bank: '', //开户银行
				// 	bankAccounts: '' //银行账户
				// }
				interfaceurl.checkAuth(interfaceurl.orderPayment, this.params).then((res) => {
					uni.requestPayment({
					    timeStamp: res.data.timeStamp,
					    nonceStr: res.data.nonceStr,
					    package: res.data.package,
					    signType: res.data.signType,
					    paySign: res.data.paySign,
					    success: (res) => {
					        that.$turnPage('/pages/shopping/trade/order', 'redirectTo')
							uni.hideLoading()
					    },
					    fail: (res) => {
							that.$turnPage('/pages/shopping/trade/order', 'redirectTo')
							uni.hideLoading()
					    },
					    complete: () => {
							
					    }
					});
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
		padding-top: 20rpx;
		width: 710rpx;
		margin: 0 auto;
		margin-bottom: 133rpx;
	}
	.address {
		width:710rpx;
		height:160rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.08);
		border-radius:15rpx;
		.location {
			color: #0071cf;
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
		.noposit {
			font-size: 26rpx;
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
	.base {
		font-size: 30rpx;
		color: #333333;
	}
	.subbase {
		font-size: 24rpx;
		color: #999999;
		.back {
			// width: 16rpx;
			// height: 25rpx;
			font-size: 25rpx;
			margin-left: 14rpx;
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
	
	.btnop {
		height: 80rpx;
		color: #FFFFFF;
		position: fixed;
		width: 100%;
		bottom: 0;
		.total {
			height: 100%;
			background: #333333;
			padding-left: 80rpx;
		}
		.confirm {
			height: 100%;
			width: 250rpx;
			background: #EB524B;
		}
	}
</style>
