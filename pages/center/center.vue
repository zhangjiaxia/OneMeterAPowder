<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle" :showBack="false"></navigationBar>
		</view>
		<view class="uni-flex topitem vertical">
			<image src="/static/bg.png" class="bg"></image>
			<authPage>
				<view class="uni-flex uni-row info">
					<view class="uni-flex">
						<image :src="userInfo.avatarUrl || '/static/head.png'" class="head"></image>
					</view>
					<view class="uni-flex uni-column rest">
						<view class="nick">
							{{userInfo.nickName || '御翔绝瞬'}}
							<image src="/static/goldactive.png" class="gold" v-if="userDetail.is_vip==1"></image>
							<image src="/static/gold.png" class="gold" v-else></image>
						</view>
						<view @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
							<!-- <image src="/static/common.png" class="rate" style="margin-right: 10rpx;"></image> -->
							<image src="/static/silver.png" class="rate" v-if="userDetail.is_vip==1"></image>
							<image src="/static/coconel.png" class="rate" v-else></image>
						</view>
						<view class="idnumber">ID:{{userDetail.invitation_code}}</view>
						<!-- v-if="userDetail.is_vip==1"-->
						<view class="time">VIP会员到期时间：{{userDetail.vip_valid_date || '2021-4-16 21:56:40'}}</view>
					</view>
				</view>
			</authPage>
		</view>
		<authPage>
			<view class="uni-flex uni-row vertical commission" @click="$turnPage('/pages/center/my/cash', 'navigateTo')">
				<view class="uni-flex uni-column rest" style="margin-left: 50rpx;">
					<view class="price">{{userDetail.profit}}</view>
					<view class="canapply">可提佣金</view>
				</view>
				<view class="uni-flex content apply">
					点击提现
				</view>
			</view>
		</authPage>
		<view class="uni-flex uni-column manage">
			<authPage>
				<view class="uni-flex uni-row vertical order" @click="$turnPage('/pages/shopping/trade/order?status=0', 'navigateTo')">
					<view class="uni-flex rest orderManage">订单管理</view>
					<view class="uni-flex">
						<view class="icon-qianjin back"></view>
					</view>
				</view>
			</authPage>
			<authPage>
				<view class="uni-flex uni-row" style="height: 150rpx;padding-bottom: 28rpx;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?status=1', 'navigateTo')">
						<image src="/static/waitPay.png" style="width: 56rpx;height: 52rpx;"></image>
						<!-- <view class="icon-daizhifu icon icon-active"></view> -->
						<view class="title">待支付</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?status=2', 'navigateTo')">
						<image src="/static/sendGoods.png" style="width: 58rpx;height: 53rpx;"></image>
						<!-- <view class="icon-daifahuo icon icon-active"></view> -->
						<view class="title">待发货</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?status=3', 'navigateTo')">
						<image src="/static/waitGoods.png" style="width: 63rpx;height: 48rpx;"></image>
						<!-- <view class="icon-daishouhuo icon icon-active"></view> -->
						<view class="title">待收货</view>
					</view>
					<view class="uni-flex rest content" style="position: relative;">
						<image src="/static/afterSale.png" style="width: 57rpx;height: 52rpx;"></image>
						<!-- <view class="icon-tubiaolunkuo- icon icon-active"></view> -->
						<view class="title">售后</view>
						<button open-type='contact' class="concact">联系客服</button>
					</view>
				</view>
			</authPage>
		</view>
		<view class="uni-flex uni-column manage">
			<view class="uni-flex uni-row vertical order">
				<view class="uni-flex rest orderManage">我的服务</view>
			</view>
			<authPage>
				<view class="uni-flex uni-row" style="height: 150rpx;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/my-points', 'navigateTo')">
						<image src="/static/commission.png" class="icon"></image>
						<!-- <view class="icon-tixianmingxi icon"></view> -->
						<view class="title">积分明细</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
						<image src="/static/commissionsubsidiary.png" class="icon"></image>
						<!-- <view class="icon-tixianmingxi icon"></view> -->
						<view class="title">佣金明细</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
						<image src="/static/team.png" class="icon"></image>
						<!-- <view class="icon-wodetuandui icon"></view> -->
						<view class="title">我的团队</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/income-record', 'navigateTo')">
						<image src="/static/withdrawdetail.png" class="icon"></image>
						<!-- <view class="icon-tixianmingxi icon"></view> -->
						<view class="title">提现明细</view>
					</view>
				</view>
				<view class="uni-flex uni-row" style="margin: 28rpx 0;">
					<view class="uni-flex rest content" @click="shareModal=true;getQrcode()">
						<image src="/static/my-share.png" class="icon"></image>
						<view class="title">推广分享</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/address', 'navigateTo')">
						<image src="/static/address.png" class="icon"></image>
						<!-- <view class="icon-dizhi1 icon"></view> -->
						<view class="title">收货地址</view>
					</view>
					<view class="uni-flex rest content" style="position: relative;">
						<image src="/static/service.png" class="icon"></image>
						<!-- <view class="icon-kefu icon"></view> -->
						<view class="title">联系客服</view>
						<button open-type='contact' class="concact">联系客服</button>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/about', 'navigateTo')">
						<image src="/static/about.png" class="icon"></image>
						<!-- <view class="icon-about icon"></view> -->
						<view class="title">关于我们</view>
					</view>
				</view>
			</authPage>
		</view>
		<!--海报分享-->
		<!--分享弹窗:style="{top: panelTop}"-->
		<view class="uni-flex uni-column content share-panel" :style="{top: panelTop}"  v-if="shareModal"
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
		<view class="mask" v-show="shareModal" @click="shareModal=false;" @touchmove.stop.prevent="touch"></view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
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
		computed: mapState(['userInfos']),
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
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '我的' //导航栏文字
				},
				userInfo: {}, //获取用户信息
				userDetail: {}, //获取用户详情
			}
		},
		watch:{
			userInfos(val) {
				//用户的授权信息存本地，全局变量是为了第一次授权时快速响应
				if(val) {
					this.userInfo = uni.getStorageSync('userInfo')
				}
			}
		},
		onLoad() {
			//计算弹窗距离顶部的距离
			this.getPanelTop()
		},
		onShow() {
			let token = uni.getStorageSync('token')
			this.userInfo = this.userInfos.nickName ? this.userInfos : uni.getStorageSync('userInfo')
			if(token) {
				this.getUserDetail()
			}
		},
		methods: {
			//获取用户详情
			getUserDetail() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
					that.userDetail = res.data
				});
			},
			/*海报相关*/
			//获取动态二维码（可携带参数）
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
				  ctx.fillRect(0,0,800,800); //填充白色区域的范围
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
				ctx.fillText(userInfo.nickName+" 为您推荐了每日有薪商城", 25 / this.systemInfo.pixelRatio, 680 / this.systemInfo.pixelRatio) //开始绘制文本的 x/y 坐标位置（相对于画布） 
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
				console.log('画布宽高',canvasW,canvasH)
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
		background: #F7F4F8;
	}
	.topitem {
		height: 220rpx;
		position: relative;
		.bg {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
	}
	.info {
		width: 100%;
		view {
			line-height: 1.5;
		}
		.head {
			width: 120rpx;
			height: 120rpx;
			margin-left: 50rpx;
			margin-right: 20rpx;
			border-radius: 50%;
		}
		.rate {
			width: 60rpx;
			height: 30rpx;
		}
		.arrow {
			width: 17rpx;
			height: 26rpx;
		}
		.nick {
			font-size:30rpx;
			color: #FFFFFF;
			.gold {
				width: 40rpx;
				height: 31rpx;
				margin-left: 16rpx;
			}
		}
		.idnumber {
			color: #FFFFFF;
			font-size: 20rpx;
		}
		.time {
			font-size:20rpx;
			color: #FFFFFF;
		}
	}
	.commission {
		width:100%;
		height:100rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 11px 0px rgba(4,0,0,0.06);
		margin: 20rpx 0;
		view {
			line-height: 1.2;
		}
		.price {
			color: #0071CF;
			font-weight: bold;
			font-size: 36rpx;
		}
		.canapply {
			color: #A9A6A9;
			font-size: 22rpx;
		}
		.apply {
			width:150rpx;
			height:50rpx;
			background:rgba(0,113,207,1);
			border-radius:25rpx;
			color: #FFFFFF;
			margin-right: 30rpx;
		}
	}
	.manage {
		background: #FFFFFF;
		margin-bottom: 20rpx;
		.order {
			border-bottom: 1px solid #F9F7F9;
			height: 80rpx;
			.orderManage {
				font-size: 30rpx;
				color: #333333;
				margin-left: 30rpx;
			}
			.back {
				font-size: 26rpx !important;
				margin-right: 30rpx;
			}
		}
		.title {
			font-size: 24rpx;
			color: #333333;
			margin-top: 10rpx;
		}
		.icon {
			// font-size: 60rpx;
			// color: #333333;
			width: 60rpx;
			height: 60rpx;
		}
		.icon-active {
			color: #0071CF;
		}
	}
	.concact {
		position: absolute;
		width: 100rpx;
		height: 110rpx;
		top: 0;
		opacity: 0;
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
