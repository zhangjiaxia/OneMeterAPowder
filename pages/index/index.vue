<template>
	<view class="container">
		<view>
			<navigationBar custom="true">
				<view class="uni-flex uni-row content search-bar">
					<view class="search-img">
						<image src="/static/logo.png" class="icon-logo"></image>
					</view>
					<view class="">
						<view class="uni-flex uni-row vertical search" @click="$turnPage('/pages/category/search/search', 'navigateTo')">
							<view class="icon-search search-icon"></view>
							<text>搜索</text>
						</view>
					</view>
				</view>
			</navigationBar>
			<view style="position: relative;height: 290rpx;">
				<view class="bgColor"></view>
				<swiper class="banner-swiper" :autoplay="autoplay" circular :interval="interval" :duration="duration">
					<swiper-item v-for="(item,index) in bannerList" :key="index">
						<image :src="item.bannerUrl" class="banner-img"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="tab-list" style="background: #F0EDF1;margin-bottom: -10rpx;">
				<view class="advantage-item">
					<text>VIP购物</text>
				</view>
				<view class="advantage-item">
					<text>源头直供</text>
				</view>
				<view class="advantage-item">
					<text>消费创业</text>
				</view>
				<view class="advantage-item">
					<text>积分配股</text>
				</view>
			</view>
			<view class="tab-list" style="padding-top: 40rpx;background: #FFFFFF;">
				<view v-for="(item,index) in iconTypeList" :key="index" class="tab-item" @click="shopListPage(item)">
					<authPage>
						<image :src="item.iconTypeUrl" class="type-icon"></image>
						<view class="classify">{{item.iconTypeName}}</view>
					</authPage>
				</view>
			</view>
			<view class="type-list">
				<!-- :style="{'width': index == 0 || index == 1 ? '710rpx' : '350rpx','margin-left': index==3 ? '10rpx' : '0'}"-->
				<view class="type-item" :style="{'margin-right': index % 2 == 0 ? '10rpx' : '0'}"
					v-for="(item, index) in specialAreaPicList" :key="index">
					<image :src="item.specialImgUrl"></image>
				</view>
			</view>
			<view class="category-list">
				<view class="category-item" v-for="(item,index) in specialAreaTextList" :key="index" @click="selectTab(index, item.isGoods)">
					<view><text :class="{'category-item-active':tabIndex == index}">{{item.specialName}}</text></view>
					<view><text class="category-item-text" :class="{'category-text-active':tabIndex == index}">{{item.specialTitle}}</text></view>
				</view>
			</view>
		</view>
		<view class="space">
			<view class="goods" :style="{'margin-right': index % 2 == 0 ? '20rpx' : '0'}" v-if="isGoods == 1" v-for="(item, index) in specialGoodsList"
			 :key="index" @click="shopDetailPage(item)">
				<view style="width: 100%;">
					<image :src="item.mainImgUrl" class="goodsimg"></image>
				</view>
				<view class="title">{{item.name.substring(0,10) + '...'}}</view>
				<view class="price">
					<text style="font-size: 24rpx;">￥</text>
					<text>{{item.retailPrice[0]}}</text>
				</view>
			</view>
			<view class="goods" :style="{'margin-right': index % 2 == 0 ? '20rpx' : '0'}" v-if="isGoods == 0" v-for="(item, index) in championList"
			 :key="index" @click="shopDetailPage(item)">
				<view style="width: 100%;">
					<image :src="item.mainImgUrl" class="goodsimg"></image>
				</view>
				<view class="title">{{item.name.substring(0,10) + '...'}}</view>
				<view class="price">
					<text style="font-size: 24rpx;">￥</text>
					<text>{{item.retailPrice[0]}}</text>
				</view>
			</view>
		</view>
		<!-- <authPage> -->
			<view class="share">
				<authPage>
				<image src="/static/share.png" @click="shareModal=true;getQrcode()"></image>
				</authPage>
				<!-- <button open-type="share" class="sharebtn"></button> @click="$turnPage('/pages/index/business/poster', 'navigateTo')" -->
			</view>
		<!-- </authPage> -->
		<!--分享弹窗-->
		<view class="uni-flex uni-column content share-panel" :style="{top: panelTop}" v-if="shareModal"
		 @touchmove.stop.prevent="touch">
			<!--将海报跟二维码通过画布组合到一起，展示在image中，下载图片-->
			<canvas class="canvas-poster" id="canvasPoster" style="width: 650rpx;height: 900rpx;" canvas-id="canvasPoster"></canvas>
			<image :src="poster" class="poster" style="width: 650rpx;height: 900rpx;position: absolute;top: 0;" @click="previewImg" alt="" v-if="poster"></image>
			<!-- <view class="share-poster">
				<view style="share-space">
					<view class="uni-flex content" style="margin-top: 25rpx;">
						<image src="/static/bussiness.png" class="share-mainimg"></image>
					</view>
				</view>
				<view class="uni-flex vertical share-id">ID:242434 为您推荐了一米一粉商城</view>
				<view class="share-space">
					<view class="uni-flex uni-row vertical" style="height: 191rpx;">
						<view class="qrcode">
							<image src="/static/bg.png" class="share-qrcode"></image>
						</view>
						<view class="uni-flex uni-column rest content">
							<view class="press">长按识别小程序二维码</view>
							<view class="atonce">立即抢购</view>
						</view>
					</view>
				</view>
			</view> -->
			<view class="uni-flex content share-btn" :style="{visibility: poster ? 'visible' : 'hidden'}" @click="saveImg">分享好友</view>
			<view class="share-img" @click="shareModal=false;">
				<image src="/static/close.png" class="share-img"></image>
			</view>
		</view>
		<!--弹窗时阻止滚动穿透-->
		<view class="mask" v-show="shareModal" @click="shareModal=false;" @touchmove.stop.prevent="touch"></view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	export default {
		components: {
			navigationBar,
			authPage
		},
		data() {
			return {
				panelTop: '130rpx', //弹窗与顶部的距离
				shareModal: false, //是否显示分享弹窗
				//画布绘制所需的图片
				shareInfo: {
					bgImg: 'https://early-education.oss-cn-beijing.aliyuncs.com/meter_power/default/20200415/adca2eb7dab97a2c39a53f1515128588.png',
					qrcode: '' //动态生成的二维码
				},
				//画布的宽高
				width: 0,
				height: 0,
				systemInfo: {}, //系统信息
				poster: '', //生成的海报
				//轮播图参数
				indicatorDots: true,
				autoplay: false,
				interval: 3000,
				duration: 500,
				//invitation_code: '', //分销邀请码
				bannerList: ['/static/banner.png'], //轮播图
				iconTypeList: [], //小图标
				specialAreaPicList: [], //专区图片
				specialAreaTextList: [], //专区文字
				tabIndex: 0, //选择的专区索引
				specialGoodsData: {}, //专区商品数据
				specialGoodsList: [], //专区商品列表
				params: {
					page: 1,
					size: 10,
					specialId: 0 //选择的专区索引
				}, //专区商品参数
				championData: {}, //销量冠军数据
				championList: [], //销量冠军列表
				isGoods: 1 //判断是否为销量冠军，0是，1不是
			}
		},
		// onShareAppMessage(res) {
		// 	return {
		// 		title: '一米一粉',
		// 		path: '/pages/index/index?code=' + this.invitation_code,
		// 		imageUrl: '/static/banner.png'
		// 	}
		// },
		onLoad(options) {
			console.log('获取场景值')
			// scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			const scene = decodeURIComponent(options.scene)
			console.log(scene)
			//绑定上下级关系
			this.bindUser(scene)
			//计算弹窗距离顶部的距离
			this.getPanelTop()
			//获取首页数据
			this.getBannerList()
			this.getIconTypeList()
			this.getSpecialAreaList(1)
			this.getSpecialAreaList(2)
			this.tabIndex = 0
			this.specialGoodsData = {}
			this.specialGoodsList = []
		},
		onShow() {

		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.isGoods == 0) {
				if (this.championList.length >= this.championData.total) {
					return;
				}
				this.params.page++;
				this.getChampionList()
			} else {
				if (this.specialGoodsList.length >= this.specialGoodsData.total) {
					return;
				}
				this.params.page++;
				this.getSpecialGoodsList()
			}
		},
		methods: {
			touch() {},
			getPanelTop() {
				const systemInfo = uni.getSystemInfoSync();
				this.systemInfo = systemInfo
				let pxToRpxScale = 750 / systemInfo.windowWidth;
				this.systemInfo.pxToRpxScale = pxToRpxScale
				// console.log('pixelRatio', systemInfo.pixelRatio)
				// console.log('pxToRpxScale', pxToRpxScale)
				//滚动区域等于窗体高度（不包含底部tab高度）-状态栏高度-导航栏高度
				let scrollHeight = (systemInfo.windowHeight - systemInfo.statusBarHeight - 44) * pxToRpxScale
				//（滚动区域高度-弹窗高度）/2+状态栏高度+导航栏高度
				this.panelTop = ((scrollHeight - 1068) / 2 + (systemInfo.statusBarHeight + 44) * pxToRpxScale) + 'rpx'
			},
			//获取二维码携带的参数值并绑定下级
			bindUser(scene) {
				let that = this
				let baseUrl = 'https://api-emi.bidou88.cn/api'
				uni.login({
				  success (res) {
				    if (res.code) {
						//这里直接用原生请求就行了
						uni.request({
							url: `${baseUrl}/v1/login/getToken`,
							data: {
							  code: res.code
							},
							success (res) {
								if(res.data.code != 0) {
									uni.showToast({
										title: res.data.msg,
										icon: 'none',
										duration: 2000
									});
									return;
								}
								console.log('授权成功')
								let loginResp = res.data.data;
								uni.setStorageSync('token', loginResp.token)
								that.$store.commit('updateToken', loginResp.token)
								//如果存在分享id
								if(scene != 'undefined' && scene != '') {
									let that = this;
									interfaceurl.checkAuth(interfaceurl.bingUser, {scene_value: scene}, false).then((res) => {
										console.log("绑定成功");
										uni.setStorageSync("bind", scene)
									});
								}
							},
							fail(res) {
								interfaceurl.showErr(res)
							}
						})
				    } else {
				      uni.showToast({
						  title: '登录失败！' + res.errMsg,
						  icon: 'none',
						  duration: 2000
				      });
				    }
				  }
				})
			},
			selectTab(index, isGoods) {
				this.tabIndex = index
				this.isGoods = isGoods
				this.initData()
			},
			shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail', 'navigateTo')
			},
			shopListPage(item) {
				switch (item.link) {
					case '1':
						this.$turnPage('/pages/vip/rule/vip-mainrule', 'navigateTo')
						break;
					case '2':
						this.$turnPage('/pages/index/business/original-equity', 'navigateTo')
						break;
					case '3':
						this.$turnPage('/pages/vip/rule/vip-index', 'navigateTo')
						break;
					case '4':
						this.$turnPage('/pages/index/business/Integral-stake', 'navigateTo')
						break;
					case '5':
						this.$turnPage('/pages/index/business/business-school', 'navigateTo')
						break;
					default:
						this.$turnPage('/pages/category/search/goods-list?cateId=' + item.link + '&cateName=' + item.iconTypeName,
							'navigateTo')
				}
			},
			//获取轮播图
			getBannerList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.bannerList, {}, false).then((res) => {
					that.bannerList = res.data
				});
			},
			//获取分类小图标
			getIconTypeList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.iconTypeList, {}, false).then((res) => {
					that.iconTypeList = res.data
				});
			},
			//获取专区1:图片位置2:标题位置
			getSpecialAreaList(specialType) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.specialAreaList, {
					specialType: specialType
				}, false).then((res) => {
					if (specialType == 1) {
						that.specialAreaPicList = res.data
					} else {
						that.specialAreaTextList = res.data
						//设置第一个tab的类型（判断是否为销售冠军）
						that.isGoods = that.specialAreaTextList[0].isGoods
					}
					if (that.specialAreaTextList.length > 0) {
						that.initData();
					}
				});
			},
			initData() {
				//重置分页参数
				this.specialGoodsData = {}
				this.specialGoodsList = []
				this.params.page = 1
				if (this.isGoods == 0) {
					this.getChampionList();
				} else {
					this.getSpecialGoodsList();
				}
			},
			//获取专区商品列表
			getSpecialGoodsList() {
				let that = this;
				that.params.specialId = that.specialAreaTextList[that.tabIndex].specialId
				interfaceurl.checkAuth(interfaceurl.specialGoodsList, this.params, false).then((res) => {
					that.specialGoodsData = res.data
					if (that.params.page == 1) {
						that.specialGoodsList = res.data.data
					} else {
						that.specialGoodsList = that.specialGoodsList.concat(res.data.data)
					}
				});
			},
			//销量冠军
			getChampionList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.championList, this.params, false).then((res) => {
					that.championData = res.data
					if (that.params.page == 1) {
						that.championList = res.data.data
					} else {
						that.championList = that.specialGoodsList.concat(res.data.data)
					}
				});
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
				console.log(that.poster)
				// wx.downloadFile({
				// 	url: that.poster,
				// 	success: function(res) {
						//图片保存到本地
						wx.saveImageToPhotosAlbum({
							filePath: that.poster, //res.tempFilePath,
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
					// },
					// fail: function(err) {
					// 	console.log('保存海报downloadFile',err)
					// }
				//})
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
				// 头像和二维码大小都需要在规定大小的基础上放大像素比的比例后面都会 / this.systemInfo.pixelRatio
				this.systemInfo.pixelRatio = this.systemInfo.pxToRpxScale
				let qrcodeW = 160 / this.systemInfo.pixelRatio
				let rate = this.systemInfo.pixelRatio
				let radius = 10 * rate
				 // 白色背景,canvas给画布设置圆角
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
				ctx.fillText(userInfo.nickName+" 为您推荐了一米一粉商城", 25 / this.systemInfo.pixelRatio, 680 / this.systemInfo.pixelRatio) //开始绘制文本的 x/y 坐标位置（相对于画布） 
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
				ctx.drawImage(this.shareInfo.qrcode, 60 / this.systemInfo.pixelRatio, 720 / this.systemInfo.pixelRatio, qrcodeW, qrcodeW)
				ctx.save()
				// 将前面绘制的各个图案一起画出来
				ctx.draw()
				setTimeout(() => {
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

	page {
		background: #F0EDF1;
	}

	.search-bar {
		width: 100%;
		position: relative;

		.search-img {
			position: absolute;
			left: 16rpx;
			top: 8rpx;
		}

		.icon-logo {
			width: 154rpx;
			height: 37rpx;
			margin-left: 30rpx;
			margin-right: 16rpx;
		}

		input {
			width: 330rpx;
			height: 50rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 2rpx 3rpx 0px rgba(255, 255, 255, 0.2);
			border-radius: 25rpx;
		}

		.search {
			width: 300upx;
			height: 60upx;
			background: #ffffff;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #000000;
		}
	}

	.bgColor {
		width: 100%;
		height: 160rpx;
		background: #0071CF;
		position: absolute;
		z-index: 10;
		top: 44;
	}

	.banner-swiper {
		width: 710rpx;
		height: 280rpx;
		position: absolute;
		z-index: 99;
		top: 20rpx;
		left: 20rpx;

		.banner-img {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
		}
	}

	.classify {
		font-size: 22rpx;
		color: #333333;
	}

	.sharebtn {
		height: 100rpx;
		position: relative;
		top: -110rpx;
		opacity: 0;
	}

	.search-container {
		height: 230upx;
		background: #0071CF;
		display: flex;
		padding: 30upx;
		box-sizing: border-box;
	}

	.logo {
		width: 160upx;
		height: 39upx;
		margin-right: 20upx;
		position: relative;
		top: 10upx;
	}

	.search-icon {
		font-size: 30rpx !important;
		color: #000000;
		margin-right: 10rpx;
		position: relative;
		top: 2px;
	}

	.swiper {
		width: 100%;
		height: 280upx;
	}

	.banner-img {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.advantage-item {
		flex: 1;
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}

	.advantage-icon {
		width: 69upx;
		height: 20upx;
	}

	.tab-list {
		padding: 20upx 30upx;
		display: flex;
		flex-wrap: wrap;
		// background: #ffffff;
		justify-content: space-between;
	}

	.tab-item {
		width: 120upx;
		text-align: center;
		color: #222222;
		font-size: 22upx;
		margin-bottom: 20upx;
	}

	.type-icon {
		width: 90upx;
		height: 90upx;
	}

	.type-list {
		padding: 20upx;
		// display: flex;
		// justify-content: space-between;
		// flex-wrap: wrap;
		background: #ffffff;
	}

	.type-item {
		width: 350upx;
		display: inline-flex;
	}

	.type-item image {
		width: 350rpx;
		height: 175rpx;
	}

	.shop-item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10upx;
	}

	.shop-item-price {
		font-weight: bold;
		color: #0071CF;
		font-size: 36upx;
	}

	.pay-btn {
		display: inline-block;
		width: 32upx;
		height: 32upx;
		line-height: 26upx;
		border-radius: 100%;
		text-align: center;
		color: #0071CF;
		color: #ffffff;
		background: #0071CF;
	}

	.share {
		width: 100upx;
		height: 100upx;
		border-radius: 100%;
		position: fixed;
		right: 30upx;
		bottom: 30upx;
	}

	.share image {
		width: 100upx;
		height: 100upx;
	}

	.category-list {
		display: flex;
		align-items: center;
		padding: 30upx;
		padding-top: 10upx;
		color: #333333;
		font-size: 32upx;
	}

	.category-item {
		flex: 1;
		text-align: center;
		view {
			line-height: 1.3;
		}
	}

	.category-item-text {
		font-size: 23upx;
		color: #999999;
	}

	.category-item-active {
		color: #0071CF;
		font-weight: bold;
	}

	.category-text-active {
		background: #0071CF;
		color: #FFFFFF;
		border-radius: 40rpx;
		padding: 4rpx 6rpx;
	}

	//商品列表
	.space {
		width: 700rpx;
		margin: 0rpx auto;

		.goods {
			width: 340rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			float: left;
			margin-bottom: 20rpx;

			.goodsimg {
				width: 340rpx;
				height: 340rpx;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
			}

			.title {
				font-size: 24rpx;
				color: #333333;
				margin: 10rpx;
			}

			.price {
				font-size: 30rpx;
				color: #0071CF;
				margin-left: 10rpx;
				margin-bottom: 20rpx;
			}

			view {
				line-height: 1.2;
			}
		}
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

	.mask {
		background: #4B4B4B;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 199;
		opacity: 0.9;
		/*避免其他页面元素使用定位引发的位置偏移*/
		top: 0;
	}
</style>
