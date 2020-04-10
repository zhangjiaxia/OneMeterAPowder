<template>
	<view class="container">

		<view class="title-contents">
			<view class="titles">
				<view class="search-input">
					<!-- <image src="/static/search.png" class="search-icon"></image> -->
					<view class="icon-search search-icon"></view>
					<input placeholder="女装" placeholder-style="color:#c2c2c2;" v-model="params.keyWord" />
				</view>
				<view class="search-text" @click="search">搜索</view>
			</view>
		</view>

		<view class="search-content">
			<view class="search-title">热门搜索</view>
			<view class="record-list">
				<text v-for="(item,index) in searchList" :key="index" class="record-item" @click="searchPage(item)">{{item}}</text>
			</view>
		</view>

		<view class="search-content" v-show="recordList.length">
			<view class="search-title">
				<text>搜索记录</text>
				<view class="icon-shanchu delete-icon" @click="deleteRecord"></view>
			</view>
			<view class="record-list">
				<text v-for="(item,index) in recordList" :key="index" class="record-item" @click="searchPage(item)">{{item}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				recordList: ['美食', '护肤', '生活百货', '巧克力'],
				searchList: ['美食', '护肤', '生活百货', '巧克力', '口红', '运动衫', '手表'],
				params: {
					page: 1,
					size: 10,
					keyWord: '' //搜索关键字
				}
			}
		},
		onShow() {
			
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			deleteRecord() {
				this.recordList = []
			},
			searchPage(item) {
				uni.navigateTo({
					url: '/pages/category/search/search-list?keyword=' + item
				});
			},
			search() {
				if(!this.params.keyWord) {
					uni.showToast({
					    title: '搜索关键字不能为空',
					    icon: 'none',
					    duration: 2000
					});
					return;
				}
				uni.navigateTo({
					url: '/pages/category/search/search-list?keyword=' + this.params.keyWord
				});
			}
		}
	}
</script>

<style>
	.container {
		background-color: #ffffff;
		padding-top: 50px;
	}

	.title-contents {
		width: 100%;
		position: fixed;
		top: 0;
	}

	.titles {
		height: 50px;
		color: #ffffff;
		background: #0070CF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0upx 30upx;
	}

	.search-input {
		height: 60upx;
		background-color: #ffffff;
		flex: 1;
		margin-left: 30upx;
		margin-right: 30upx;
		border-radius: 8upx;
		display: flex;
		align-items: center;
		padding: 10upx 20upx;
		box-sizing: border-box;
	}

	.search-icon {
		font-size: 30rpx !important;
		margin-right: 10upx;
	}

	.search-input input {
		height: 100%;
		flex: 1;
		color: #333333;
	}

	.return-icon {
		width: 20upx;
		height: 36upx;
	}

	.search-text {
		font-size: 36upx;
	}

	input {
		caret-color: #FF585C;
	}

	.search-content {
		padding: 0upx 30upx;
		margin-top: 40upx;
	}

	.search-title {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30upx;
		font-size: 32upx;
	}

	.record-list {
		display: flex;
		flex-wrap: wrap;
	}

	.record-item {
		display: inline-block;
		padding: 0upx 30upx;
		height: 53upx;
		line-height: 53upx;
		background-color: #f4f4f4;
		text-align: center;
		color: #666666;
		font-size: 26upx;
		border-radius: 26upx;
		margin-right: 30upx;
		margin-bottom: 30upx;
	}

	.delete-icon {
		font-size: 32rpx !important;
	}
</style>
