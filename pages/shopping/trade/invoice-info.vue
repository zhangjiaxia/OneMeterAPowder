<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '发票信息' //导航栏文字
				},
			}
		},
		onShow() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
</style>
