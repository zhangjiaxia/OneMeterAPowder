<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view>
			<image src="/static/bussiness.png" class="bussiness"></image>
		</view>
		<view class="uni-flex uni-row linebar">
			<view class="uni-flex rest content base" @click="setArticle(0, 'businessSettled', '商家入驻注意事项')">
				<text :class="{active: tabIndex == 0}">商家入驻</text>
			</view>
			<view class="uni-flex rest content base" @click="setArticle(1, 'userGuide', '用户指南')">
				<text :class="{active: tabIndex == 1}">用户指南</text>
			</view>
			<view class="uni-flex rest content base" @click="setArticle(2, 'newsInformation', '新闻资讯')">
				<text :class="{active: tabIndex == 2}">新闻咨询</text>
			</view>
			<view class="uni-flex rest content base" @click="setArticle(3, 'enterpriseDynamic', '企业动态')">
				<text :class="{active: tabIndex == 3}">企业动态</text>
			</view>
		</view>
		<view class="info">
			<view style="width: 650rpx;margin: 0 auto;">
				<view class="title">{{articleTitle}}</view>
				<view class="desc">
					<!-- <text class="space">商家入驻注意事项商家入驻注意事项商家入驻注意事项商家 入驻注意事项...</text> -->
					<rich-text :nodes="article"></rich-text>
				</view>
				<!-- <view class="img">
					<image src="/static/pointbg.png" style="width: 100%;height: 100%;"></image>
				</view> -->
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
				list: [{},{},{},{}],
				tabIndex: 0, //选中的tab索引
				articleKey: 'businessSettled', //文章参数
				article: {
					businessSettled: '', //商家入驻
					userGuide: '', //入驻指南
					newsInformation: '', //新闻资讯
					enterpriseDynamic: '' //企业动态
				}, //文章
				articleTitle: '商家入驻注意事项' //标题
			}
		},
		onLoad() {
			this.getArticle();
		},
		methods: {
			setArticle(tabIndex, articleKey, articleTitle) {
				this.tabIndex = tabIndex
				this.articleKey = articleKey
				this.articleTitle = articleTitle
				this.getArticle();
			},
			getArticle() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.getArticleKey, {setting_name: that.articleKey}, false).then((res) => {
					that.article = res.data[that.articleKey]
					that.article = that.article.replace(/<img/gi, '<img width="100%!important" ')
					//console.log(that.article)
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
