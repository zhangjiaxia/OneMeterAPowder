<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="layout">
			<view style="height: 284rpx;">
				<view class="topitem">
					<view class="understand">
						<image src="/static/school/rect.png" class="img"></image>
						<text class="utext">了解每日有薪</text>
					</view>
				</view>
			</view>
			<view class="uni-flex uni-row html">
				<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/about?title=商家入驻&type=businessSettled', 'navigateTo')">
					<image src="/static/school/Merchants.png" class="icon"></image>
					<text class="point">商家入驻</text>
				</view>
				<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/about?title=用户指南&type=userGuide', 'navigateTo')">
					<image src="/static/school/user.png" class="icon"></image>
					<text class="point">用户指南</text>
				</view>
				<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/about?title=新闻资讯&type=newsInformation', 'navigateTo')">
					<image src="/static/school/news.png" class="icon"></image>
					<text class="point">新闻资讯</text>
				</view>
				<view class="uni-flex rest content">
					<image src="/static/school/material.png" class="icon"></image>
					<text class="point">素材库</text>
				</view>
				<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/about?title=企业动态&type=enterpriseDynamic', 'navigateTo')">
					<image src="/static/school/dynamic.png" class="icon"></image>
					<text class="point">企业动态</text>
				</view>
			</view>
			<view class="uni-flex uni-row vertical school">
				<view class="uni-flex">
					<image src="/static/school/school.png" class="img"></image>
				</view>
				<view class="uni-flex rest vertical">
					<image src="/static/school/voice.png" class="voice"></image>
					<text class="notice">星联318通过狂欢节：重新定义消费，……</text>
				</view>
			</view>
			<view class="why">
				<view class="whyitem content" style="margin-right: 9rpx;">
					<image src="/static/school/why1.png" class="whyimg"></image>
					<text class="whytext">为何选择每日有薪</text>
				</view>
				<view class="whyitem content" style="margin-left: 9rpx;">
					<image src="/static/school/why2.png" class="whyimg"></image>
					<text class="whytext">为何选择每日有薪</text>
				</view>
				<view class="whyitem content" style="margin-right: 9rpx;">
					<image src="/static/school/why3.png" class="whyimg"></image>
					<text class="whytext">为何选择每日有薪</text>
				</view>
				<view class="whyitem content" style="margin-left: 9rpx;">
					<image src="/static/school/why4.png" class="whyimg"></image>
					<text class="whytext">为何选择每日有薪</text>
				</view>
			</view>
			<view class="course">
				<view class="newguide">新人指南</view>
				<view class="uni-flex uni-row">
					<view class="uni-flex rest">
						<view>
							<image src="/static/school/guide.png" class="guide"></image>
							<view class="how">【新手篇】新人加入该如何……</view>
						</view>
					</view>
					<view class="uni-flex rest horizontalright">
						<view>
							<image src="/static/school/guide.png" class="guide"></image>
							<view class="how">【新手篇】新人加入该如何……</view>
						</view>
					</view>
				</view>
				<view class="uni-flex content">
					<view class="uni-flex content more">查看更多</view>
				</view>
			</view>
			<view class="course">
				<view class="newguide">精品课程</view>
				<view class="uni-flex uni-row">
					<view class="uni-flex rest">
						<view>
							<image src="/static/school/guide.png" class="guide"></image>
							<view class="how">【新手篇】新人加入该如何……</view>
						</view>
					</view>
					<view class="uni-flex rest horizontalright">
						<view>
							<image src="/static/school/guide.png" class="guide"></image>
							<view class="how">【新手篇】新人加入该如何……</view>
						</view>
					</view>
				</view>
				<view class="uni-flex content">
					<view class="uni-flex content more">查看更多</view>
				</view>
			</view>
		</view>
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
					iconText: '商学院' //导航栏文字
				},
			}
		},
		onLoad() {
			
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
		background: #FFFFFF;
	}
	.layout {
		margin: 0 auto;
		width: 714rpx;
		.topitem {
			background: #044AC6;
			border-radius: 10rpx;
			position: absolute;
			height: 284rpx;
			width: 714rpx;
			z-index: -10;
			.understand {
				width: 172rpx;
				height: 52rpx;
				position: relative;
				.img {
					width: 100%;
					height: 100%;
					position: absolute;
					z-index: -1;
				}
				.utext {
					font-size:27rpx;
					color: #FFFFFF;
				}
			}
		}
		.html {
			margin-top: 32rpx;
			margin-bottom: 40rpx;
			.icon {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}
			.point {
				color: #575757;
				font-size: 26rpx;
			}
		}
		.school {
			width:712rpx;
			height:72rpx;
			border:1rpx solid rgba(241,235,235,1);
			.img {
				width: 113rpx;
				height: 26rpx;
				margin-left: 15rpx;
				margin-right: 54rpx;
			}
			.voice {
				width: 26rpx;
				height: 26rpx;
				margin-right: 12rpx;
			}
			.notice {
				color: #575757;
				font-size: 26rpx;
			}
		}
		.why {
			margin-top: 28rpx;
			margin-bottom: 41rpx;
			height: auto;
			overflow: auto;
			.whyitem {
				width: 348rpx;
				height: 140rpx;
				position: relative;
				float: left;
				margin-bottom: 14rpx;
				.whyimg {
					width: 100%;
					height: 100%;
					position: absolute;
					z-index: -1;
				}
				.whytext {
					color: #332D2D;
					font-size: 32rpx;
					font-weight:bold;
				}
			}
		}
		.course {
			.newguide {
				color: #121C24;
				font-size: 44rpx;
				margin-bottom: 20rpx;
				margin-left: 13rpx;
			}
			.guide {
				width:346rpx;
				height:200rpx;
				border-radius:8px;
				position: relative;
				left: 6rpx;
			}
			.how {
				color: #2C2C2C;
				font-size: 27rpx;
			}
			.more {
				width:240rpx;
				height:63rpx;
				border:1rpx solid rgba(191,191,191,1);
				border-radius:32rpx;
				color: #3E3E3E;
				font-size: 27rpx;
				margin-top: 87rpx;
				margin-bottom: 72rpx;
			}
		}
	}
</style>
