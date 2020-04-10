<template>
	<view>
		<view class="status-line" :style="{height: lineHeight, background: style.background}"></view>
		<view class="bar-line container-in" :style="{background: style.background}">
			<view class="bar-font container-in" v-if="!custom">
				<view class="icon-fanhui bar-back" :style="{color: style.iconColor}" v-if="showBack"></view>
				<view class="bar-title" :style="{color: style.fontColor}">一米一粉</view>
			</view>
			<view class="bar-font container-in" v-else>
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			custom: {
			  type: Boolean,
			  default: false
			}, //自定义头部，否则沿用原生的头部样式
			style: {
				type: Object,
				default: function() {
					return{
						background: '#0071CF',
						fontColor: '#FFFFFF',
						iconColor: '#FFFFFF'
					}
				}
			}, //原生头部样式
			showBack: {
			  type: Boolean,
			  default: true
			}, //是否显示回退图标，默认显示
		},
		data() {
			return {
				lineHeight: '' //状态栏高度
			};
		},
		mounted() {
			const res = uni.getSystemInfoSync();
			this.lineHeight = res.statusBarHeight + 'px';
		},
		methods: {
			prevent() {}
		}
	}
</script>

<style lang="scss">
	.container-in {
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		width: 100%;
		height: 44px;
	}
	.bar-line {
		height: 44px; //导航栏高度
		.bar-back {
			font-size: 32rpx !important;
			position: absolute;
			left: 30rpx;
		}
		.bar-title {
			font-size: 32rpx;
		}
	}
</style>
