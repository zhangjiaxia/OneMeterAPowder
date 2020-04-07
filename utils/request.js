import store from '@/store' //引入全局变量的token
import interfaceurl from './interface.js'

/**
 * 封装微信请求api
 */
const req = {
    /**
     * 判断请求状态是否成功
     * @param {number} status
     */
    isHttpSuccess(status) {
        return (status >= 200 && status < 300) || status === 304;
    },
    /**
     * 提炼错误信息
     * 参数：err
     * 返回值：[string]errMsg
     */
    errPicker(err) {
        if (typeof err === 'string') {
            return err;
        }
        return err.msg || (err.errMsg.indexOf('request:fail') == 0 ? '请求失败，请检查网络是否连接' : err.errMsg) || (err.detail && err.detail.errMsg) || '未知错误';
    },
    /**
     * promise请求
     * @param {object} options {}
     */
    request(options = {}, keepLogin = true) {
		//从小程序本地缓存中获取token
		let token = uni.getStorageSync('token')
		//let token = store.state.token
		const {
			success,
			fail,
		} = options;
		// 统一注入约定的header
		const header = Object.assign({
			'content-type': 'application/json',
			//若是登录(不需要token的)接口则token为空
			token: keepLogin ? token : ''
		}, options.header);
		return new Promise((res, rej) => {
			uni.request(Object.assign({},
				options, {
					header,
					success(r) {
						const isSuccess = req.isHttpSuccess(r.statusCode);
						if (isSuccess) { // 成功的请求状态
							if (success) {
								success(r.data);
								return;
							}
							res(r.data);
						} else {
							const err = {
								msg: `小程序好像出问题了，请与客服联系~（错误代码：${r.statusCode}）`,
								detail: r,
							};
							if (fail) {
								fail(err);
								return;
							}
							rej(err);
						}
					},
					fail(err) {
						if (fail) {
							fail(err);
							return;
						}
						rej(err);
					},
				},
			));
		});
    }
};

export default req;