<template>
	<view class="container">
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		关于我们的说明。
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
					iconText: '关于我们' //导航栏文字
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
