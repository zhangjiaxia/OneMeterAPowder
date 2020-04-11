<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view class="container">
			<swiper class="swiper" circular :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in goodsDetail.detailImgUrlList" :key="index">
					<image :src="item" class="banner-img"></image>
				</swiper-item>
			</swiper>
			<view class="shop-message">
				<view class="shop-title">{{goodsDetail.name || ''}}</view>
				<view class="shop-price">
					￥{{goodsDetail.retailPrice[0] || '0.00'}}
					<!-- <text class="original-price">￥239</text> -->
				</view>
				<view class="shop-postage">
					全国包邮
				</view>
			</view>
			<view class="tab-list">
				<view class="tab-item">
					<view class="icon-gou1 tab-icon"></view>
					<text>正品保证</text>
				</view>
				<view class="tab-item">
					<view class="icon-gou1 tab-icon"></view>
					<text>全场包邮</text>
				</view>
				<view class="tab-item">
					<view class="icon-gou1 tab-icon"></view>
					<text>全场钜惠</text>
				</view>
				<view class="tab-item">
					<view class="icon-gou1 tab-icon"></view>
					<text>售后无忧</text>
				</view>
			</view>
			<view class="detail">
				<view class="rich-text">
					<!-- <view v-html="goodsDetail.detailInfo"></view> -->
					<rich-text :nodes="goodsDetail.detailInfo"></rich-text>
				</view>
			</view>
			<view class="goodsdeclaration">
				<image src="/static/goods-desc.png" style="width: 100%;" mode="aspectFit"></image>
			</view>
			<view class="detail-bottom">
				<view class="detail-bottom-left">
					<view class="detail-bottom-item">
						<!-- <image src="/static/share-icon.png" class="share-icon"></image> -->
						<view class="icon-fenxiang " style="font-size: 32rpx;"></view>
						<view>分享</view>
						<button type="primary" open-type="share" class="share-btn"></button>
					</view>
					<view class="detail-bottom-item" @click="shoppingPage">
						<image src="/static/shopping-icon.png" class="share-icon"></image>
						<!-- <view class="icon-fenxiang share-icon"></view> -->
						<view>购物车</view>
					</view>
				</view>
				<authPage>
					<view class="shop-btn" @click="showPanel(true)">加入购物车</view>
				</authPage>
				<authPage>
					<view class="pay-btn" @click="showPanel(false)">立即购买</view>
				</authPage>
			</view>
		</view>
		<!--弹窗-->
		<view class="confirm-modal" v-if="confirmModal" @touchmove.stop.prevent="touch">
			<view class="confirm-modal-content">
				<view class="modal-shop-message">
					<image :src="goodsDetail.mainImgUrl" class="modal-shop-img"></image>
					<view class="modal-shop-content">
						<view>{{goodsDetail.name}}</view>
						<view class="shop-price">￥{{goodsDetail.retailPrice[0] || 0}}</view>
						<view class="amount">库存 {{inventoryCount || 0}} 件</view>
					</view>
					<view class="icon-cha- modal-shop-close" @click="confirmModal=false;"></view>
				</view>
				<scroll-view scroll-y="true" style="max-height: 400rpx;">
					<view class="spec-content" v-for="(item, index) in skuPropList" :key="index">
						<view>{{index}}</view>
						<view class="spec-list">
							<text class="spec-item" :class="{'spec-active':i == propsCheck[index]}" 
								v-for="(subItem, i) in item" :key="i" @click="chooseProps(index, i)">{{subItem}}
							</text>
						</view>
					</view>
				</scroll-view>

				<view class="shop-item-bottom">
					<text>购买数量</text>
					<view class="shop-num">
						<text class="reduct-btn" @click="reduceNum">-</text>
						<text class="num">{{shopNum}}</text>
						<text class="add-btn" @click="addNum">+</text>
					</view>
				</view>

				<view class="modal-bottom" @click="handleConfirm">
					<text class="">确认支付</text>
				</view>
			</view>
		</view>
		<!--弹窗时阻止滚动穿透-->
		<view class="mask" v-show="confirmModal" @click="confirmModal=false;" @touchmove.stop.prevent="touch"></view>
	</view>
