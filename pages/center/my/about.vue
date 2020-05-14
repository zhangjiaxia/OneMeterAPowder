<template>
	<view class="container" style="background: #FFFFFF;">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="space"><rich-text :nodes="article"></rich-text></view>
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
					iconText: '' //导航栏文字
				},
				article: {}, //关于我们的文章（富文本）
				type: '' //富文本类型,商家入驻，用户指南，新闻资讯，企业动态,关于我们'aboutUs'
			}
		},
		onLoad(options) {
			this.navigationBarStyle.iconText = options.title
			this.type = options.type
			this.getArticle();
		},
		onShow() {
			
		},
		methods: {
			getArticle() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.getArticleKey, {setting_name: this.type}, false).then((res) => {
					that.article = res.data[that.type]
					that.article = that.article.replace(/<img/gi, '<img width="100%!important" ')
					console.log(that.article)
				});
			}
		}
	}
</script>

<style>
.space {
	width: 700rpx;
	margin: 0 auto;
	margin-top: 20rpx;
}
</style>
