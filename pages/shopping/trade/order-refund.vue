<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle" :showBack="false"></navigationBar>
		</view>
		<view>
			<view class="uni-flex uni-row vertical orderitem">
				<view class="uni-flex">
					<image src="/static/bussiness.png" class="goodsimg"></image>
				</view>
				<view class="uni-flex uni-column rest goodsinfo">
					<view class="title">【现货直发】75%酒精杀菌免喷洗 喷雾100ml便携装</view>
					<view class="prop">
						<text class="size">100ml</text>
						<text class="size">100ml*1瓶</text>
					</view>
				</view>
				<view class="uni-flex uni-column goodsdata">
					<view class="title">￥29</view>
					<view class="horizontalright number">x1</view>
				</view>
			</view>
			<view class="uni-flex uni-row vertical opbar">
				<view class="uni-flex rest content">
					<text class="base active">我要退款</text>
				</view>
				<view class="uni-flex">
					<view class="vline"></view>
				</view>
				<view class="uni-flex rest content">
					<text class="base">退货退款</text>
				</view>
			</view>
			<view class="options">
				<view class="uni-flex uni-row vertical bar" @click="setChooseType('货物状态')">
					<view class="uni-flex rest left">货物状态</view>
					<view class="uni-flex vertical right">
						{{userChoose.status || '请选择'}}
						<view class="uni-flex">
							<view class="icon-qianjin back"></view>
						</view>
					</view>
				</view>
				<view class="uni-flex uni-row vertical bar" @click="setChooseType('退款原因')">
					<view class="uni-flex rest left">退款原因</view>
					<view class="uni-flex vertical right">
						{{userChoose.reason || '请选择'}}
						<view class="uni-flex">
							<view class="icon-qianjin back"></view>
						</view>
					</view>
				</view>
				<view class="uni-flex uni-row vertical bar">
					<view class="uni-flex rest left">退款金额</view>
					<view class="uni-flex vertical money">
						￥299
					</view>
				</view>
			</view>
			<view class="uni-flex content submit space" @click="submit">提交</view>
		</view>
		<!--底部弹窗:货物状态，退款原因-->
		<view class="panels" v-if="showPanel">
			<view class="uni-flex content font">{{chooseType}}</view>
			<view class="uni-flex uni-row vertical item" v-for="(item, index) in optionsList[chooseType]" :key="index" @click="checkItem(chooseType, index)">
				<view class="uni-flex rest font">{{item.text}}</view>
				<view class="uni-flex">
					<view class="icon-gou radio-icon" :style="{color: item.selected ? '#ff0033' : '#999999'}"></view>
				</view>
			</view>
			<view class="uni-flex content cancel" @click="confirm">确定</view>
		</view>
		<!--弹窗时阻止滚动穿透-->
		<view class="mask" @touchmove.stop.prevent="touch" v-if="showPanel" @click="showPanel=false"></view>
	</view>
</template>

<script>
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import interfaceurl from '@/utils/interface.js'
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '申请退款' //导航栏文字
				},
				showPanel: false, //是否显示面板
				chooseType: '退款原因', //选择类型，货物状态、退款原因
				optionsList: {
					"货物状态": [{
						text: '未收到货',
						selected: true
					},{
						text: '未收到货',
						selected: false
					}],
					"退款原因": [{
						text: '不喜欢/不想要',
						selected: true
					},{
						text: '空包裹',
						selected: false
					},{
						text: '快递/物流一直未送到',
						selected: false
					},{
						text: '货物破损已拒签',
						selected: false
					}],
				}, //面板数据
				userChoose: {
					status: '',
					reason: ''
				} //用户选填的值
			}
		},
		onShow() {
			
		},
		methods: {
			touch() {},
			setChooseType(type) {
				this.chooseType = type
				this.showPanel = true
			},
			checkItem(chooseType, index) {
				let i = 0
				for(var item of this.optionsList[chooseType]) {
					if(i == index) {
						item.selected = true
					} else {
						item.selected = false
					}
					i ++
				}
			},
			confirm() {
				this.showPanel=false
				this.userChoose.status = this.optionsList["货物状态"].find(element => element.selected).text;
				this.userChoose.reason = this.optionsList["退款原因"].find(element => element.selected).text;
			},
			submit() {
				
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
	.orderitem {
		margin: 10rpx 0;
		background: #FFFFFF;
		height: 200rpx;
		.goodsimg {
			width: 159rpx;
			height: 159rpx;
			margin-left: 20rpx;
			margin-right: 30rpx;
		}
		.goodsinfo {
			.prop {
				background: #F3F0F3;
				.size {
					color: #A09DA1;
					margin-right: 10rpx;
					padding: 6rpx;
					display: inline-flex;
					margin-bottom: 10rpx;
					font-size: 23rpx;
					border-radius: 6rpx;
				}
			}
		}
		.goodsdata {
			margin-left: 40rpx;
			margin-right: 30rpx;
			.number {
				color: #999999;
				font-size: 20rpx;
				text-align: right;
			}
		}
	}
	.opbar {
		margin: 10rpx 0;
		height: 80rpx;
		background: #FFFFFF;
		margin-top: 20rpx;
		.vline {
			width:2rpx;
			height:40rpx;
			background:rgba(204,204,204,1);
		}
		.base {
			font-size: 30rpx;
			color: #999999;
			line-height: 80rpx;
		}
		.active {
			color: #ff0033;
			border-bottom: 2rpx solid #ff0033;
		}
	}
	.options {
		.bar {
			height:100rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px 2rpx 3rpx 0px rgba(201,198,198,0.2);
			border-bottom: 1px solid rgba(201,198,198,0.2);
			.left {
				color: #333333;
				font-size: 30rpx;
				margin-left: 30rpx;
			}
			.right {
				color: #999999;
				font-size: 24rpx;
			}
			.money {
				color: #ff0033;
				font-size: 30rpx;
				margin-right: 30rpx;
			}
			.back {
				color: #999999;
				font-size: 24rpx !important;
				margin-right: 30rpx;
			}
		}
	}
	.submit {
		height:80rpx;
		background:rgba(235,82,75,1);
		color: #FFFFFF;
		font-size:30rpx;
	}
	.space {
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.panels {
		background: #FFFFFF;
		position: absolute;
		width: 100%;
		bottom: 0;
		height: 750rpx;
		z-index: 220;
		.font {
			height: 88rpx;
			color: #333333;
			font-size: 30rpx;
		}
		.item {
			height: 100rpx;
			border-bottom: 2rpx solid #F5F5F5;
			padding: 0 30rpx;
		}
		.radio-icon {
			font-size: 30rpx !important;
			color: #999999;
		}
		.cancel {
			height:80rpx;
			background:rgba(235,82,75,1);
			color: #FFFFFF;
			font-size:30rpx;
			position: absolute;
			width: 100%;
			bottom: 0;
		}
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
</style>
