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
					<view class="detail-bottom-item" @click="shareModal=true;getQrcode()">
						<!-- <image src="/static/share-icon.png" class="share-icon"></image> -->
						<view class="icon-fenxiang " style="font-size: 32rpx;"></view>
						<view>分享</view>
						<!-- <button type="primary" open-type="share" class="share-btn"></button> -->
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
		<!--购物车弹窗-->
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
		<!--分享弹窗-->
		<view class="uni-flex uni-column content share-panel" :style="{top: panelTop}" v-if="shareModal"
		 @touchmove.stop.prevent="touch">
			<!--将海报跟二维码通过画布组合到一起，展示在image中，下载图片-->
			<canvas class="canvas-poster" id="canvasPoster" style="width: 650rpx;height: 900rpx;" canvas-id="canvasPoster"></canvas>
			<image :src="poster" class="poster" style="width: 650rpx;height: 900rpx;position: absolute;top: 0;" @click="previewImg" alt="" v-if="poster"></image>
			<view class="uni-flex content share-btn" :style="{visibility: poster ? 'visible' : 'hidden'}" @click="saveImg">分享好友</view>
			<view class="share-img" @click="shareModal=false;">
				<image src="/static/close.png" class="share-img"></image>
			</view>
		</view>
		
		<!--弹窗时阻止滚动穿透-->
		<view class="mask" v-show="confirmModal || shareModal" @click="confirmModal=false;shareModal=false;" @touchmove.stop.prevent="touch"></view>
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
				panelTop: '130rpx', //弹窗与顶部的距离
				shareModal: false, //是否显示分享弹窗
				//画布绘制所需的图片
				shareInfo: {
					bgImg: '/static/bussiness.png',
					qrcode: '' //动态生成的二维码
				},
				//画布的宽高
				width: 0,
				height: 0,
				systemInfo: {}, //系统信息
				poster: '', //生成的海报
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
				bannerList: ['/static/banner.png'],
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
				//goodsDetail: {}, //商品详情，暂时
				cartOrOrder: true, //加入购物车：true,下单：false
				inventoryCount: 0, //各组sku的库存量
				cartId: '' //购物车ID
			}
		},
		// onShareAppMessage(res) {
		// 	return {
		// 		title: '一米一粉',
		// 		path: '/pages/shop-detail/shop-detail?id=' + this.id + '&code=' + this.invitation_code,
		// 		imageUrl: '/static/share-banner.png'
		// 	}
		// },
		onLoad(options) {
			//计算弹窗距离顶部的距离
			const systemInfo = uni.getSystemInfoSync();
			this.systemInfo = systemInfo
			let pxToRpxScale = 750 / systemInfo.windowWidth;
			this.systemInfo.pxToRpxScale = pxToRpxScale
			//滚动区域等于窗体高度（不包含底部tab高度）-状态栏高度-导航栏高度
			let scrollHeight = (systemInfo.windowHeight - systemInfo.statusBarHeight - 44) * pxToRpxScale
			//（滚动区域高度-弹窗高度）/2+状态栏高度+导航栏高度
			this.panelTop = ((scrollHeight - 1068) / 2 + (systemInfo.statusBarHeight + 44) * pxToRpxScale) + 'rpx'
			this.shareInfo.bgImg = this.goodsDetail.mainImgUrl
			
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
			},
			/*海报相关*/
			//获取动态二维码（可携带参数）
			getQrcode() {
				if(this.poster) {
					return;
				}
				let that = this;
				interfaceurl.checkAuth(interfaceurl.getAppletCode, {}).then((res) => {
					that.saveQrCode(res.data.url)
				});
			},
			// 保存接口传回来的小程序二维码链接
			saveQrCode(url) {
				let that = this;
				wx.downloadFile({
					url: url, //网络链接
					success: function(res) {
						// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
						if (res.statusCode === 200) {
							//将下载的图片临时路径赋值给img_l,用于预览图片
							that.shareInfo.qrcode = res.tempFilePath;
							wx.downloadFile({
								url: that.shareInfo.bgImg, //网络链接
								success: function(res) {
									// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
									if (res.statusCode === 200) {
										//将下载的图片临时路径赋值给img_l,用于预览图片
										that.shareInfo.bgImg = res.tempFilePath;
										console.log('that.drawBefore', that.shareInfo)
										that.drawBefore();
									}
								}
							})
						}
					}
				})
			},
			drawBefore() {
				let that = this;
				var query = wx.createSelectorQuery()
				query.select('#canvasPoster').boundingClientRect((res) => {
					// 返回值包括画布的实际宽高
					that.drawImage(res);
				}).exec();
			},
			// 保存海报
			saveImg(e) {
				let that = this
				uni.showLoading({
					title: '保存中...'
				})
				wx.downloadFile({
					url: that.poster,
					success: function(res) {
						//图片保存到本地
						wx.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(data) {
								wx.hideLoading()
								wx.showModal({
									title: '提示',
									content: '您的推广海报已存入手机相册，赶快分享给好友吧',
									showCancel: false,
								})
							},
							fail: function(err) {
								if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg ===
									"saveImageToPhotosAlbum:fail auth deny") {
									// 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
									wx.showModal({
										title: '提示',
										content: '需要您授权保存相册',
										showCancel: false,
										success: modalSuccess => {
											wx.openSetting({
												success(settingdata) {
													console.log("settingdata", settingdata)
													if (settingdata.authSetting['scope.writePhotosAlbum']) {
														wx.showModal({
															title: '提示',
															content: '获取权限成功,再次点击图片即可保存',
															showCancel: false,
														})
													} else {
														wx.showModal({
															title: '提示',
															content: '获取权限失败，将无法保存到相册哦~',
															showCancel: false,
														})
													}
												},
												fail(failData) {
													console.log("failData", failData)
												},
												complete(finishData) {
													console.log("finishData", finishData)
												}
											})
										}
									})
								}
							},
							complete(res) {
								uni.hideLoading()
							}
						})
					}
				})
			},
			previewImg() {
				console.log('previewImg')
				if (this.poster) {
					//预览图片，预览后可长按保存或者分享给朋友
					wx.previewImage({
						urls: [this.poster]
					})
				}
			},
			drawImage(canvasAttrs) {
				let that = this;
				let ctx = wx.createCanvasContext('canvasPoster', this)
				let canvasW = that.width // 画布的真实宽度660canvasAttrs.width
				let canvasH = that.height //画布的真实高度980canvasAttrs.height
				// 头像和二维码大小都需要在规定大小的基础上放大像素比的比例后面都会 *this.systemInfo.pixelRatio
				this.systemInfo.pixelRatio = this.systemInfo.pxToRpxScale
				let qrcodeW = 160 / this.systemInfo.pixelRatio
				let rate = this.systemInfo.pixelRatio
				let radius = 10 * rate
				 // 白色背景
				  ctx.beginPath();
				  ctx.save();
				  ctx.setLineWidth(1)
				  ctx.setStrokeStyle('#fff')
				  ctx.moveTo(0/rate,0/rate);           // 创建开始点
				ctx.lineTo(650/rate,0/rate);          // 创建水平线
				//ctx.arcTo(630*rate,0*rate,650*rate,20*rate,radius); // 创建弧
				//ctx.lineTo(162.5*rate,5*rate); 
				
				ctx.lineTo(650/rate,900/rate);         // 创建垂直线
				//ctx.arcTo(650*rate,880*rate,630*rate,900*rate,radius); // 创建弧
				//ctx.lineTo(157.5*rate,225*rate); 
				
				ctx.lineTo(0/rate,900/rate);         // 创建水平线
				//ctx.arcTo(20*rate,900*rate,0*rate,880*rate,radius); // 创建弧
				//ctx.lineTo(0*rate,220*rate); 
				
				ctx.lineTo(0/rate,0/rate);         // 创建垂直线
				//ctx.arcTo(0*rate,20*rate,20*rate,0*rate,radius); // 创建弧
				//ctx.lineTo(5*rate,0*rate); 
				  ctx.closePath()
				  ctx.clip();
				  ctx.fillStyle="#fff";
				  ctx.fillRect(0,0,500,500);
				  ctx.stroke();
				  ctx.restore();
				//海报图片
				ctx.drawImage(this.shareInfo.bgImg, 25 / this.systemInfo.pixelRatio, 25 / this.systemInfo.pixelRatio, 600 / this.systemInfo
					.pixelRatio, 600 / this.systemInfo.pixelRatio)
				ctx.save()
				ctx.beginPath();
				ctx.setLineDash([2,3]);
				ctx.strokeStyle = '#D3D1D2';
				//设置开始坐标
				ctx.moveTo(0,708 / this.systemInfo.pixelRatio);
				//设置结束坐标
				ctx.lineTo(650,708 / this.systemInfo.pixelRatio);
				//绘制虚线
				ctx.stroke();
				//文字绘制
				ctx.setFillStyle('#333333') // 文字颜色：黑色
				ctx.setFontSize(30 / this.systemInfo.pixelRatio) // 文字字号：22px
				let userInfo = uni.getStorageSync('userInfo')
				ctx.fillText(userInfo.nickName+" 为您推荐好货", 25 / this.systemInfo.pixelRatio, 680 / this.systemInfo.pixelRatio) //开始绘制文本的 x/y 坐标位置（相对于画布） 
				ctx.stroke(); //stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色
				//文字绘制
				ctx.setFillStyle('#333333')
				ctx.setFontSize(30 / this.systemInfo.pixelRatio)
				ctx.fillText("长按识别小程序二维码", 264 / this.systemInfo.pixelRatio, 767 / this.systemInfo.pixelRatio)
				ctx.stroke();
				//文字绘制
				ctx.setFillStyle('#666666')
				ctx.setFontSize(24 / this.systemInfo.pixelRatio)
				ctx.fillText("立即抢购", 365 / this.systemInfo.pixelRatio, 812 / this.systemInfo.pixelRatio)
				ctx.stroke();
				// 绘制二维码
				//ctx.drawImage(this.shareInfo.qrcode, qrcodeX, qrcodeY, qrcodeW, qrcodeW)
				ctx.drawImage(this.shareInfo.qrcode, 60 / this.systemInfo.pixelRatio, 720 / this.systemInfo.pixelRatio, qrcodeW, qrcodeW)
				ctx.save()
				// 将前面绘制的各个图案一起画出来
				ctx.draw()
				setTimeout(() => {
					//下面的13以及减26推测是因为在写样式的时候写了固定的zoom: 50%而没有用像素比缩放导致的黑边，所以在生成时进行了适当的缩小生成，这个大家可以自行尝试
					wx.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: canvasW,
						height: canvasH,
						destWidth: canvasW,
						destHeight: canvasH,
						canvasId: 'canvasPoster',
						success: (res) => {
							that.poster = res.tempFilePath
							console.log('that.poster', that.poster)
							uni.hideLoading();
						}
					})
				}, 200)
			}
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
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

	// .share-btn {
	// 	width: 100%;
	// 	height: 100%;
	// 	position: absolute;
	// 	left: 0px;
	// 	top: 0px;
	// 	opacity: 0;
	// }

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
	/*海报分享*/
	.share-panel {
		width: 650rpx;
		position: fixed;
		top: 136rpx;
		z-index: 200;
		left: 50rpx;
	
		.share-poster {
			width: 100%;
			height: 900rpx;
			border-radius: 20rpx;
			background: rgba(255, 255, 255, 1);
	
			.share-mainimg {
				width: 600rpx;
				height: 600rpx;
			}
	
			.share-space {
				width: 600rpx;
				margin: 0 auto;
	
				.qrcode {
					margin-left: 65rpx;
					margin-right: -50rpx;
	
					.share-qrcode {
						width: 160rpx;
						height: 160rpx;
					}
				}
	
				.press {
					font-size: 30rpx;
					color: #333333;
				}
	
				.atonce {
					font-size: 24rpx;
					color: #666666;
				}
			}
	
			.share-id {
				height: 83rpx;
				font-size: 30rpx;
				color: #333333;
				border-bottom: 1px dashed grey;
				padding-left: 25rpx;
			}
		}
	
		.share-btn {
			width: 400rpx;
			height: 80rpx;
			background: rgba(0, 113, 207, 1);
			border-radius: 40rpx;
			color: #FFFFFF;
			margin-top: 12rpx;
			margin-bottom: 12rpx;
		}
	
		.share-img {
			width: 64rpx;
			height: 64rpx;
		}
	}
</style>
