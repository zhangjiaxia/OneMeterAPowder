<template>
	<view class="container">
		<view class="content">
			<view class="edit-status" v-if="cartList.total > 0">
				<text v-if="isEdit" @click="handleEdit">取消</text>
				<text v-else @click="handleEdit">编辑</text>
			</view>
			
			<view style="margin-bottom: 20rpx;" v-for="(item,index) in shopList" :key="index">
				<uni-swipe-action :options="options" :show="isOpened" :auto-close="true" @click.stop="bindClick(item.cartId)">
					<view class="shop-item">
						<view class="icon-gou" :style="{color: item.selected ? '#0070CF' : '#999999'}" @click="handleSelect(index)"></view>
						<image :src="item.goodsPhotoUrl" class="shop-img"></image>
						<view class="shop-item-content">
							<view class="shop-item-title">{{item.name}}</view>
							<view class="shop-item-spec">
								<!-- <view>50ml</view> -->
								<text class="shop-item-size" v-for="(thirdItem, x) in item.skuPropertyList" :key="x">{{thirdItem.val}}</text>
							</view>
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
				</uni-swipe-action>
			</view>
			
		</view>
		<view class="shopping-bottom" v-if="cartList.total > 0">
			<view class="icon-gou radio-icon" :style="{color: isAll ? '#0070CF' : '#999999'}" @click="hadleSelectAll"></view>
			<text @click="hadleSelectAll">全选</text>
			<view class="total" v-if="isEdit"></view>
			<view class="total" v-if="!isEdit">
				<text>总价:</text>
				<text class="color-price">￥{{totalFee}}</text>
			</view>
			<view class="pay-btn" v-if="isEdit" @click="handleDelete">删除</view>
			<view class="pay-btn" v-else @click="confrimOrderPage">结算</view>
		</view>
		<view class="empty-text" v-else>
			<template v-if="!loading">
				<image src="/static/empty.png" class="empty-icon" mode="widthFix"></image>
				<view>购物车还是空的</view>
			</template>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	export default {
		components:{ uniSwipeAction },
		data() {
			return {
				totalFee: '0.00', //总金额
				timer: null, //延迟处理用户多次点击商品数量加减按钮
				isAll: true, //判断是否全选
				isEdit: false, //是否出现编辑删除按钮
				cartList: {}, //购物车数据
				shopList: [], //购物车列表
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
				}],
				loading: true //加载中
			}
		},
		onShow() {
			this.initData();
		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.shopList.length >= this.cartList.total) {
				return;
			}
			this.params.page++;
			this.getCartPageList()
		},
		methods: {
			initData() {
				//重置分页参数
				this.loading = true
				this.isAll = true
				this.cartList = {}
				this.shopList = []
				this.params.page = 1
				if (uni.getStorageSync('token')) {
					this.getCartPageList();
				}
			},
			bindClick(id) {
				this.delCartGame(id)
			},
			getCartPageList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.cartPageList, this.params).then((res) => {
					that.loading = false;
					that.cartList = res.data
					for (var item of that.cartList.data) {
						item.selected = true
					}
					that.shopList = that.shopList.concat(that.cartList.data)
					that.getTotalFee()
				});
			},
			delCartGame(ids) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.cartDelete, {cartId: ids}).then((res) => {
					that.initData();
				});
			},
			handleEdit() {
				this.isEdit = !this.isEdit
			},
			handleDelete() {
				let ids = '' //批量删除，逗号隔开
				for(var item of this.shopList) {
					if(item.selected) {
						ids += ',' + item.cartId
					}
				}
				if (!ids.length > 0) {
					uni.showToast({
						title: '请选择删除的商品',
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.delCartGame(ids.substring(1))
			},
			handleSelect(index) {
				this.shopList[index].selected = !this.shopList[index].selected
				this.$set(this.shopList, index, this.shopList[index])
				this.getTotalFee()
			},
			hadleSelectAll() {
				this.isAll = !this.isAll
				if (this.isAll) {
					this.shopList.forEach((item) => {
						item.selected = true
					})
				} else {
					this.shopList.forEach((item) => {
						item.selected = false
					})
				}
				this.getTotalFee()
			},
			getTotalFee() {
				let total = 0
				//console.log(this.shopList)
				this.shopList.forEach((item) => {
					if (item.selected) {
						total = total + item.quantity * parseFloat(item.price)
					}
				})
				this.totalFee = total.toFixed(2)
			},
			shoppingUpdate(item) {
				let that = this;
				let params = {
					cartId: item.cartId, //购物车ID
					quantity: item.quantity
				}
				interfaceurl.checkAuth(interfaceurl.cartUpdate, params, false).then((res) => {
					
				});
			},
			reduceNum(index) {
				if (this.shopList[index].quantity <= 1) {
					this.shopList[index].quantity = 1
				} else {
					this.shopList[index].quantity = this.shopList[index].quantity - 1
				}
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					this.shoppingUpdate(this.shopList[index])
				}, 1000)
				this.getTotalFee()
			},
			addNum(index) {
				this.shopList[index].quantity = this.shopList[index].quantity + 1
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					this.shoppingUpdate(this.shopList[index])
				}, 1000)
				this.getTotalFee()
			},
			confrimOrderPage() {
				const arr = this.shopList.filter((item) => {
					return item.selected == true
				})
				if (!arr.length) {
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
				//uni.setStorageSync('shopList', shopList)
				this.$turnPage('/pages/shopping/trade/confirm-order', 'navigateTo')
			}
		}
	}
