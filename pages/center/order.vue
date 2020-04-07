<template>
	<view class="layout">
		<view class="uni-flex vertical searchbar">
			<view class="uni-flex">
				<image src="../../static/search.png" class="search"></image>
			</view>
			<view class="uni-flex searchorder">搜索订单</view>
		</view>
		<view class="uni-flex uni-row" style="margin: 28rpx 0;">
			<view class="uni-flex rest content">
				<text>全部</text>
			</view>
			<view class="uni-flex rest content">
				<text>待支付</text>
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
		</view>
		<view class="uni-flex uni-column orderInfo">
			<view class="uni-flex uni-row">
				
			</view>
			<view class="uni-flex uni-row">
				
			</view>
			<view class="uni-flex uni-row">
				
			</view>
		</view>
	</view>
	<!-- <view class="container">
		<view class="task-tab">
			<view class="task-tab-item" v-for="(item,index) in tabList" :key="index" @click="selectTab(index)">
				<text :class="{'tab-active':tabIndex == index}">{{item}}</text>
			</view>
		</view>

		<view class="order-list">

			<view class="order-item" v-for="(item,index) in orderList" :key="index">
				<view class="order-title">
					<text>订单号:</text>
					<text class="order-text">{{item.goods_order_no}}</text>
					<text class="status-btn" v-if="item.status == 0">待支付</text>
					<text class="status-btn" v-if="item.status == 1">备货中</text>
					<text class="status-btn" v-if="item.status == 2">待收货</text>
				</view>
				<view class="order-title" style="margin-top: 10upx;" v-if="item.status == 2">
					<text>快   递:</text>
					<text class="order-text">{{item.waybill_no}}</text>
				</view>

				<view class="shop-item" v-for="(content,dex) in item.goods_cart" :key="dex" @click="shopDetailPage(item)">
					<image :src="content.goods_cover_img" class="shop-img"></image>
					<view class="shop-item-content">
						<view class="shop-item-title">{{content.goods_name}}</view>
						<view style="margin-top: 10upx;">
							<text style="margin-right:20upx;">x{{content.buy_number}}</text>
							<text class="color-price">￥{{content.goods_price || ''}}</text>
						</view>
					</view>
				</view>

				<view class="shop-item-bottom">
					<text>共{{item.totalNum}}件商品 合计:￥</text>
					<text>{{item.total_price}}</text>
				</view>

			</view>
		</view>

		<view class="empty-text" v-if="orderList.length == 0">暂无订单数据</view>

	</view> -->
</template>

<script>
	// import { apiOrderList } from '@/service/index'
	export default {
		data() {
			return {
				tabIndex: 0,
				tabList: ['全部','待支付','待发货','待收货', '售后'],
				status: 0,
				orderList: [],
				total: 0,
				currentPage: 1,
				pageSize: 20
			}
		},
		onLoad(options) {
      // this.tabIndex = options.status
      // this.getOrderList(1)
		},
		onReachBottom() {
      if(this.orderList.length >= this.total){
        return
      }
      this.currentPage++
      this.getOrderList(2)
    },
		methods: {
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
				}else {
					params.status = ''
				}
				apiOrderList(params)
				.then((res) => {
					if(res.code == 0) {
						this.total = res.data.total
						if(type == 1) {
              this.orderList = res.data.data
						}else {
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
			shopDetailPage (item) {
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
	.searchbar {
		margin-top: 20rpx;
		width:100%;
		height:70rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 3px 0px rgba(255,255,255,0.2);
		border-radius:35rpx;
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
	.orderInfo {
		width:706rpx;
		height:454rpx;
		background: #FFFFFF;
	}
/* .container{
	padding-top: 40px;
}
.task-tab{
	height: 40px;
	line-height: 40px;
	display: flex;
	background-color: #ffffff;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  z-index: 9;
}
.task-tab-item{
	flex: 1;
	text-align: center;
  height: 100%;
  line-height: 40px;
  font-size: 30upx;
}
.tab-active{
	display: inline-block;
	color: #0071CF;
	position: relative;
	height: 100%;
}
.tab-active:after{
	content: '';
  width: 100%;
  height: 3px;
  background-color: #0071CF;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0px;
}
.order-list{
	padding: 20upx;
	border-radius: 20upx;
}
.order-item{
	margin-bottom: 20upx;
	padding: 20upx 30upx;
	background: #ffffff;
}
.order-title{
	display: flex;
	font-size: 26upx;
	color: #999999;
	align-items: center;
}
.order-text{
	flex: 1;
	color: #000000;
	margin-left: 10upx;
}
.status-btn{
	display: inline-block;
	width: 100upx;
	height: 30upx;
	line-height: 30upx;
	text-align: center;
	border-radius: 6upx;
	border: 1px solid #666666;
}
.shop-item{
	display: flex;
	align-items: center;
	margin-top: 20upx;
	padding: 20upx 0upx;
	border-top: 1px solid #F5F5F5;
}
.shop-img{
	width: 160upx;
	height: 160upx;
	margin-right: 30upx;
}
.shop-item-content{
	flex: 1;
	font-size: 26upx;
}
.shop-item-title{
	font-size: 22upx;
	margin-bottom: 10upx;
}
.shop-item-spec{
	border-radius: 6upx;
	background: #EEEEEE;
	padding: 6upx;
	font-size: 23upx;
	color: #999999;
}
.shop-item-bottom{
	margin-top: 20upx;
	text-align: right;
}
.bottom-btn{
	display: inline-block;
	height: 50upx;
	line-height: 50upx;
	border-radius: 20upx;
	color: #999999;
	border: 1px solid #999999;
	padding: 0upx 20upx;
	margin-left: 20upx;
}
.btn-active{
	color: #FF4444;
	border: 1px solid #FF4444;
} */
</style>
