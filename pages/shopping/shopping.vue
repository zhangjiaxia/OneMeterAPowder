<template>
	<view class="container">
		<view class="content">
			  <view class="edit-status" v-if="total > 0">
				<text v-if="isEdit" @click="handleEdit">取消</text>
				<text v-else @click="handleEdit">编辑</text>
			  </view>
			<view class="shop-item" v-for="(item,index) in shopList" :key="index">
				<image v-if="item.selected" src="/static/radio-selected.png" class="radio-icon" @click="handleSelect(index)"></image>
				<image v-else src="/static/radio.png" class="radio-icon" @click="handleSelect(index)"></image>
				<image :src="item.goodsPhotoUrl" class="shop-img"></image>
				<view class="shop-item-content">
					<view class="shop-item-title">{{item.name}}</view>
					<!-- <view class="shop-item-spec">
						<view>50ml</view>
					</view> -->
					<view class="shop-item-bottom">
						<text class="color-price" style="margin-left: 0px;">￥{{item.price}}</text>
						<view class="shop-num">
							<text class="reduct-btn" @click="reduceNum(index)">-</text>
							<text class="num">{{item.quantity}}</text>
							<text class="add-btn" @click="addNum(index)">+</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="shopping-bottom" v-if="cartList.total > 0">
			<image v-if="isAll" src="/static/radio-selected.png" class="radio-icon" @click="hadleSelectAll"></image>
			<image v-else src="/static/radio.png" class="radio-icon" @click="hadleSelectAll"></image>
			<text @click="hadleSelectAll">全选</text>
			<view class="total" v-if="isEdit"></view>
			<view class="total" v-if="!isEdit">
				<text>总价:</text>
				<text class="color-price">￥{{totalFee}}</text>
			</view>
			<view class="pay-btn" v-if="isEdit" @click="handleDelete">删除</view>
			<view class="pay-btn" v-else @click="confrimOrderPage">结算</view>
		</view>
		<view class="empty-text" v-if="cartList.total == 0">
			<image src="/static/empty.png" class="empty-icon" mode="widthFix"></image>
			<view>购物车还是空的</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				currentPage: 1,
				pageSize: 20,
				total: 0,
				totalFee: '0.00',
				shopList: [],
				// shopList: [{
				// 	selected: true,
				// 	goods_name: '商品名',
				// 	goods_cover_img: 'https://early-education.oss-cn-beijing.aliyuncs.com/meter_power/default/20200327/0f0bfc1fbb6a8faabd0de3c2b5fbab66.jpg',
				// 	goods_price: 123,
				// 	buy_number: 1
				// }],
				timer: null,
				isAll: true,
				isEdit: false,
				//动态参数
				cartList: {} //购物车列表
			}
		},
		onShow() {
      // this.getShoppingList(1)
			this.getCartPageList();
		},
		onReachBottom() {
		  if(this.shopList.length >= this.total){
			return
		  }
		  this.currentPage++
		  this.getShoppingList(2)
		},
		methods: {
			getCartPageList() {
				let that = this;
				let params = {
					page: 1 ,
					size: 10
				}
				interfaceurl.checkAuth(interfaceurl.cartPageList, params).then((res) => {
					that.cartList = res.data
					for(var item of that.cartList.data) {
						item.selected = true
					}
					that.shopList = that.cartList.data
					that.getTotalFee()
				});
			},
		  indexPage() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		  },
			getShoppingList(type) {
				apiShoppingList({
					page: this.currentPage,
					size: this.pageSize
				})
				.then((res) => {
					if(res.code == 0) {
						this.total = res.data.total
						if(type == 1) {
					  this.shopList = res.data.data
						}else {
					  this.shopList = this.shopList.concat(res.data.data)
						}
						this.shopList.forEach((item) => {
							item.selected = false
						})
					}
				})
			},
			  handleEdit() {
				this.isEdit = !this.isEdit
			  },
			  handleDelete() {
				const arr = this.shopList.filter((item) => {
				  return item.selected == true
				})
				if(!arr.length) {
				  uni.showToast({
					title: '请选择删除的商品',
					icon: 'none',
					duration: 2000
				  });
				  return
				}
				arr.forEach((item) => {
				  this.confirmDelete(item.cart_id)
				})
			  },
		  confirmDelete(id) {
			apiShoppingDelete({
			  cart_id: id
			})
			.then((res) => {
			  if(res.code == 0) {
				this.getShoppingList(1)
			  }
			})
		  },
			handleSelect(index) {
				this.shopList[index].selected = !this.shopList[index].selected
				this.$set(this.shopList,index,this.shopList[index])
				this.getTotalFee()
			},
			hadleSelectAll() {
				this.isAll = !this.isAll
				if(this.isAll) {
				  this.shopList.forEach((item) => {
					item.selected = true
				  })
				}else {
				  this.shopList.forEach((item) => {
					item.selected = false
				  })
				}
				this.getTotalFee()
			},
			getTotalFee() {
				let total = 0
				console.log(this.shopList)
				this.shopList.forEach((item) => {
					if(item.selected) {
						total = total + item.quantity * parseFloat(item.price)
					}
				})
				this.totalFee = total.toFixed(2)
				console.log(this.totalFee)
			},
			shoppingUpdate(item) {
				let that = this;
				let params = {
					cartId: item.cartId, //购物车ID
					quantity: item.quantity
				}
				interfaceurl.checkAuth(interfaceurl.cartUpdate, params, false).then((res) => {
					that.bannerList = res.data
				});
				// apiShoppingUpdate({
				// 	cart_id: item.cart_id,
				// 	buy_number: item.quantity
				// })
				// .then((res) => {
				// 	if(res.code == 0) {

				// 	}
				// })
			},
			reduceNum(index) {
				if (this.shopList[index].quantity <= 1) {
					this.shopList[index].quantity = 1
				}else {
					this.shopList[index].quantity = this.shopList[index].quantity - 1
				}
				clearInterval(this.timer)
				this.timer = setTimeout(()=>{
				  this.shoppingUpdate(this.shopList[index])
				}, 1000)
				this.getTotalFee()
			},
			addNum(index) {
			  this.shopList[index].quantity = this.shopList[index].quantity + 1
			  clearInterval(this.timer)
				this.timer = setTimeout(()=>{
				  this.shoppingUpdate(this.shopList[index])
						}, 1000)
				this.getTotalFee()
			},
			confrimOrderPage() {
				const arr = this.shopList.filter((item) => {
					return item.selected == true
				})
				if(!arr.length) {
				  uni.showToast({
					title: '请选择商品',
					icon: 'none',
					duration: 2000
				  });
					return
				}
				let shopList = []
				arr.forEach((item) => {
				  const shopItem = {
					spuId: item.spuId,
					price: item.price,
					name: item.name,
					goodsPhotoUrl: item.goodsPhotoUrl,
					quantity: item.quantity,
					cartId: item.cartId,
					skuPropertyList: item.skuPropertyList
				  }
				  shopList.push(shopItem)
				})
				//数据存储优先使用store
				this.$store.commit('setSelectOrderGoods', shopList)
				uni.setStorageSync('shopList', shopList)
				uni.navigateTo({
				  url: '/pages/shopping/confirm-order'
				});
			}
		}
	}
