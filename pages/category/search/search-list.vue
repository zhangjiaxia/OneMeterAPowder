<template>
	<view>
		<view class="bar-sticky">
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
		</view>
		<view class="goodslist">
			<view class="uni-flex uni-row vertical goods"
				v-for="(item, index) in searchList" :key="index" @click="shopDetailPage(item)">
				<view class="uni-flex">
					<image :src="item.mainImgUrl" class="goodsimg"></image>
				</view>
				<view class="uni-flex uni-column rest info">
					<view class="uni-flex title">{{item.name.substring(0,20) + '...'}}</view>
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
		<view class="empty-text" v-if="searchGoodsPage.total == 0">暂无商品数据</view>
		<view class="empty-text" v-if="(searchList.length == searchGoodsPage.total) && searchList.length > 0">已经到底了</view>
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
					iconText: '搜索商品' //导航栏文字
				},
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
				this.initData();
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
	.search-bar {
		width: 100%;
		position: relative;
		.bar-back {
			margin-left: 30rpx;
			margin-right: 10rpx;
			font-size: 52rpx;
			color: #000000;
		}
		input {
			width:80%;
			height:50rpx;
			background:#EEEEEE;
			box-shadow:0px 2rpx 3rpx 0px rgba(255,255,255,0.2);
			border-radius:25rpx;
		}
		.search {
			width: 460upx;
			height: 60upx;
			background: #EEEEEE;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #000000;
		}
	}
	.goodslist {
		height: auto;
		background: #FFFFFF;
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
