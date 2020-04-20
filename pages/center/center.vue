<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle" :showBack="false"></navigationBar>
		</view>
		<view class="uni-flex topitem vertical">
			<image src="/static/bg.png" class="bg"></image>
			<authPage>
				<view class="uni-flex uni-row info">
					<view class="uni-flex">
						<image :src="userInfo.avatarUrl || '/static/head.png'" class="head"></image>
					</view>
					<view class="uni-flex uni-column rest">
						<view class="nick">
							{{userInfo.nickName || '御翔绝瞬'}}
							<image src="/static/VIPicon.png" class="gold" v-if="userDetail.is_vip==1"></image>
							<image src="/static/goldactive.png" class="gold" v-if="userDetail.grade==3"></image>
						</view>
						<view @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
							<text style="color: #FFFFFF;">{{userDetail.gradeName}}</text>
							<!-- <image src="/static/silver.png" class="rate" v-if="userDetail.is_vip==1"></image>
							<image src="/static/coconel.png" class="rate" v-else></image> -->
						</view>
						<view class="idnumber">ID:{{userDetail.invitation_code || ''}}</view>
						<view class="time" v-if="userDetail.is_vip==1">VIP会员到期时间：{{userDetail.vip_valid_date || ''}}</view>
					</view>
				</view>
			</authPage>
		</view>
		<authPage>
			<view class="uni-flex uni-row vertical commission" @click="$turnPage('/pages/center/my/cash', 'navigateTo')">
				<view class="uni-flex uni-column rest" style="margin-left: 50rpx;">
					<view class="price">{{userDetail.profit}}</view>
					<view class="canapply">可提佣金</view>
				</view>
				<view class="uni-flex content apply">
					点击提现
				</view>
			</view>
		</authPage>
		<view class="uni-flex uni-column manage">
			<authPage>
				<view class="uni-flex uni-row vertical order" @click="$turnPage('/pages/shopping/trade/order?tabIndex=0', 'navigateTo')">
					<view class="uni-flex rest orderManage">订单管理</view>
					<view class="uni-flex">
						<view class="icon-qianjin back"></view>
					</view>
				</view>
			</authPage>
			<authPage>
				<view class="uni-flex uni-row" style="height: 150rpx;padding-bottom: 28rpx;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?tabIndex=1', 'navigateTo')">
						<image src="/static/waitPay.png" style="width: 44rpx;height: 46rpx;"></image>
						<view class="title">待支付</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?tabIndex=2', 'navigateTo')">
						<image src="/static/sendGoods.png" style="width: 48rpx;height: 46rpx;"></image>
						<view class="title">待发货</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/order?tabIndex=3', 'navigateTo')">
						<image src="/static/waitGoods.png" style="width: 57rpx;height: 46rpx;"></image>
						<view class="title">待收货</view>
					</view>
					<view class="uni-flex rest content" style="position: relative;">
						<image src="/static/afterSale.png" style="width: 48rpx;height: 49rpx;"></image>
						<view class="title">售后</view>
						<button open-type='contact' class="concact">联系客服</button>
					</view>
				</view>
			</authPage>
		</view>
		<view class="uni-flex uni-column manage">
			<view class="uni-flex uni-row vertical order" @click="$turnPage('/pages/shopping/trade/order-logistics', 'navigateTo')">
				<view class="uni-flex rest orderManage">我的服务</view>
			</view>
			<authPage>
				<view class="uni-flex uni-row" style="height: 150rpx;">
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/my-points', 'navigateTo')">
						<image src="/static/commission.png" class="icon"></image>
						<view class="title">积分明细</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/commission-detail', 'navigateTo')">
						<image src="/static/commissionsubsidiary.png" class="icon"></image>
						<view class="title">佣金明细</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/team', 'navigateTo')">
						<image src="/static/team.png" class="icon"></image>
						<view class="title">我的团队</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/income-record', 'navigateTo')">
						<image src="/static/withdrawdetail.png" class="icon"></image>
						<view class="title">提现明细</view>
					</view>
				</view>
				<view class="uni-flex uni-row" style="margin: 28rpx 0;">
					<view class="uni-flex rest content" @click="startShare">
						<image src="/static/my-share.png" class="icon"></image>
						<view class="title">推广分享</view>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/shopping/trade/address', 'navigateTo')">
						<image src="/static/address.png" class="icon"></image>
						<view class="title">收货地址</view>
					</view>
					<view class="uni-flex rest content" style="position: relative;">
						<image src="/static/service.png" class="icon"></image>
						<view class="title">联系客服</view>
						<button open-type='contact' class="concact">联系客服</button>
					</view>
					<view class="uni-flex rest content" @click="$turnPage('/pages/center/my/about', 'navigateTo')">
						<image src="/static/about.png" class="icon"></image>
						<view class="title">关于我们</view>
					</view>
				</view>
			</authPage>
		</view>
		<!--海报分享-->
		<sharePoster :bgImg="bgImg" ref="share"></sharePoster>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import sharePoster from '@/components/shop-business/share-poster.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			authPage,
			navigationBar,
			sharePoster
		},
		computed: mapState(['userInfos']),
		data() {
			return {
				//海报分享背景图
				bgImg: 'https://early-education.oss-cn-beijing.aliyuncs.com/meter_power/default/20200415/adca2eb7dab97a2c39a53f1515128588.png',
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '我的' //导航栏文字
				},
				userInfo: {}, //获取用户信息
				userDetail: {}, //获取用户详情
			}
		},
		watch:{
			userInfos(val) {
				//用户的授权信息存本地，全局变量是为了第一次授权时快速响应
				if(val) {
					this.userInfo = uni.getStorageSync('userInfo')
				}
			}
		},
		onShareAppMessage: function( options ){
		　　var that = this;
		　　// 设置菜单中的转发按钮触发转发事件时的转发内容
		　　var shareObj = {
		　　　　title: that.userInfo.nickName + ' 为您推荐好货', // 默认是小程序的名称(可以写slogan等)
		　　　　path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
		　　　　imageUrl: that.bgImg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
		　　　　success: function(res){
		　　　　　　// 转发成功之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
		　　　　　　}
		　　　　},
		　　　　fail: function(){
		　　　　　　// 转发失败之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
		　　　　　　　　// 用户取消转发
		　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
		　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
		　　　　　　}
		　　　　},
		　　　　complete: function(){
		　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
		　　　　}
		　　};
		　　// 来自页面内的按钮的转发
		　　if( options.from == 'button' ){
		　　　　var eData = options.target.dataset;
		　　　　console.log( eData.name );     // shareBtn
		　　　　// 此处可以修改 shareObj 中的内容
		　　　　//shareObj.path = '/pages/btnname/btnname?btn_name='+eData.name;
		　　}
		　　// 返回shareObj
		　　return shareObj;
		},
		onLoad() {
			
		},
		onShow() {
			let token = uni.getStorageSync('token')
			this.userInfo = this.userInfos.nickName ? this.userInfos : uni.getStorageSync('userInfo')
			if(token) {
				this.getUserDetail()
			}
		},
		methods: {
			//获取用户详情
			getUserDetail() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
					that.userDetail = res.data
				});
			},
			/*海报相关*/
			startShare() {
				this.$refs.share.getQrcode()
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
	.topitem {
		height: 220rpx;
		position: relative;
		.bg {
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: -1;
		}
	}
	.info {
		width: 100%;
		view {
			line-height: 1.5;
		}
		.head {
			width: 120rpx;
			height: 120rpx;
			margin-left: 50rpx;
			margin-right: 20rpx;
			border-radius: 50%;
		}
		.rate {
			width: 60rpx;
			height: 30rpx;
		}
		.arrow {
			width: 17rpx;
			height: 26rpx;
		}
		.nick {
			font-size:30rpx;
			color: #FFFFFF;
			.gold {
				width: 40rpx;
				height: 31rpx;
				margin-left: 16rpx;
			}
		}
		.idnumber {
			color: #FFFFFF;
			font-size: 20rpx;
		}
		.time {
			font-size:20rpx;
			color: #FFFFFF;
		}
	}
	.commission {
		width:100%;
		height:100rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 2px 11px 0px rgba(4,0,0,0.06);
		margin: 20rpx 0;
		view {
			line-height: 1.2;
		}
		.price {
			color: #EB524B;
			font-weight: bold;
			font-size: 36rpx;
		}
		.canapply {
			color: #A9A6A9;
			font-size: 22rpx;
		}
		.apply {
			width:150rpx;
			height:50rpx;
			background:#EB524B;
			border-radius:25rpx;
			color: #FFFFFF;
			margin-right: 30rpx;
		}
	}
	.manage {
		background: #FFFFFF;
		margin-bottom: 20rpx;
		.order {
			border-bottom: 1px solid #F9F7F9;
			height: 80rpx;
			.orderManage {
				font-size: 30rpx;
				color: #333333;
				margin-left: 30rpx;
			}
			.back {
				font-size: 26rpx !important;
				margin-right: 30rpx;
			}
		}
		.title {
			font-size: 24rpx;
			color: #333333;
			margin-top: 10rpx;
		}
		.icon {
			// font-size: 60rpx;
			// color: #333333;
			width: 60rpx;
			height: 60rpx;
		}
		.icon-active {
			color: #0071CF;
		}
	}
	.concact {
		position: absolute;
		width: 100rpx;
		height: 110rpx;
		top: 0;
		opacity: 0;
	}
</style>
