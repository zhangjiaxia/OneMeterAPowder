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
					iconText: '关于我们' //导航栏文字
				},
				article: {} //关于我们的文章（富文本）
			}
		},
		onShow() {
			this.getArticle();
		},
		methods: {
			getArticle() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.getArticleKey, {setting_name: 'aboutUs'}, false).then((res) => {
					that.article = res.data.aboutUs
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
