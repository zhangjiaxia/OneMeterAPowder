<template>
	<view>
		<view class="title-contents">
			<view class="titles">
				<view class="search-input">
					<view class="icon-search search-icon"></view>
					<input placeholder="女装" placeholder-style="color:#c2c2c2;" v-model="params.keyWord" />
				</view>
				<view class="search-text" @click="search">搜索</view>
			</view>
		</view>
		<view class="goodslist">
			<view class="uni-flex uni-row vertical goods"
				v-for="(item, index) in searchList" :key="index" @click="shopDetailPage(item)">
				<view class="uni-flex">
					<image :src="item.mainImgUrl" class="goodsimg"></image>
				</view>
				<view class="uni-flex uni-column rest info">
					<view class="uni-flex title">{{item.name.substring(0,15) + '...'}}</view>
					<view class="uni-flex subtitle rest">{{item.brandName}}</view>
					<view class="uni-flex uni-row vertical money">
						<view class="uni-flex rest vertical price">
							<text style="font-size: 16rpx;">￥</text>
							<text>{{item.retailPrice[0]}}</text>
						</view>
						<view class="uni-flex">
							<view class="icon-jiahao add"></view>
						</view>
					</view>
					<view class="line"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				searchGoodsPage: {}, //商品搜索数据
				searchList: [], //商品搜索列表
				params: {
					page: 1,
					size: 10,
					keyWord: '' //搜索关键字
				}
			}
		},
		onLoad(options) {
			this.params.keyWord = options.keyword
		},
		onShow() {
			this.initData()
		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.searchList.length >= this.searchGoodsPage.total) {
				return;
			}
			this.params.page++;
			this.getPageGoodsList()
		},
		methods: {
			search() {
				this.getPageGoodsList();
			},
			shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail', 'navigateTo')
			},
			initData() {
				//重置分页参数
				this.specialGoodsData = {}
				this.specialGoodsList = []
				this.params.page = 1
				this.getPageGoodsList();
			},
			getPageGoodsList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.pageGoodsList, this.params).then((res) => {
					that.searchGoodsPage = res.data
					if(that.params.page == 1) {
						that.searchList = res.data.data
					} else {
						that.searchList = that.searchList.concat(res.data.data)
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	.title-contents {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 100;
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
	.goodslist {
		height:280rpx;
		background:rgba(255,255,255,1);
		margin-top: 120rpx;
		.goods {
			height: 280rpx;
			.goodsimg {
				width: 240rpx;
				height: 240rpx;
				margin: 0 20rpx;
			}
			.info {
				height: 220rpx;
				.title {
					font-size: 30rpx;
					color: #333333;
				}
				.subtitle {
					font-size: 24rpx;
					color: #999999;
				}
				.money {
					.price {
						font-size: 30rpx;
						color: #0071CF;
					}
					.add {
						color: #0071CF;
						font-size: 40rpx !important;
						margin-right: 30rpx;
					}
				}
				.line {
					width:470rpx;
					height:1px;
					background:rgba(238,238,238,1);
					position: relative;
					top: 30rpx;
				}
			}
		}
	}
</style>
