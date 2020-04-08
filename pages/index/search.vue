<template>
	<view class="container">

		<view class="title-contents">
			<view class="titles">
				<view class="search-input">
					<image src="/static/search.png" class="search-icon"></image>
					<input placeholder="女装" placeholder-style="color:#c2c2c2;" />
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
				<image src="/static/delete-icon.png" class="delete-icon" @click="deleteRecord"></image>
			</view>
			<view class="record-list">
				<text v-for="(item,index) in recordList" :key="index" class="record-item">{{item}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	// import { apiSearchRecord } from '../../service/index'
	export default {
		data() {
			return {
				recordList: ['美食', '护肤', '生活百货', '巧克力'],
				searchList: ['美食', '护肤', '生活百货', '巧克力', '口红', '运动衫', '手表']
			}
		},
		onShow() {
			// this.getSearchList()
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			getSearchList() {
				apiSearchRecord()
					.then((res) => {
						if (res.code == 200) {
							this.recordList = res.data
						}
					})
			},
			deleteRecord() {
				this.recordList = []
			},
			searchPage(item) {
				uni.navigateTo({
					url: '/pages/shop-list/shop-list?keyword=' + item
				});
			},
			search() {
				uni.navigateTo({
					url: '/pages/shop-list/shop-list'
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
		width: 30upx;
		height: 30upx;
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
		width: 32upx;
		height: 32upx;
	}
</style>
