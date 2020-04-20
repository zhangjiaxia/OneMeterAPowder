<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="space">
			<view>
				<view class="title">发票类型</view>
				<view class="uni-flex content common base">普通发票</view>
				<view class="tip">为响应环保，每日有薪商城全面启用电子普通发票</view>
				<view class="line"></view>
			</view>
			<view v-if="params.invoiceContent == 1">
				<view class="uni-flex uni-row vertical">
					<view class="uni-flex rest title">发票抬头</view>
					<!-- <view class="uni-flex vertical tip" @click="getWxInvoice">
						<view class="uni-flex">
							<image src="/static/weixin.png" class="weixin"></image>
						</view>
						<view class="uni-flex">获取微信发票抬头</view>
					</view> -->
				</view>
				<view class="uni-flex uni-row">
					<view class="uni-flex content type" :class="{base: params.invoiceHeadType == 1}" style="margin-right: 20rpx;" @click="setTitle(1)">个人</view>
					<view class="uni-flex content type" :class="{base: params.invoiceHeadType == 2}" @click="setTitle(2)">公司</view>
				</view>
				<view class="uni-flex vertical input-view" v-if="params.invoiceHeadType == 1">
					<input type="text" placeholder="可填写姓名" v-model="params.invoiceHeadName" />
				</view>
				<view v-else>
					<view class="uni-flex vertical input-view">
						<input type="text" placeholder="请填写公司名称" v-model="params.invoiceHeadCompanyName" />
					</view>
					<view class="uni-flex vertical input-view">
						<input type="text" placeholder="请填写纳税人识别号" v-model="params.invoiceIdentifierNo" />
					</view>
					<view v-if="isExpend">
						<view class="uni-flex vertical input-view">
							<input type="text" placeholder="注册地址（选填）" v-model="params.registeredAddress" />
						</view>
						<view class="uni-flex vertical input-view">
							<input type="text" placeholder="单位电话（选填）" v-model="params.workPhone" />
						</view>
						<view class="uni-flex vertical input-view">
							<input type="text" placeholder="开户银行（选填）" v-model="params.bank" />
						</view>
						<view class="uni-flex vertical input-view">
							<input type="text" placeholder="银行账户（选填）" v-model="params.bankAccounts" />
						</view>
					</view>
					<view class="expend" @click="setExpend">{{isExpend ? '收起选填项' : '展开选填项'}}</view>
				</view>
				<view class="line"></view>
			</view>
			<view>
				<view class="uni-flex uni-row vertical">
					<view class="title">发票内容</view>
					<view class="tip" style="margin-left: 12rpx;">发票内容将选项已根据税法调整，具体请以展示为准</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="uni-flex content common" :class="{base: params.invoiceContent == 0}" style="margin-right: 20rpx;"
					 @click="setContent(0)">不开发票</view>
					<view class="uni-flex content common" :class="{base: params.invoiceContent == 1}" @click="setContent(1)">商品明细</view>
				</view>
				<view class="tip">发票内容显示详细商品名称及价格信息。</view>
			</view>
			<view class="uni-flex content confirm" @click="valiSubmit">确认</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '发票信息' //导航栏文字
				},
				invoiceHeadType: '个人', //发票抬头
				invoiceContent: '不开发票', //发票内容
				isExpend: false, //是否展开
				params: {
					invoiceType: 1, //发票类型:普通发票
					invoiceContent: 0, //发票内容:0:不开,1:明细
					invoiceHeadType: 1, //1:个人,2:公司
					invoiceHeadName: '', //invoiceHeadType = 1 必填姓名
					invoiceHeadCompanyName: '', //invoiceHeadType =2 必填公司名称
					invoiceIdentifierNo: '', //纳税人识别号
					registeredAddress: '', //注册地址
					workPhone: '', //单位电话
					bank: '', //开户银行
					bankAccounts: '' //银行账户
				}
			}
		},
		onShow() {

		},
		methods: {
			setTitle(invoiceHeadType) {
				this.params.invoiceHeadType = invoiceHeadType
			},
			setContent(invoiceContent) {
				this.params.invoiceContent = invoiceContent
			},
			setExpend() {
				this.isExpend = !this.isExpend
			},
			//校验数据成功后将数据返回上一页面
			valiSubmit() {
				let that = this
				if(this.params.invoiceContent == 1) {
					if(this.params.invoiceHeadType == 1 && this.params.invoiceHeadName =='') {
						uni.showToast({
							title: '发票抬头为个人时，必须填姓名',
							icon: 'none',
							duration: 2000
						});
						return;
					}
					if(this.params.invoiceHeadType == 2 && this.params.invoiceHeadCompanyName =='') {
						uni.showToast({
							title: '发票抬头为公司时，必须填公司名称',
							icon: 'none',
							duration: 2000
						});
						return;
					}
				}
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2]; //上一个页面
				//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
				prevPage.setData({
					params: that.params
				})
				this.$turnPage('1', 'navigateBack')
			},
			getWxInvoice() {
				//地址簿
				wx.getSetting({
					success(res) {
						console.log(res)
						if (res.authSetting['scope.address']) {
							wx.chooseAddress({
								success(res) {
									console.log(res)
								}
							})
						} else {
							if (res.authSetting['scope.address'] == false) {
								console.log("222")
								wx.openSetting({
									success(res) {
										console.log(res.authSetting)
									}
								})
							} else {
								console.log("eee")
								wx.chooseAddress({
									success(res) {
										console.log(res.userName)
										console.log(res.postalCode)
										console.log(res.provinceName)
										console.log(res.cityName)
										console.log(res.countyName)
										console.log(res.detailInfo)
										console.log(res.nationalCode)
										console.log(res.telNumber)
									}
								})
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';

	.space {
		padding-top: 30rpx;
		width: 710rpx;
		margin: 0 auto;

		.title {
			font-size: 30rpx;
			color: #333333;
		}

		.weixin {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}

		.common,
		.type {
			margin: 20rpx 0;
			width: 150rpx;
			height: 50rpx;
			border-radius: 25rpx;
			font-size: 24rpx;
			background: #F5F5F5;
			color: #333333;
		}

		.type {
			width: 100rpx;
		}

		.base {
			background: rgba(0, 113, 207, 1);
			color: #FFFFFF;
		}

		.tip {
			color: #999999;
			font-size: 24rpx;
		}

		.line {
			width: 100%;
			height: 4rpx;
			background: rgba(221, 221, 221, 1);
			margin-top: 20rpx;
			margin-bottom: 30rpx;
		}

		.input-view {
			width: 100%;
			height: 60rpx;
			background: rgba(245, 245, 245, 1);
			border-radius: 10rpx;
			margin-bottom: 20rpx;

			input {
				margin-left: 20rpx;
				width: 100%;
			}
		}

		.expend {
			color: #666666;
			font-size: 20rpx;
			text-align: center;
		}

		.confirm {
			width: 710rpx;
			height: 80rpx;
			background: rgba(0, 113, 207, 1);
			border-radius: 40rpx;
			color: #FFFFFF;
			font-size: 30rpx;
			margin-top: 65rpx;
			margin-bottom: 30rpx;
		}
	}
</style>
