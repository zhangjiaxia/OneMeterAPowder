<template>
	<view>
		<view class="space">
			<view class="goods" :style="{'margin-right': index % 2 == 0 ? '20rpx' : '0'}"
				v-for="(item, index) in list" :key="index">
				<view style="width: 100%;">
					<image src="/static/bussiness.png" class="goodsimg"></image>
				</view>
				<view class="title">FL男子短袖T恤FL男子短袖T恤 FL男子短袖T恤</view>
				<view class="price">
					<text style="font-size: 24rpx;">￥</text>
					<text>299</text>
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
	page {
		background: #F0EDF1;
	}
	.space {
		width: 700rpx;
		margin: 20rpx auto;
		.goods {
			width: 340rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			float: left;
			margin-bottom: 10rpx;
			.goodsimg {
				width: 340rpx;
				height: 340rpx;
			}
			.title {
				font-size: 24rpx;
				color: #333333;
				margin: 10rpx;
			}
			.price {
				font-size: 30rpx;
				color: #EC3030;
				margin-left: 10rpx;
			}
			view {
				line-height: 1.2;
			}
		}
	}
</style>
