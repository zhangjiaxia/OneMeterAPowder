<template>
	<view style="padding-top: 20rpx;">
		<view v-if="isUpgrade == 'true'">
			<view class="title">VIP会员升级规则</view>
			<view class="space">
				<view class="section">
					1、一级VIP会员数量1名以上9名以下，普通会员升级为白银会员。
					待遇：享有对一级VIP会员的58元/名/每年的佣金收益，但无权享
					有二级VIP会员的38元/名/年的佣金收益。
				</view>
				<view class="section">
					2、一级VIP会员数量10名以上，白银会员升级为黄金会员。待
					遇：享有对一级VIP会员的58元/名/每年的佣金收益及二级VIP会
					员的38元/名/年的佣金收益。
				</view>
				<view class="section">
					3、VIP会员级别升级成功后，永远有效，不因一级VIP会员数量变
					化而降级。
				</view>
				<view class="section">
					4、一米平台对VIP会员升级规则拥有最终解释权。
				</view>
			</view>
		</view>
		<view v-else>
			<view class="title">VIP会员规则</view>
			<view class="space">
				<view class="define">一、定义解释</view>
				<view class="section">
					1、用户等级：以用户发展VIP会员数量作为评定用户级别的标准
					和享受不同权限的用户等级分类（用户自身是否充值成为VIP会员
					不影响对用户自身的等级评定）。
				</view>
				<view class="section">
					2、VIP会员：特指本商城成功充值（299元/名/年）的VIP会员，
					能享受VIP价格购买商品的会员；未充值VIP的即为普通粉丝，普
					通粉丝不纳入等级考核。
				</view>
				<view class="section">
					3、用户等级：普通用户，白银用户，黄金用户。
				</view>
				<view class="section">
					4、粉丝级别：一级粉丝指由本人用自己指定的微信分享成功发展
					的粉丝群体；二级粉丝指由本人发展的粉丝群体再次分享成功发
					展的粉丝群体。
				</view>
				<view class="section">
					5、VIP分类：一级VIP会员是指一级粉丝中充值成功的会员；二级
					VIP会员是指二级粉丝中充值成功的会员。
				</view>
				<view class="section">
					6、等级权限：指享受一级佣金58元/名/年的奖励和二级佣金38元
					/名/年的奖励的权限。
				</view>
				<view class="section">
					7、普通用户：指一级VIP会员数量为0的用户，（二级VIP数量不
					一定为0）。
				</view>
				<view class="section">
					8、白银用户：该用户发展的一级VIP会员数量≥1且≤9，即升级
					为白银用户，对该用户发展的一级VIP会员享受58元/户/年的佣
					金奖励，二级VIP会员充值不享受佣金奖励。
				</view>
				<view class="section">
					9、黄金用户：该用户发展的一级VIP会员数量≥10，即升级为黄
					金用户，对该用户发展的一级VIP会员享受58元/户/年的佣金奖
					励，二级VIP会员享受38元/户/年的佣金奖励。
				</view>                       
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isUpgrade: true //是否显示升级规则
			}
		},
		onLoad(options) {
			console.log('options', options)
			this.isUpgrade = options.isUpgrade
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.title {
		color: #333333;
		font-size: 30rpx;
		text-align: center;
		margin-bottom: 24rpx;
	}
	.space {
		margin-left: 30rpx;
		margin-right: 25rpx;
	}
	.section, .define {
		font-size: 24rpx;
		color: #666666;
	}
	.section {
		margin-bottom: 40rpx;
	}
</style>
