<template>
	<view>
		<navigationBar custom="true">
			<view class="uni-flex uni-row vertical search-bar">
				<view class="icon-fanhui bar-back"
					@click="$turnPage('1', 'navigateBack')">
				</view>
				<view class="">
					<view class="uni-flex uni-row vertical search">
						<input placeholder="女装" v-model="params.keyWord" @confirm="search"/>
					</view>
				</view>
			</view>
		</navigationBar>
		<view class="container">
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
					background: '#0071CF',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '搜索' //导航栏文字
				},
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

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	page {
		background: #F0EDF1;
	}
	.search-bar {
		width: 100%;
		position: relative;
		.bar-back {
			margin-left: 30rpx;
			margin-right: 24rpx;
			font-size: 52rpx;
			color: #FFFFFF;
		}
		input {
			width:80%;
			height:50rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px 2rpx 3rpx 0px rgba(255,255,255,0.2);
			border-radius:25rpx;
		}
		.search {
			width: 460upx;
			height: 60upx;
			background: #ffffff;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #000000;
		}
	}
	.container {
		background-color: #ffffff;
		padding-top: 20rpx;
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