</template>

<script>
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import interfaceurl from '@/utils/interface.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			authPage,
			navigationBar
		},
		computed: mapState(['goodsDetail']),
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					background: '#0071CF',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '' //导航栏文字
				},
				id: '',
				confirmModal: false,
				indicatorDots: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
				detail: {
					goods_name: '红牡丹抽色润颜霜 均匀亮白十全十美套盒'
				},
				shopNum: 1,
				type: 1,
				bannerList: ['/static/banner.png'],
				shopItem: {},
				invitation_code: '',
				userInfo: {},
				is_cash_back: '0',
				//动态参数
				skuPropertyList: [], //用户所选的商品sku
				skuPropList: [{}, {}, {}, {}, {}], //商品属性
				propsCheck: {}, //属性选择
				//goodsDetail: {}, //商品详情，暂时
				cartOrOrder: true, //加入购物车：true,下单：false
				inventoryCount: 0, //各组sku的库存量
				cartId: '' //购物车ID
			}
		},
		onShareAppMessage(res) {
			return {
				title: '一米一粉',
				path: '/pages/shop-detail/shop-detail?id=' + this.id + '&code=' + this.invitation_code,
				imageUrl: '/static/share-banner.png'
			}
		},
		onLoad(options) {
			this.navigationBarStyle.iconText = this.goodsDetail.brandName
			let item = this.deepCopy(this.goodsDetail)
			item.detailInfo = item.detailInfo.replace(/<img/gi, '<img width="100%!important" ')
			this.$store.commit('setGoodsDetail', item)
			this.getData()
			//this.getGoodsDetail()
		},
		onShow() {
			const value = wx.getStorageSync('userInfo')
			if (value) {
				this.userInfo = value
			}
		},
		methods: {
			touch() {},
			chooseProps(index, i) {
				this.propsCheck[index] = i
				//更改库存
				let element = this.judgeCode()
				this.inventoryCount = element ? element.inventoryCount : 0
			},
			// getGoodsDetail() {
			// 	let that = this;
			// 	let params = {
			// 		spuId: 115199
			// 	}
			// 	interfaceurl.checkAuth(interfaceurl.goodsDetail, params, false).then((res) => {
			// 		that.goodsDetail = res.data
			// 		that.getData()
			// 	});
			// },
			//梳理商品详情数据
			getData() {
				let that = this
				//抽取商品的规格属性
				let props = {}
				let propsCheck = {} //属性选择
				for(var item of that.goodsDetail.skuList) {
					for(var subItem of item.skuPropertyList) {
						if(!props[subItem.name]) {
							props[subItem.name] = []
							propsCheck[subItem.name]= 0
						}
						if(props[subItem.name].indexOf(subItem.val) <= -1) {
							props[subItem.name].push(subItem.val)
						}
					}
				}
				that.skuPropList = props
				that.propsCheck = propsCheck
				//console.log(props,propsCheck)
				let element = that.judgeCode()
				that.inventoryCount = element ? element.inventoryCount : 0
			},
			deepCopy(obj) {
				var result = Array.isArray(obj) ? [] : {};
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if (typeof obj[key] === 'object' && obj[key] !== null) {
							result[key] = this.deepCopy(obj[key]); //递归复制
						} else {
							result[key] = obj[key];
						}
					}
				}
				return result;
			},
			//判断用户选择的属性规格是否存在，存在则返回对应的code，否则提示无库存
			judgeCode() {
				let check = {}
				let flag = 0
				for(let key in this.propsCheck){
					check[key] = this.skuPropList[key][this.propsCheck[key]]
					//console.log(check)
				}
				for(var item of this.goodsDetail.skuList) {
					for(var subItem of item.skuPropertyList) {
						if(check[subItem.name] == subItem.val) {
							flag ++;
						}
					}
					if(flag == item.skuPropertyList.length) {
						console.log('用户选择存在',item)
						//如果规格值等于一组中的所有值，则用户所选规格存在，返回该组sku对应的code
						this.skuPropertyList = item.skuPropertyList
						return item;
					}
					flag = 0
				}
				//console.log('用户选择不存在')
				return null
			},
			//加入购物车
			addCart(code) {
				let that = this;
				let params = {
					code: code, //商品sku
					quantity: this.shopNum
				}
				interfaceurl.checkAuth(interfaceurl.cartCreate, params).then((res) => {
					if(res.code != 0) {
						that.confirmModal = true
					} else {
						that.confirmModal = false
					}
					uni.showToast({
						title: '购物车添加成功',
						icon: 'success',
						duration: 2000
					});
				});
			},
			//立即购买
			cartDirectBuy(code) {
				let that = this;
				let params = {
					code: code, //商品sku
					quantity: this.shopNum
				}
				interfaceurl.checkAuth(interfaceurl.cartDirectBuy, params).then((res) => {
					that.cartId = res.data.cartId
					uni.showToast({
						title: '购物车添加成功',
						icon: 'success',
						duration: 2000
					});
					//点击立即支付，加入购物车后跳转到确认订单页面
					this.confrimOrderPage()
				});
			},
			reduceNum() {
				if (this.shopNum <= 1) {
					this.shopNum = 1
				} else {
					this.shopNum--
				}
			},
			addNum() {
				this.shopNum++
			},
			handlePay(type) {
				if (type == 1 && this.is_cash_back == 1) {
					uni.showToast({
						title: '全返商品请直接购买',
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.type = type
				this.confirmModal = true
			},
			shoppingPage() {
				uni.switchTab({
					url: '/pages/shopping/shopping'
				});
			},
			handleConfirm() {
				let item = this.judgeCode()
				if(!item) {
					uni.showToast({
						title: '库存数量不足',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if(this.cartOrOrder) {
					this.addCart(item.code)
				} else {
					this.confirmModal = false
					this.cartDirectBuy(item.code)
				}
			},
			handleImgHtml(str) {
				var richtext = str
				const regex = new RegExp('<img', 'gi');
				richtext = richtext.replace(regex, `<img style="max-width: 100%;margin: 0px;padding:0px;vertical-align: top;"`);
				return richtext;
			},
			showPanel(isCart) {
				this.confirmModal = true
				this.cartOrOrder = isCart
			},
			confrimOrderPage() {
				let item = this.goodsDetail
				const shopItem = {
					spuId: item.spuId,
					price: item.retailPrice[0],
					name: item.name,
					goodsPhotoUrl: item.mainImgUrl,
					quantity: this.shopNum,
					cartId: this.cartId,
					skuPropertyList: this.skuPropertyList
				}
				let shopList = []
				shopList.push(shopItem)
				this.$store.commit('setSelectOrderGoods', shopList)
				//uni.setStorageSync('shopList', shopList)
				this.$turnPage('/pages/shopping/trade/confirm-order' ,'navigateTo')
			}
		}
	}
</script>

<style>
	.container {
		background: #ffffff;
		padding-bottom: 130upx;
	}

	.swiper {
		width: 100%;
		height: 750upx;
	}

	.banner-img {
		width: 100%;
		height: 100%;
	}

	.shop-message {
		padding: 30upx;
		background: #ffffff;
	}

	.shop-title {
		font-size: 32upx;
		font-weight: bold;
	}

	.shop-price {
		font-size: 32upx;
		margin-top: 20upx;
		color: #FF0000;
	}
	
	.original-price {
		font-size: 24rpx;
		text-decoration:line-through;
		color:rgba(153,153,153,1);
		margin-left: 10rpx;
	}
	
	.shop-postage {
		color: #999999;
		font-size: 24rpx;
		margin-top: 28rpx;
	}

	.advantage {
		height: 80upx;
		padding: 0upx 30upx;
		background: #F5F5FA;
		color: #999999;
		font-size: 26upx;
		display: flex;
		align-items: center;
	}

	.advantage-text {
		color: #22AC38;
		margin-right: 30upx;
	}

	.advantage-icon {
		width: 39upx;
		height: 39upx;
		margin-right: 10upx;
	}

	.detail {
		margin-top: 20upx;
	}

	.detail-title {
		text-align: center;
		height: 80upx;
		line-height: 80upx;
		color: #CCCCCC;
		background: #D6F2F9;
	}

	.tab-list {
		display: flex;
		height: 80upx;
		padding: 0upx 30upx;
		background: #F5F5FA;
		margin-top: 20upx;
		align-items: center;
	}

	.tab-item {
		flex: 1;
		font-size: 26upx;
		color: #222222;
	}

	.tab-icon {
		color: #FF0000;
		font-size: 32rpx;
		margin-right: 10rpx;
	}

	.detail-bottom {
		width: 100%;
		height: 100upx;
		position: fixed;
		left: 0px;
		bottom: 0px;
		background: #f5f5f5;
		box-sizing: border-box;
		display: flex;
	}

	.shop-btn {
		width: 230upx;
		height: 100%;
		color: #ffffff;
		line-height: 100upx;
		text-align: center;
		background: #59ADF3;
	}

	.pay-btn {
		width: 230upx;
		height: 100%;
		color: #ffffff;
		line-height: 100upx;
		text-align: center;
		background: #0070CF;
	}

	.detail-bottom-left {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666666;
	}

	.share-icon {
		width: 32rpx;
		height: 32rpx;
	}

	.detail-bottom-item {
		width: 130upx;
		text-align: center;
		font-size: 26upx;
		position: relative;
	}

	.share-btn {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0px;
		top: 0px;
		opacity: 0;
	}

	.mask {
		background: #4B4B4B;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 1;
		opacity: 0.9;
		/*避免其他页面元素使用定位引发的位置偏移*/
		top: 0;
	}

	/* .confirm-modal{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 99;
  background: rgba(0,0,0,0.3);
} */
	.confirm-modal-content {
		width: 100%;
		background: #ffffff;
		box-sizing: border-box;
		position: fixed;
		left: 0px;
		bottom: 0px;
		padding: 30upx;
		border-radius: 20upx 20upx 0upx 0upx;
		z-index: 100;
	}

	.modal-shop-message {
		display: flex;
		align-items: center;
	}

	.modal-shop-img {
		width: 160upx;
		height: 160upx;
		border-radius: 10upx;
		margin-right: 30upx;
	}

	.modal-shop-close {
		font-size: 30rpx !important;
	}

	.modal-shop-content {
		flex: 1;
	}

	.amount {
		font-size: 26upx;
		color: #999999;
		margin-top: 10upx;
	}

	.spec-content {
		margin-top: 10rpx;
		padding: 10rpx 0rpx;
	}

	.spec-list {
		display: flex;
		flex-wrap: wrap;
	}

	.spec-item {
		display: inline-block;
		height: 50upx;
		line-height: 50upx;
		padding: 0upx 20upx;
		border-radius: 10upx;
		margin-right: 10upx;
		background-color: #EEEEEE;
		color: #CCCCCC;
		font-size: 26upx;
		margin: 10rpx;
	}

	.spec-active {
		color: #F39800;
		background: #FFF6E4;
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

	.modal-bottom {
		margin-top: 50upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		display: flex;
		justify-content: center;
		background: #0070D1;
		border-radius: 40rpx;
		color: #FFFFFF;
	}

	.modal-bottom-left {
		display: inline-block;
		flex: 1;
		background: #FFDE2A;
		border-radius: 0upx 30upx 30upx 0upx;
	}

	.modal-bottom-right {
		display: inline-block;
		flex: 1;
		background: #EB6100;
		color: #ffffff;
		border-radius: 30upx 0upx 0upx 30upx;
	}

	.rich-text {
		width: 100%;
		overflow: hidden;
	}

	.rich-text image {
		width: 100%;
		height: auto;
	}

	p {
		margin: 0px;
		padding: 0px;
	}

	.search-btn {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0px;
		bottom: 0px;
		opacity: 0;
		z-index: 999;
	}
</style>
