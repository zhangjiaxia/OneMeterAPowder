<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view style="position: relative;">
			<image src="https://early-education.oss-cn-beijing.aliyuncs.com/meter_power/default/20200429/4a60f202545b5573c60eb13217913bca.png"
				style="width: 750rpx;height: 2657rpx;"></image>
			<view class="more-rule" @click="$turnPage('/pages/vip/rule/vip-rule?isUpgrade='+false, 'navigateTo')">查看更多VIP规则</view>
			<view class="more-vip" @click="$turnPage('/pages/vip/rule/vip-rule?isUpgrade='+true, 'navigateTo')">查看更多</view>
		</view>
	</view>
	<!-- <view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view>
			<image src="/static/rule.png" class="ruleimg"></image>
		</view>
		<view class="space">
			<view class="title layout">一、用户等级升级条件、权益。</view>
			<view class="wordspace" style="margin-bottom: 10rpx;">
				<view class="subtitle">
					1.团长
				</view>
				<view class="base">
					<text class="active">升级条件：</text>邀请一级VIP会员1名以上，即可直接升级。
				</view>
				<view class="base">
				    <text class="active">享受权益：</text>
					每邀请一级VIP会员一名，获得58元/名/年佣金奖
					励，一级VIP会员届满一年，续费再得58元/名/年佣金奖励。               
				</view>
			</view>
			<view class="wordspace">
				<view class="subtitle">
					2.店长
				</view>
				<view class="base">
					<text class="active">升级条件：</text>邀请一级VIP会员10名以上，即可直接升级。
				</view>
				<view class="base">
				    <text class="active">享受权益：</text>
					每邀请一级VIP会员一名，获得58元/名/年佣金奖
					励。二级VIP会员每增加一名，获得38元/名/年佣金奖励（升级
					前的不计入奖励）。一级VIP会员届满一年，续费再得58元/名/
					年佣金奖励。二级VIP会员届满一年，续费再得38元/名/年佣金奖励。          
				</view>
			</view>
			<view class="wordspace" style="margin-bottom: 10rpx;">
				<view class="subtitle">
					3.运营商
				</view>
				<view class="base">
					<text class="active">升级条件：</text>一次性缴纳1万元升级费，即可以直接升级运营商
				</view>
				<view class="base">
				    <text class="active">享受权益：</text>
					每邀请一级VIP会员一名，获得108元/名/年佣金
					奖励；二级VIP会员每增加一名，获得88元/名/年佣金奖励。
				</view>
			</view>
			<view class="more" @click="$turnPage('/pages/vip/rule/vip-rule?isUpgrade='+false, 'navigateTo')">查看更多VIP规则</view>
			<view class="uni-flex vertical" style="margin-top: 41rpx;margin-bottom: 18rpx;">
				<view class="uni-flex title rest">二、等级对比表</view>
				<view class="uni-flex more" @click="$turnPage('/pages/vip/rule/vip-rule?isUpgrade='+true, 'navigateTo')">查看更多</view>
			</view>
		</view>
		<view class="uni-flex uni-column table">
			<view class="uni-flex uni-row rest split">
				<view class="uni-flex rest content vsplit">用户等级</view>
				<view class="uni-flex uni-column rest content vsplit">
					<view class="uni-flex">一级VIP</view>
					<view class="uni-flex">发展数量</view>
				</view>
				<view class="uni-flex rest content vsplit">
					<view class="uni-flex">一级VIP</view>
					<view class="uni-flex">佣金奖励</view>
				</view>
				<view class="uni-flex rest content">
					<view class="uni-flex">二级VIP</view>
					<view class="uni-flex">佣金奖励</view>
				</view>
			</view>
			<view class="uni-flex uni-row rest split">
				<view class="uni-flex rest content vsplit">普通用户</view>
				<view class="uni-flex rest content vsplit">0</view>
				<view class="uni-flex rest content vsplit">无权限</view>
				<view class="uni-flex rest content">无权限</view>
			</view>
			<view class="uni-flex uni-row rest split">
				<view class="uni-flex rest content vsplit">团长用户</view>
				<view class="uni-flex rest content vsplit">≥1；≤9</view>
				<view class="uni-flex rest content vsplit">58元/户/年</view>
				<view class="uni-flex rest content">无权限</view>
			</view>
			<view class="uni-flex uni-row rest split">
				<view class="uni-flex rest content vsplit">店长用户</view>
				<view class="uni-flex rest content vsplit">≥10</view>
				<view class="uni-flex rest content vsplit">58元/户/年</view>
				<view class="uni-flex rest content">38元/户/年</view>
			</view>
			<view class="uni-flex uni-row rest">
				<view class="uni-flex rest content vsplit">运营商</view>
				<view class="uni-flex rest content vsplit">
					<view style="text-align: center;">
						<view>升级费</view>
						<view>10000元</view>
					</view>
				</view>
				<view class="uni-flex rest content vsplit">108元/户/年</view>
				<view class="uni-flex rest content">88元/户/年</view>
			</view>
		</view>
		<view class="space">
			<view class="remark">*VIP会员届满一年后再续年费，用户按等级标准再得奖励，发展VIP数量不增加。</view>
			<view class="uni-flex title rest">三、提现规则</view>
			<view class="bottompoint">
				<view class="point">1.每满100元即可提现；</view>
				<view class="point">2.每周三作为提现日，提现后需财务审核，预计五个工作日到账；</view>
				<view class="point">3.提现手续费1%；</view>
			</view>
		</view>
	</view> -->
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
					iconText: '佣金规则' //导航栏文字
				},
				isUpgrade: true //是否显示升级规则
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	.more-rule {
		position: absolute;
		width: 240rpx;
		height: 50rpx;
		top: 1440rpx;
		right: 38rpx;
		opacity: 0;
		background: black;
	}
	.more-vip {
		position: absolute;
		width: 130rpx;
		height: 50rpx;
		top: 1660rpx;
		right: 38rpx;
		opacity: 0;
		background: black;
	}
	/*隐藏滚动条,只能使用于在scroll-view中*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
	.ruleimg {
		height: 230rpx;
		width: 100%;
	}
	.space {
		width: 664rpx;
		margin-top: 49rpx;
		margin: 0 auto;
		color: #333333;
		font-size: 24rpx;
		.title {
			font-size: 30rpx;
			font-weight:bold;
		}
		.layout {
			margin-top: 30rpx;
			margin-bottom: 20rpx;
		}
		.subtitle {
			font-weight: bold;
		}
		.base {
			color: #666666;
			font-size: 24rpx;
		}
		.active {
			color: #ff0033;
			margin-left: 20rpx;
		}
	}
	.more {
		font-size: 20rpx;
		color: #ff0033;
		text-decoration:underline;
	}
	.remark {
		font-size: 24rpx;
		color: #999999;
		margin-bottom: 20rpx;
	}
	.bottompoint {
		width: 700rpx;
		margin-top: 20rpx;
		margin-bottom: 40rpx;
	}
	.point {
		font-size: 24rpx;
		color: #666666;
	}
	.table {
		background: #444444;
		color: #FFE1A5;
		width: 702rpx;
		height: 602rpx;
		margin: 0 auto;
		border-radius: 10rpx;
		.split {
			border-bottom: 1px solid #FFE1A5;
		}
		.vsplit {
			border-right: 1px solid #FFE1A5;
		}
	}
</style>