</script>

<style>
	.container {
		background: #F5F5F5;
		padding-bottom: 130upx;
	}

	.content {
		padding: 30upx;
	}

	.edit-status {
		margin-bottom: 20upx;
		text-align: right;
		font-size: 26upx;
		color: #EB6100;
	}

	.shop-item {
		height: 230upx;
		background-color: #ffffff;
		padding: 10upx 20upx;
		border-radius: 10upx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
	}

	.shop-img {
		width: 160upx;
		height: 160upx;
		border-radius: 10upx;
		margin-right: 20upx;
	}

	.shop-item-content {
		flex: 1;
	}

	.shop-item-title {
		font-size: 22upx;
		margin-bottom: 10upx;
	}

	.shop-item-spec {
		border-radius: 6upx;
		background: #EEEEEE;
		padding: 6upx;
		font-size: 23upx;
		color: #999999;
	}

	.shop-item-size {
		background: #F3F0F3;
		color: #A09DA1;
		margin-right: 10rpx;
		padding: 6rpx;
		display: inline-flex;
		margin-bottom: 10rpx;
	}

	.shop-item-bottom {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.shop-num {
		height: 39upx;
		line-height: 39upx;
		border: 1px solid #cccccc;
		border-radius: 10upx;
		text-align: center;
	}

	.reduct-btn {
		display: inline-block;
		width: 42upx;
		border-right: 1px solid #cccccc;
	}

	.num {
		display: inline-block;
		width: 65upx;
	}

	.add-btn {
		display: inline-block;
		width: 42upx;
		border-left: 1px solid #cccccc;
	}

	.shopping-bottom {
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
		z-index: 100;
	}

	.radio-icon {
		font-size: 36rpx !important;
		margin-right: 20upx;
	}

	.total {
		color: #333333;
		flex: 1;
		text-align: right;
		margin-right: 20upx;
	}

	.color-price {
		font-size: 32upx;
		color: #FF4444;
		margin-left: 10upx;
	}

	.pay-btn {
		width: 260upx;
		height: 39px;
		line-height: 39px;
		text-align: center;
		color: #ffffff;
		border-radius: 30upx;
		background: #0071CF;
		font-size: 30upx;
	}

	.empty-icon {
		width: 130upx;
	}
</style>
