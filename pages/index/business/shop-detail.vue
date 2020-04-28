<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="container">
			<swiper class="swiper" circular :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in goodsDetail.detailImgUrlList" :key="index">
					<image :src="item" class="banner-img"></image>
				</swiper-item>
			</swiper>
			<view class="uni-flex vertical vip-upgrade" v-if="isVip != 1">
				<image src="/static/rect.png" class="vipbg"></image>
				<view class="uni-flex uni-row vip" @click="$turnPage('/pages/vip/rule/vip-index', 'navigateTo')">
					<view class="uni-flex rest">
						<text class="vipdesc">
							现在升级vip会员，全场均省38%
						</text>
					</view>
					<view class="uni-flex content vipbtn vipdesc">立即升级</view>
				</view>
			</view>
			<view class="shop-message">
				<view class="uni-flex uni-row vertical">
					<view class="uni-flex vertical rest shop-price">
						<text v-if="isVip == 1" style="margin-right: 18rpx;color: #ff0033;">
							VIP <text style="font-size: 28rpx;margin-left: 20rpx;">￥</text>{{skuChooseItem.vipPrice || ''}}
						</text>
						<text :style="{color: isVip == 1 ? '#999999' : '#ff0033', 'font-size': '26rpx'}">
							￥{{skuChooseItem.retailPrice || ''}}(零售价)
						</text>
					</view>
					<view class="uni-flex">
						<text style="color: #ff0033;font-size: 24rpx;">
							+{{(isVip == 1 ? skuChooseItem.vipPrice : skuChooseItem.retailPrice) || ''}}积分
						</text>
					</view>
				</view>
				<view class="shop-title">{{goodsDetail.name || ''}}</view>
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
				<view class="uni-flex uni-row" style="width: 100%;">
					<authPage>
						<view class="uni-flex rest content detail-bottom-item" @click="startShare()">
							<image src="/static/share-icon.png" class="share-icon"></image>
							<view>分享</view>
						</view>
					</authPage>
					<view class="uni-flex rest content detail-bottom-item" @click="shoppingPage">
						<image src="/static/shopping-icon.png" class="share-icon"></image>
						<view>购物车</view>
					</view>
					<authPage>
						<view class="uni-flex content shop-btn" @click="showPanel(true)">加入购物车</view>
					</authPage>
					<authPage>
						<view class="uni-flex content pay-btn" @click="showPanel(false)">立即购买</view>
					</authPage>
				</view>
			</view>
		</view>
		<!--购物车弹窗-->
		<view class="confirm-modal" v-if="confirmModal" @touchmove.stop.prevent="touch">
			<view class="confirm-modal-content">
				<view class="modal-shop-message">
					<image :src="goodsDetail.mainImgUrl" class="modal-shop-img"></image>
					<view class="modal-shop-content">
						<view>{{goodsDetail.name}}</view>
						<view class="shop-price">￥{{isVip == 1 ? skuChooseItem.vipPrice : skuChooseItem.retailPrice}}</view>
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
					<text class="">{{cartOrOrder ? '加入购物车' : '确认支付'}}</text>
				</view>
			</view>
		</view>
		<!--分享弹窗-->
		<view v-if="goodsDetail.shareImg">
			<sharePoster :bgImg="goodsDetail.shareImg" ref="share"></sharePoster>
		</view>
		<!--弹窗时阻止滚动穿透-->
		<view class="mask" v-show="confirmModal" @click="confirmModal=false;"
		 @touchmove.stop.prevent="touch"></view>
	</view>
</template>

