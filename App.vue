<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		height: 100%;
		font-size: 30upx;
		color: #333333;
	}
	.container{
	  min-height: 100%;
	  background: #EEEEEE;
	  position: relative;
	  box-sizing: border-box;
	}
	.empty-text{
	  text-align: center;
	  font-size: 26upx;
	  color: #999999;
	  padding-top: 50upx;
	}
	.common-btn{
	  width: 100%;
	  height: 39px;
	  line-height: 39px;
	  text-align: center;
	  font-size: 32upx;
	  background: #4C7DE3;
	  border-radius: 10upx;
	  color: #ffffff;
	}
</style>
