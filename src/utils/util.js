var { urls } = require('../config/config.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 请求
 */
function request(
  url, 
  data = {}, 
  method = "GET", 
  header = {}
) {
  Object.assign(header, {
    'Content-Type': 'application/json',
    'X-Nideshop-Token': wx.getStorageSync('token')
  });
  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.errno == 401) {
            //需要登录后才可以操作
            let code;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(urls.GetUserInfo, { code, userInfo }, 'POST').then(res => {
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
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          console.log(res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res)
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

/*
本地储存的用户信息写入本页面
*/
function storage2data(_this) {
  const userInfo = wx.getStorageSync('userInfo')
  if (!userInfo || Object.getOwnPropertyNames(userInfo).length === 0) {
    // 用户信息不存在或者空对象
    return;
  }
  if (_this.userInfo && _this.userInfo.id && _this.userInfo.mobile) {
    // 页面已经存在用户信息
    return;
  }
  _this.userInfo = userInfo
  _this.$apply();
}

module.exports = {
  formatTime,
  request,
  login,
  getUserInfo,
  storage2data
}
