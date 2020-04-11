<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view>
			<image src="/static/bussiness.png" class="bussiness"></image>
		</view>
		<view class="uni-flex uni-row linebar">
			<view class="uni-flex rest content base">
				<text class="active">商家入驻</text>
			</view>
			<view class="uni-flex rest content base">
				<text class="">用户指南</text>
			</view>
			<view class="uni-flex rest content base">
				<text class="">新闻咨询</text>
			</view>
			<view class="uni-flex rest content base">
				<text class="">企业动态</text>
			</view>
		</view>
		<view class="info">
			<view style="width: 650rpx;margin: 0 auto;">
				<view class="title">商家入驻注意事项</view>
				<view class="desc">
					<text class="space">商家入驻注意事项商家入驻注意事项商家入驻注意事项商家 入驻注意事项...</text>
				</view>
				<view class="img">
					<image src="/static/pointbg.png" style="width: 100%;height: 100%;"></image>
				</view>
			</view>
		</view>
		<view class="info">
			<view style="width: 650rpx;margin: 0 auto;">
				<view class="title">用户指南</view>
				<view class="desc">
					<text class="space">商家入驻注意事项商家入驻注意事项商家入驻注意事项商家 入驻注意事项...</text>
				</view>
				<view class="img">
					<image src="/static/pointbg.png" style="width: 100%;height: 100%;"></image>
				</view>
			</view>
		</view>
		<view class="info">
			<view style="width: 650rpx;margin: 0 auto;">
				<view class="title">新闻资讯</view>
				<view class="desc">
					<text class="space">商家入驻注意事项商家入驻注意事项商家入驻注意事项商家 入驻注意事项...</text>
				</view>
				<view class="img">
					<image src="/static/pointbg.png" style="width: 100%;height: 100%;"></image>
				</view>
			</view>
		</view>
		<view class="info">
			<view style="width: 650rpx;margin: 0 auto;">
				<view class="title">企业动态</view>
				<view class="desc">
					<text class="space">商家入驻注意事项商家入驻注意事项商家入驻注意事项商家 入驻注意事项...</text>
				</view>
				<view class="img">
					<image src="/static/pointbg.png" style="width: 100%;height: 100%;"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					background: '#0071CF',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '商学院' //导航栏文字
				},
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
	page {
		background: #F7F4F8;
	}
	.bussiness {
		width: 100%;
		height: 230rpx;
	}
	.linebar {
		height: 100rpx;
		.base {
			font-size: 30rpx;
			color: #333333;
		}
		.active {
			color: #0071CF;
			border-bottom: 1px solid #0071CF;
		}
	}
	.info {
		padding-bottom: 20rpx;
		width: 723rpx;
		margin: 0 auto;
		background: #FFFFFF;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		box-shadow:0px 2rpx 6rpx 0px rgba(116,114,114,0.13);
		.title {
			font-size: 30rpx;
			color: #333333;
		}
		.desc {
			font-size: 24rpx;
			color: #999999;
			line-height: 1.4;
			.space {
				margin-left: 36rpx;
			}
		}
		.img {
			width:650rpx;
			height:300rpx;
		}
	}
</style>
