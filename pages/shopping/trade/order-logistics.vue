<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="uni-flex uni-row vertical logistics">
			<view class="uni-flex uni-row">
				<view class="uni-flex">
					<image src="/static/flow.png" class="company-icon"></image>
				</view>
				<view class="uni-flex uni-column rest">
					<view class="uni-flex">
						<view class="company">物流公司：</view>
						<view class="company-type">{{info.data[0].deliveryName}}</view>
					</view>
					<view class="uni-flex">
						<view class="company">物流单号：</view>
						<view class="company-type">{{info.data[0].deliveryNo}}</view>
					</view>
				</view>
			</view>
		</view>
		<view style="background: #FFFFFF;">
			<view class="steps">
				<uniSteps :options="options" direction="column"></uniSteps>
			</view>
		</view>
	</view>
</template>

<script>
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import uniSteps from '@/components/uni-steps/uni-steps.vue' //引入步骤条
	export default {
		components: {
			navigationBar,
			uniSteps
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '物流信息' //导航栏文字
				},
				options: [{
					title:'买家下单',desc:'2018-11-11',
				},{
					title:'卖家发货',desc:'2018-11-12',
				},{
					title:'买家签收',desc:'2018-11-13',
				},{
					title:'交易完成',desc:'2018-11-14',
				}], //步骤条数据
				info: []
			}
		},
		onLoad(options) {
			let str = '{"code":0,"data":[{"deliveryList":[{"context":"商家已拣货完毕，待出货交给【韵达快递】，运单号【sssss】","operator":"和乐网","time":"2020-04-18 09:26:27","title":""},{"context":"您的订单已经提交","operator":"买家","time":"2020-04-16 16:27:13","title":""}],"deliveryName":"韵达快递","deliveryNo":"sssss","skuList":[{"code":"SL-ECP-78757","goodsPhotoUrl":"https:\\/\\/yd-imgs.380star.com\\/hl\\/upload\\/33239\\/store\\/2126\\/e15cf129-ae51-4884-8174-24e0b36748ac.png_middle.png","isReshipApply":"0","isReshipQuantity":"0","maxGoodsRefund":"0.00","price":"163.75","prodName":"芙丽芳丝保湿修护柔润乳液100ml 滋润型","quantity":1,"reshipSn":"R22020041815293804198448","reshipStatus":"7","reshipStatusName":"退款成功","skuId":"78757","spuId":"135240"}]}],"message":"success"}'
			this.info = JSON.parse(str)
			this.options = this.info.data[0].deliveryList
			
			//this.query(options.orderSn)
		},
		methods: {
			query(orderSn) {
				let that = this
				interfaceurl.checkAuth(interfaceurl.orderExpressInfo, { orderSn }).then((res) => {
					that.info = JSON.parse(str)
					that.options = that.info.data[0].deliveryList
				});
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
		background: #F5F5F5;
	}
	.logistics {
		height:200rpx;
		background:rgba(255,255,255,1);
		border: 2rpx solid #F5F5F5;
		font-size: 30rpx;
		.company-icon {
			width: 120rpx;
			height: 120rpx;
			margin-left: 70rpx;
			margin-right: 26rpx;
		}
		.company {
			color: #666666;
		}
		.company-type {
			color: #333333;
		}
	}
	.steps {
		background: #ffffff;
		padding-top: 60rpx;
		width: 700rpx;
	}
</style>
