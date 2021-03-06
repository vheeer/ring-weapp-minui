// const url = 'http://127.0.0.1:8361/api/';
const url = 'https://www.dapingkeji.cn/ring/api/';

module.exports = {
	urls: {
		GetExecute: url + 'custom/match',
		UpdateExecute: url + 'custom/update',
		Register: url + 'custom/register',

		TargetUpdateP: url + 'target/updatep',

		Login: url + 'auth/login', //微信登录
		GetMobile: url + 'auth/getmobile', //获取手机号

		UploadIdCard: url + 'custom/idcard', //上传身份证
		UploadUserDetail: url + 'custom/update', //上传详细资料
		GetUserInfo: url + 'custom/getuserinfo',

		GoodDetail: url + 'goods/find',

		OrderStart: url + 'order/start', //生成订单
		OrderFirst: url + 'order/first', //拉取最新订单
		OrderList: url + 'order/match', //拉取最新订单
	}
};