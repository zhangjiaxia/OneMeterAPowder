<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="container">
			<view class="content">
				<view class="center">
					<view class="avatar">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<view>
						<view>可提现佣金(元)</view>
						<view class="amount">{{userDetail.profit || '0.00'}}元</view>
					</view>
				</view>
				<view class="form-item">
					<view>收款人姓名</view>
					<input class="form-input" placeholder="请输入收款人姓名" placeholder-style="color:#BFBFBF;" v-model="params.name" />
				</view>
				<view class="form-item">
					<view>提现金额</view>
					<input class="form-input" placeholder="请填写提现金额" placeholder-style="color:#BFBFBF;" v-model="params.amount" />
				</view>
				<view class="form-item">
					<view>银行卡号</view>
					<input class="form-input" type="number" placeholder="请填写银行卡号" placeholder-style="color:#BFBFBF;" v-model="params.bank_card" />
				</view>
				<view class="form-item">
					<view>开户银行</view>
					<input class="form-input" placeholder="请填写开户银行" placeholder-style="color:#BFBFBF;" v-model="params.bank" />
				</view>
				<view class="form-item">
					<view>身份证</view>
					<input class="form-input" placeholder="请填写身份证号" placeholder-style="color:#BFBFBF;" v-model="params.id_card_number" />
				</view>
				<view class="form-item">
					<view>联系电话</view>
					<input class="form-input" placeholder="请填写联系电话" placeholder-style="color:#BFBFBF;" v-model="params.mobile" />
				</view>
				<!-- <view class="form-content">
					<view>实际到账金额</view>
					<input type="number" placeholder="请输入提现金额" placeholder-style="color:#BFBFBF;" v-model="amount" />
				</view> -->
				<view class="remark">注:平台仅支付金额提现,申请提现后48小时内到账</view>
		
				<view class="btn-container">
					<view class="common-btn" @click="onSubmit">确定提现</view>
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
					iconText: '我要提现' //导航栏文字
				},
				userDetail: {}, //获取用户详情
				//提现参数
				params : {
					id_card_number: '', //身份证号
					mobile: '', //手机号
					name: '', //姓名
					bank: '', //开户行
					bank_card: '', //银行卡号
					amount: 0 //提现金额
				}
			}
		},
		onShow() {
			this.getUserDetail()
		},
		methods: {
			//获取用户详情
			getUserDetail() {
				let that = this
				interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
					that.userDetail = res.data
				});
			},
			onSubmit() {
				if (!this.params.name) {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (!this.params.bank) {
					uni.showToast({
						title: '请填写开户行',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (!this.params.bank_card) {
					uni.showToast({
						title: '请填写提现卡号',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (!this.params.amount) {
					uni.showToast({
						title: '请填写提现金额',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if(!this.params.id_card_number) {
					uni.showToast({
						title: '请填写身份证号',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if(!this.params.mobile) {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if(parseFloat(this.params.amount) > parseFloat(this.userDetail.profit)) {
					uni.showToast({
						title: '提现金额不能大于可提现佣金',
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (parseFloat(this.params.amount) <= 100) {
					uni.showToast({
						title: '提现金额必须大于100',
						icon: 'none',
						duration: 2000
					});
					return
				}
				let that = this
				interfaceurl.checkAuth(interfaceurl.cashOutSubmit, this.params).then((res) => {
					uni.showToast({
					    title: '提现申请已发送',
					    icon: 'none',
					    duration: 2000
					});
				});
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