<script>
	import sharePoster from '@/components/shop-business/share-poster.vue' //引入授权窗体
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
			sharePoster,
			authPage,
			navigationBar
		},
		//computed: mapState(['goodsDetail']),
		data() {
			return {
				isShow: false, //是否显示分享窗体
				isVip: 0, //是否会员，0:否，1:是
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '' //导航栏文字
				},
				id: '',
				detail: {
					goods_name: '红牡丹抽色润颜霜 均匀亮白十全十美套盒'
				},
				shopNum: 1,
				type: 1,
				bannerList: [],
				shopItem: {},
				invitation_code: '',
				userInfo: {},
				is_cash_back: '0',
				//动态参数
				//轮播参数
				indicatorDots: false,
				autoplay: true,
				interval: 3000,
				duration: 500,
				confirmModal: false, //是否显示购物车弹窗
				skuPropertyList: [], //用户所选的商品sku
				skuPropList: [{}, {}, {}, {}, {}], //商品属性
				propsCheck: {}, //属性选择
				goodsDetail: {}, //商品详情，暂时
				cartOrOrder: true, //加入购物车：true,下单：false
				inventoryCount: 0, //各组sku的库存量
				skuChooseItem: {}, //用户当前所选的商品sku
				cartId: '', //购物车ID
				spuId: 0 //商品ID
			}
		},
		onShareAppMessage: function( options ){
		　　var that = this;
			let userInfo = uni.getStorageSync('userInfo')
			let code = uni.getStorageSync('code')
		　　// 设置菜单中的转发按钮触发转发事件时的转发内容
		　　var shareObj = {
		　　　　title: userInfo.nickName + ' 为您推荐好货', // 默认是小程序的名称(可以写slogan等)
		　　　　path: '/pages/index/index?code=' + code, // 默认是当前页面，必须是以‘/’开头的完整路径
		　　　　imageUrl: that.goodsDetail.shareImg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
		　　　　success: function(res){
		　　　　　　// 转发成功之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
		　　　　　　}
		　　　　},
		　　　　fail: function(){
		　　　　　　// 转发失败之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
		　　　　　　　　// 用户取消转发
		　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
		　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
		　　　　　　}
		　　　　},
		　　　　complete: function(){
		　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
		　　　　}
		　　};
		　　// 来自页面内的按钮的转发
		　　if( options.from == 'button' ){
		　　　　var eData = options.target.dataset;
		　　　　console.log( eData.name );     // shareBtn
		　　　　// 此处可以修改 shareObj 中的内容
				shareObj.path = '/pages/index/index?code=' + code
		　　}
		　　// 返回shareObj
		　　return shareObj;
		},
		onLoad(options) {
			this.spuId = options.spuId
			this.getGoodsDetail()
			// if(this.spuId > 0) {
			// 	this.getGoodsDetail()
			// } else {
			// 	this.navigationBarStyle.iconText = this.goodsDetail.brandName
			// 	//处理富文本图片自适应
			// 	let item = this.deepCopy(this.goodsDetail)
			// 	item.detailInfo = item.detailInfo.replace(/<img/gi, '<img width="100%!important" ')
			// 	this.$store.commit('setGoodsDetail', item)
			// 	this.getData()
			// }
		},
		onShow() {
			const value = uni.getStorageSync('userInfo')
			if (value) {
				this.userInfo = value
				this.isVip = uni.getStorageSync('isVip')
				//如果从本地获取的值不是vip，就请求用户信息看是否为vip会员
				if(this.isVip != 1) {
					let that = this
					interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
						that.vip = res.data.is_vip
						uni.setStorageSync('isVip', that.vip)
					});
				}
			}
		},
		methods: {
			touch() {},
			startShare() {
				this.isShow = true
				//调用子组件的方法
				this.$refs.share.getQrcode();
			},
			chooseProps(index, i) {
				this.propsCheck[index] = i
				//更改库存
				let element = this.judgeCode()
				this.inventoryCount = element ? element.inventoryCount : 0
				this.skuChooseItem = element ? element : {}
			},
			getGoodsDetail() {
				let that = this;
				let params = {
					spuId: this.spuId //115199
				}
				interfaceurl.checkAuth(interfaceurl.goodsDetail, params, false).then((res) => {
					that.goodsDetail = res.data
					that.goodsDetail.shareImg = that.goodsDetail.detailImgUrlList[0]
					that.navigationBarStyle.iconText = that.goodsDetail.brandName
					that.goodsDetail.detailInfo = that.goodsDetail.detailInfo.replace(/<img/gi, '<img width="100%!important" ')
					that.getData()
				});
			},
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
				this.skuChooseItem = element ? element : {}
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
				let that = this
				const shopItem = {
					spuId: item.spuId,
					price: this.isVip != 1 ? that.skuChooseItem.retailPrice : that.skuChooseItem.vipPrice,
					name: item.name,
					goodsPhotoUrl: item.mainImgUrl,
					quantity: this.shopNum,
					cartId: this.cartId,
					skuPropertyList: this.skuPropertyList
				}
				let shopList = []
				shopList.push(shopItem)
				this.$store.commit('setSelectOrderGoods', shopList)
				this.$store.commit('setSelectAddress', {})
				//uni.setStorageSync('shopList', shopList)
				this.$turnPage('/pages/shopping/trade/confirm-order' ,'navigateTo')
			}
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	.vip-upgrade {
		height: 60rpx;
		position: relative;
		.vipbg {
			height: 100%;
			width: 100%;
			position: absolute;
		}
		.vip {
			width: 100%;
			position: absolute;
			.vipdesc{
				color: #FFFFFF;
				font-size: 24rpx;
				margin: 0 20rpx;
			}
			.vipbtn {
				width:140rpx;
				height:40rpx;
				background:rgba(240,36,61,1);
				border-radius:20rpx;
			}
		}
	}
	
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
		font-size: 36rpx;
		// margin-top: 20rpx;
		color: #ff0033;
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
		box-sizing: border-box;
		display: flex;
		color: #666666;
		background: white;
	}

	.shop-btn {
		width: 230upx;
		height: 100%;
		color: #ffffff;
		line-height: 100upx;
		text-align: center;
		background: #333333;
	}

	.pay-btn {
		width: 230upx;
		height: 100%;
		color: #ffffff;
		line-height: 100upx;
		text-align: center;
		background: #ff0033;
	}

	.detail-bottom-left {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666666;
		background: white;
	}

	.share-icon {
		width: 32rpx;
		height: 32rpx;
	}

	.detail-bottom-item {
		width: 130rpx;
		height: 100rpx;
		text-align: center;
		font-size: 26upx;
		// position: relative;
		line-height: 0.1;
	}
	.mask {
		background: #4B4B4B;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 200;
		opacity: 0.9;
		/*避免其他页面元素使用定位引发的位置偏移*/
		top: 0;
	}
	.confirm-modal-content {
		width: 100%;
		background: #ffffff;
		box-sizing: border-box;
		position: fixed;
		left: 0px;
		bottom: 0px;
		padding: 30upx;
		border-radius: 20upx 20upx 0upx 0upx;
		z-index: 300;
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
		background: #ff0033;
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