</script>

<style>
.container{
	background: #F5F5F5;
	padding-bottom: 130upx;
}
.content{
	padding: 30upx;
}
.edit-status{
  margin-bottom: 20upx;
  text-align: right;
  font-size: 26upx;
  color: #EB6100;
}
.shop-item{
	height: 230upx;
	background-color: #ffffff;
	padding: 10upx 20upx;
	border-radius: 10upx;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #f5f5f5;
}
.shop-img{
	width: 160upx;
	height: 160upx;
	border-radius: 10upx;
	margin-right: 20upx;
}
.shop-item-content{
	flex: 1;
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
	margin-top: 30upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.shop-num{
	height: 39upx;
	line-height: 39upx;
	border: 1px solid #cccccc;
	border-radius: 10upx;
	text-align: center;
}
.reduct-btn{
	display: inline-block;
	width: 42upx;
	border-right: 1px solid #cccccc;
}
.num{
	display: inline-block;
	width: 65upx;
}
.add-btn{
	display: inline-block;
	width: 42upx;
	border-left: 1px solid #cccccc;
}
.shopping-bottom{
	width: 100%;
  height: 112upx;
  background: #ffffff;
  position: fixed;
  left: 0px;
  bottom: 0px;
  padding: 0upx 30upx;
  box-sizing: border-box;
  border-bottom: 1px solid #F5F5F5;
  display: flex;
  align-items: center;
  color: #999999;
  font-size: 26upx;
}
.radio-icon{
	width: 36upx;
	height: 36upx;
	margin-right: 20upx;
}
.total{
	color: #333333;
	flex: 1;
	text-align: right;
	margin-right: 20upx;
}
.color-price{
	font-size: 32upx;
	color: #FF4444;
	margin-left: 10upx;
}
.pay-btn{
	width: 260upx;
	height: 39px;
	line-height: 39px;
	text-align: center;
	color: #ffffff;
  border-radius: 30upx;
  background: #031F5E;
  font-size: 30upx;
}
.empty-icon{
	width: 130upx;
}
</style>
