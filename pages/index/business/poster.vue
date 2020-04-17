<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<!--将海报跟二维码通过画布组合到一起，展示在image中，下载图片-->
		<canvas class="canvas-poster" id="canvasPoster" :style="{width:width+'rpx',height: height+'rpx'}" canvas-id="canvasPoster"></canvas>
		<image :src="poster" class="poster" :style="{width:width+'rpx',height: height+'rpx'}" @click="previewImg" alt="" v-if="poster"></image>
		<view class="uni-flex content posterdiv" v-if="poster">
			<view class="uni-flex purchase content" @click="saveImg">保存图片</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import imgformat from '@/utils/base64-arraybuffer.js' //图片数据格式转换
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '分享海报' //导航栏文字
				},
				shareInfo: {
					bgImg: '/static/bg.png',
					qrcode: ''
				},
				//画布的宽高
				width: 0,
				height: 0,
				systemInfo: {},
				poster: '' //生成的海报
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '海报生成中...',
				mask: true,
				duration: 3000
			});
			this.getQrcode();
		},
		methods: {
			//获取动态二维码（可携带参数）
			getQrcode() {
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
							console.log('that.drawBefore',that.shareInfo)
							that.drawBefore();
						}
					}
				})
			},
			drawBefore() {
				let that = this;
				//画布的宽高赋值渲染是最大的坑点
				wx.getSystemInfo({
					success(res) {
						that.systemInfo = res;
						// 通过像素比计算出画布的实际大小（330x490）是展示的出来的大小
						that.width = 330 * res.pixelRatio
						that.height = 490 * res.pixelRatio - res.statusBarHeight * res.pixelRatio - 44 * res.pixelRatio
						that.width = res.windowWidth * res.pixelRatio
						// that.height = res.screenHeight * res.pixelRatio - res.statusBarHeight * res.pixelRatio - 44 * res.pixelRatio
						var query = wx.createSelectorQuery()
						query.select('#canvasPoster').boundingClientRect((res) => {
							// 返回值包括画布的实际宽高
							that.drawImage(res);
						}).exec();
					}
				})
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
			//点击保存到相册
			// saveImg() {
			// 	console.log('保存')
			//     var that = this;
			//     wx.saveImageToPhotosAlbum({
			//       filePath: that.poster,
			//       success(res) {
			//         wx.showModal({
			//           content: '图片已保存到相册，赶紧晒一下吧~',
			//           showCancel: false,
			//           confirmText: '好的',
			//           confirmColor: '#333',
			//           success: function (res) {
			//             if (res.confirm) {
			//               console.log('用户点击确定');
			//             }
			//           }, 
			// 		  fail: function (res) {
			// 			  console.log(res)
			//           }
			//         })
			//       },
			// 	  fail(err) {
			// 	  	console.log(err)
			// 	  }
			//     })
			// },
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
				let headerW = 48 * this.systemInfo.pixelRatio
				let headerX = (canvasW - headerW) / 2
				let headerY = 40 * this.systemInfo.pixelRatio
				let qrcodeW = 73 * this.systemInfo.pixelRatio
				let qrcodeX = 216 * this.systemInfo.pixelRatio
				let qrcodeY = 300 * this.systemInfo.pixelRatio
				// 填充背景
				ctx.drawImage(this.shareInfo.bgImg, 0, 0, canvasW, canvasH)
				ctx.save()
				// 绘制二维码
				//ctx.drawImage(this.shareInfo.qrcode, qrcodeX, qrcodeY, qrcodeW, qrcodeW)
				ctx.drawImage(this.shareInfo.qrcode, 0, 0, qrcodeW, qrcodeW)
				ctx.save()
				// 将前面绘制的各个图案一起画出来
				ctx.draw()
				setTimeout(() => {
					//下面的13以及减26推测是因为在写样式的时候写了固定的zoom: 50%而没有用像素比缩放导致的黑边，所以在生成时进行了适当的缩小生成，这个大家可以自行尝试
					wx.canvasToTempFilePath({
						x: 13,
						y: 13,
						width: canvasW - 26,
						height: canvasH - 26,
						destWidth: canvasW - 26,
						destHeight: canvasH - 26,
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

	.canvas-poster {
		background-color: #fafafa;
		zoom: 50%; // 将画布缩小到50%（最好通过像素比进行缩小，像素比是2的话就是50%，如果不全是以像素比为标准，在生成图片的时候可能会出现四周黑边）
		position: absolute;
		left: -10000px; // 将画布隐藏在可视区域外
		background: #206949;
	}

	.poster {
		// width: 100%;
		// height: 100%;
		position: absolute;
		z-index: 100;
	}

	.purchase {
		width: 180rpx;
		height: 70rpx;
		font-size: 27rpx;
		border: 1px solid rgba(253, 94, 45, 1);
		border-radius: 10rpx;
		display: inline-flex;
		background: rgba(253, 94, 45, 1);
		color: #FFFFFF;
		position: absolute;
		bottom: 100rpx;
		z-index: 101;
	}
</style>
