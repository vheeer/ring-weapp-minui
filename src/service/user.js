/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const { urls } = require('../config/config.js');


/**
 * 调用微信登录
 */
function login() {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then(res => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      //登录远程服务器
      util.request(urls.Login, { code, userInfo }, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 调用微信登录
 */
function getmobile({ iv, encryptedData }) {
  return new Promise((resolve, reject) => {
    return util.request(urls.GetMobile, { iv, encryptedData }, 'POST')
    .then(res => {
      if (res.errno === 0) {
        //存储用户信息
        const userInfo = wx.getStorageSync('userInfo');
        userInfo.mobile = res.data;
        wx.setStorageSync('userInfo', userInfo);

        resolve(res);
      } else {
        reject(res);
      }
    })
  })
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}


module.exports = {
  login,
  checkLogin,
  getmobile
};