<template>
	<view>
		<!--分享弹窗-->
		<view class="uni-flex uni-column content share-panel" :style="{top: panelTop}" v-if="shareModal" @touchmove.stop.prevent="touch">
			<!--将海报跟二维码通过画布组合到一起，展示在image中，下载图片-->
			<canvas class="canvas-poster" id="canvasPoster" style="width: 650rpx;height: 900rpx;" canvas-id="canvasPoster"></canvas>
			<image :src="poster" class="poster" style="width: 650rpx;height: 900rpx;position: absolute;top: 0;" @click="previewImg" alt="" v-if="poster"></image>
			<!-- <view class="share-poster">
				<view style="share-space">
					<view class="uni-flex content" style="margin-top: 25rpx;">
						<image src="/static/bussiness.png" class="share-mainimg"></image>
					</view>
				</view>
				<view class="uni-flex vertical share-id">ID:242434 为您推荐了每日有薪商城</view>
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
			<view class="uni-flex uni-row">
				<button open-type="share" class="share-btn wx-chat"  :style="{visibility: poster ? 'visible' : 'hidden'}">分享微信好友</button>
				<view class="uni-flex content share-btn" :style="{visibility: poster ? 'visible' : 'hidden'}" @click="saveImg">保存到相册</view>
			</view>
			<view class="share-img" @click="shareModal=false;">
				<image src="/static/close.png" class="share-img"></image>
			</view>
		</view>
		<!--弹窗时阻止滚动穿透-->
		<view class="mask" v-show="shareModal" @click="shareModal=false;"
		 @touchmove.stop.prevent="touch"></view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		props: {
			confirmModal: {
				type: Boolean,
				default: false
			}, //商品sku面板是否展示
			bgImg: {
				type: String,
				default: ''
			} //分享的海报图
		},
		data() {
			return {
				panelTop: '130rpx', //弹窗与顶部的距离
				shareModal: false, //是否显示分享弹窗
				//画布绘制所需的图片
				shareInfo: {
					bgImg: this.bgImg,
					qrcode: '' //动态生成的二维码
				},
				//画布的宽高
				width: 0,
				height: 0,
				systemInfo: {}, //系统信息
				poster: '', //生成的海报
			};
		},
		mounted() {
			//计算弹窗与顶部的距离
			this.getPanelTop()
		},
		methods: {
			touch() {},
			getPanelTop() {
				const systemInfo = uni.getSystemInfoSync();
				this.systemInfo = systemInfo
				let pxToRpxScale = 750 / systemInfo.windowWidth;
				this.systemInfo.pxToRpxScale = pxToRpxScale
				//滚动区域等于窗体高度（不包含底部tab高度）-状态栏高度-导航栏高度
				let scrollHeight = (systemInfo.windowHeight - systemInfo.statusBarHeight - 44) * pxToRpxScale
				//（滚动区域高度-弹窗高度）/2+状态栏高度+导航栏高度
				this.panelTop = ((scrollHeight - 1068) / 2 + (systemInfo.statusBarHeight + 44) * pxToRpxScale) + 'rpx'
			},
			/*海报相关*/
			//获取动态二维码（可携带参数）
			getQrcode() {
				this.shareModal = true
				if(this.poster) {
					return;
				}
				uni.showLoading()
				let qrcode = uni.getStorageSync('qrcode')
				//如果动态二维码存在，就直接下载文件，省去网络请求那一步
				if(qrcode) {
					this.saveQrCode(qrcode)
				} else {
					this.requestQrcode()
				}
			},
			requestQrcode() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.getAppletCode, {}).then((res) => {
					uni.setStorageSync('qrcode', res.data.url)
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
							that.saveBgImg()
							// wx.downloadFile({
							// 	url: that.shareInfo.bgImg, //网络链接
							// 	success: function(res) {
							// 		// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
							// 		if (res.statusCode === 200) {
							// 			//将下载的图片临时路径赋值给img_l,用于预览图片
							// 			that.shareInfo.bgImg = res.tempFilePath;
							// 			//console.log('that.drawBefore', that.shareInfo)
							// 			that.drawBefore();
							// 		}
							// 	}
							// })
						}
					}
				})
			},
			//保存背景图
			saveBgImg() {
				let that = this;
				wx.downloadFile({
					url: that.shareInfo.bgImg, //网络链接
					success: function(res) {
						// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
						if (res.statusCode === 200) {
							//将下载的图片临时路径赋值给img_l,用于预览图片
							that.shareInfo.bgImg = res.tempFilePath;
							//console.log('that.drawBefore', that.shareInfo)
							that.drawBefore();
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
					//}
				//})
			},
			previewImg() {
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
				let pixelRatio = this.systemInfo.pixelRatio
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
				ctx.drawImage(this.shareInfo.qrcode, 60 / this.systemInfo.pixelRatio, 720 / this.systemInfo.pixelRatio, qrcodeW, qrcodeW)
				ctx.save()
				// 将前面绘制的各个图案一起画出来
				ctx.draw()
				//需延迟保存画布，否则可能为空
				setTimeout(() => {
					wx.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: canvasW,
						height: canvasH,
						destWidth: canvasW, //canvasW * pixelRatio,
						destHeight: canvasH, //canvasH * pixelRatio,
						canvasId: 'canvasPoster',
						success: (res) => {
							that.poster = res.tempFilePath
							console.log('that.poster', that.poster)
							uni.hideLoading();
						},
						fail: (err) => {
							console.log(err)
						}
					}, this)
				}, 200)
			}
		}
	}
</script>

<style lang="scss">
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

	/*海报分享*/
	.share-panel {
		width: 650rpx;
		position: fixed;
		top: 136rpx;
		z-index: 210;
		left: 50rpx;

		// .share-poster {
		// 	width: 100%;
		// 	height: 900rpx;
		// 	border-radius: 20rpx;
		// 	background: rgba(255, 255, 255, 1);

		// 	.share-mainimg {
		// 		width: 600rpx;
		// 		height: 600rpx;
		// 	}

		// 	.share-space {
		// 		width: 600rpx;
		// 		margin: 0 auto;

		// 		.qrcode {
		// 			margin-left: 65rpx;
		// 			margin-right: -50rpx;

		// 			.share-qrcode {
		// 				width: 160rpx;
		// 				height: 160rpx;
		// 			}
		// 		}

		// 		.press {
		// 			font-size: 30rpx;
		// 			color: #333333;
		// 		}

		// 		.atonce {
		// 			font-size: 24rpx;
		// 			color: #666666;
		// 		}
		// 	}

		// 	.share-id {
		// 		height: 83rpx;
		// 		font-size: 30rpx;
		// 		color: #333333;
		// 		border-bottom: 1px dashed grey;
		// 		padding-left: 25rpx;
		// 	}
		// }

		.share-btn {
			width: 300rpx;
			height: 80rpx;
			background: #17CA17;
			border-radius: 40rpx;
			color: #FFFFFF;
			margin-top: 12rpx;
			margin-bottom: 12rpx;
			font-size: 30rpx;
		}
		
		.wx-chat {
			margin-right: 30rpx;
			line-height: 80rpx;
		}

		.share-img {
			width: 64rpx;
			height: 64rpx;
		}
	}
</style>
