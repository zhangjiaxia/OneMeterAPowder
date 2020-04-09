<template>
	<view>
		<view class="topline"></view>
		<view class="goodslist">
			<view class="uni-flex uni-row vertical goods" v-for="(item, index) in list" :key="index">
				<view class="uni-flex">
					<image src="/static/bussiness.png" class="goodsimg"></image>
				</view>
				<view class="uni-flex uni-column rest info">
					<view class="uni-flex title">FL男子短袖T恤FL男子短袖T恤 </view>
					<view class="uni-flex subtitle rest">FL男子短袖T恤FL男子短袖T恤 </view>
					<view class="uni-flex uni-row vertical money">
						<view class="uni-flex rest vertical price">
							<text style="font-size: 16rpx;">￥</text>
							<text>299</text>
						</view>
						<view class="uni-flex">
							<!-- <image src="/static/add.png" class="add"></image> -->
							<view class="icon-jiahao add"></view>
						</view>
					</view>
					<view class="line"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{},{},{},{}]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	.topline {
		height: 20rpx;
		background: #F7F5F6;
	}
	.goodslist {
		height:280rpx;
		background:rgba(255,255,255,1);
		.goods {
			height: 280rpx;
			.goodsimg {
				width: 240rpx;
				height: 240rpx;
				margin: 0 20rpx;
			}
			.info {
				height: 220rpx;
				.title {
					font-size: 30rpx;
					color: #333333;
				}
				.subtitle {
					font-size: 24rpx;
					color: #999999;
				}
				.money {
					.price {
						font-size: 30rpx;
						color: #0071CF;
					}
					.add {
						color: #0071CF;
						font-size: 40rpx !important;
						margin-right: 30rpx;
					}
				}
				.line {
					width:470rpx;
					height:1px;
					background:rgba(238,238,238,1);
					position: relative;
					top: 30rpx;
				}
			}
		}
	}
</style>
