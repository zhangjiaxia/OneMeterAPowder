<template>
	<view class="container">
		<view class="content">
			<view class="center">
				<view class="avatar">
					<open-data type="userAvatarUrl"></open-data>
				</view>
				<view>
					<view>可提现金额(元)</view>
					<view class="amount">{{detail.brokerage || '0.00'}}元</view>
				</view>
			</view>
			<view class="form-item">
				<view>收款人姓名</view>
				<input class="form-input" placeholder="请输入收款人姓名" placeholder-style="color:#BFBFBF;" v-model="true_name" />
			</view>
			<view class="form-item">
				<view>开户银行</view>
				<input class="form-input" placeholder="请输入开户银行" placeholder-style="color:#BFBFBF;" v-model="bank" />
			</view>
			<view class="form-item">
				<view>银行卡</view>
				<input class="form-input" type="number" placeholder="请输入银行卡" placeholder-style="color:#BFBFBF;" v-model="bank_card" />
			</view>
			<view class="form-content">
				<view>实际到账金额</view>
				<input type="number" placeholder="请输入提现金额" placeholder-style="color:#BFBFBF;" v-model="amount" />
			</view>
			<view class="remark">注:平台仅支付金额提现,申请提现后48小时内到账</view>

			<view class="btn-container">
				<view class="common-btn" @click="onSubmit">金额提现</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import { apiCashApply, apiUserInfo } from '@/service/index'
	export default {
		data() {
			return {
				true_name: '',
				bank: '',
				bank_card: '',
				amount: '0.00',
				detail: {}
			}
		},
		onShow() {
			// this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				apiUserInfo()
					.then((res) => {
						if (res.code == 0) {
							this.detail = res.data
						}
					})
			},
			transferPage() {
				uni.navigateTo({
					url: '/pages/transfer/transfer'
				});
			},
			onSubmit() {
				if (!this.true_name) {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (!this.bank) {
					uni.showToast({
						title: '请填写开户行',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (!this.bank_card) {
					uni.showToast({
						title: '请填写提现卡号',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (!this.amount) {
					uni.showToast({
						title: '请填写提现金额',
						icon: 'none',
						duration: 2000
					});
					return
				}
				apiCashApply({
						name: this.true_name,
						bank: this.bank,
						bank_card: this.bank_card,
						amount: this.amount
					})
					.then((res) => {
						if (res.code == 0) {
							uni.showToast({
								title: '提交成功',
								duration: 2000
							});
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								})
							}, 2000)
						}
					})
			}
		}
	}
</script>

<style>
	.container {
		padding: 30upx;
	}

	.content {
		background: #ffffff;
		border-radius: 10upx;
		padding-bottom: 30upx;
	}

	.center {
		padding: 30upx;
		background: #0071CF;
		color: #ffffff;
		display: flex;
		align-items: center;
		font-size: 23upx;
		border-radius: 10upx 10upx 0upx 0upx;
	}

	.avatar {
		width: 136upx;
		height: 136upx;
		border-radius: 100%;
		margin-right: 30upx;
		overflow: hidden;
		margin-right: 20upx;
	}

	.amount {
		font-size: 50upx;
		font-weight: bold;
	}

	.form-item {
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		padding: 0upx 30upx;
		border-bottom: 1px solid #E0E0E0;
	}

	.form-content {
		height: 160upx;
		display: flex;
		justify-content: space-between;
		background-color: #ffffff;
		padding: 30upx;
		border-bottom: 1px solid #E0E0E0;
	}

	.form-content input {
		flex: 1;
		text-align: right;
		padding-left: 20upx;
	}

	.form-input {
		text-align: right;
		height: 100%;
		flex: 1;
		padding-left: 20upx;
	}

	.form-label {
		text-align: right;
		height: 100%;
		display: inline-block;
		line-height: 100upx;
		flex: 1;
		padding-left: 20upx;
	}

	.arrow-icon {
		width: 16upx;
		height: 30upx;
		margin-left: 10upx;
	}

	.form-textarea {
		display: flex;
		padding: 30upx;
		background-color: #ffffff;
	}

	.textarea {
		min-height: 200upx;
		padding-top: 6upx;
		padding-left: 10upx;
		flex: 1;
	}

	.default-address {
		margin-top: 20upx;
		background-color: #ffffff;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0upx 30upx;
	}

	.common-btn {
		background: #0071CF;
		color: #ffffff;
		font-size: 34upx;
		height: 39px;
		line-height: 39px;
		text-align: center;
		border-radius: 10upx;
		border: none;
		margin: 0px auto;
		flex: 1;
	}

	.btn-container {
		margin-top: 60upx;
		padding: 0upx 30upx;
		display: flex;
	}

	.remark {
		padding: 0upx 30upx;
		margin-top: 10upx;
		font-size: 23upx;
		color: #999999;
	}
</style>
