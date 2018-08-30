'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

require('./npm/wepy-async-function/index.js');

var _wepyRedux = require('./npm/wepy-redux/lib/index.js');

var _store = require('./store/index.js');

var _store2 = _interopRequireDefault(_store);

var _user = require('./service/user.js');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var store = (0, _store2.default)();
(0, _wepyRedux.setStore)(store);

var _default = function (_wepy$app) {
  _inherits(_default, _wepy$app);

  function _default() {
    _classCallCheck(this, _default);

    var _this2 = _possibleConstructorReturn(this, (_default.__proto__ || Object.getPrototypeOf(_default)).call(this));

    _this2.config = {
      'pages': ['pages/index', 'pages/ucenter'],
      'window': {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: 'WeChat',
        navigationBarTextStyle: 'black'
      },
      'tabBar': {
        'backgroundColor': '#fafafa',
        'borderStyle': 'white',
        'selectedColor': '#b4282d',
        'color': '#666',
        'list': [{
          'pagePath': 'pages/index',
          'text': '首页',
          'iconPath': './static/image/home.png',
          'selectedIconPath': './static/image/home.png'
        }, {
          'pagePath': 'pages/ucenter',
          'text': '我的',
          'iconPath': './static/image/ucenter.png',
          'selectedIconPath': './static/image/ucenter.png'
        }]
      },
      // 需要修改为Promise形式的wxAPI
      'promisify': ['scanCode', 'switchTab', 'navigateTo', 'showModal', 'uploadFile', 'chooseImage', 'makePhoneCall']
    };
    _this2.globalData = {
      userInfo: null
    };

    _this2.Format = function (fmt) {
      var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return fmt;
    };

    _this2.LeftTimer = function (timestamp) {
      this.time = {};
      // 将0-9的数字前面加上0，例1变为01
      this.checkTime = function (i) {
        if (i < 10) {
          i = '0' + i;
        } else {
          i = '' + i;
        }
        return i;
      };
      // 检测是否为 '00'
      this.isEmpty = function (x) {
        if (x === '00') {
          return true;
        }
      };
      // 如“00小时00分钟10秒”这种格式,将转换为“10秒”
      this.checkZero = function () {
        var _this = this;
        var haveFirstNotEmptyValue = false;

        Object.keys(_this.time).forEach(function (key) {
          if (_this.isEmpty(_this.time[key])) {
            _this[key + '_str'] = '';
            if (haveFirstNotEmptyValue) {
              _this[key + '_str'] = _this[key + '_str'];
            }
          } else {
            _this[key + '_str'] = _this[key + '_str'];
            haveFirstNotEmptyValue = true;
          }
        });
      };

      var _this = this;

      this.time.days = parseInt(timestamp / 1000 / 60 / 60 / 24, 10); // 计算剩余的天数
      this.time.hours = parseInt(timestamp / 1000 / 60 / 60 % 24, 10); // 计算剩余的小时
      this.time.minutes = parseInt(timestamp / 1000 / 60 % 60, 10); // 计算剩余的分钟
      this.time.seconds = parseInt(timestamp / 1000 % 60, 10); // 计算剩余的秒数

      Object.keys(_this.time).forEach(function (key) {
        _this.time[key] = _this.checkTime(_this.time[key]);
      });

      this['days_str'] = this.time['days'] + '天';
      this['hours_str'] = this.time['hours'] + '小时';
      this['minutes_str'] = this.time['minutes'] + '分钟';
      this['seconds_str'] = this.time['seconds'] + '秒';

      this.checkZero();
      this.string = '' + this['days_str'] + this['hours_str'] + this['minutes_str'] + this['seconds_str'];
    };

    _this2.use('requestfix');
    return _this2;
  }

  _createClass(_default, [{
    key: 'onLaunch',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this3 = this;

        var loginResult;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 函数Promise化
                this.config['promisify'].forEach(function (item) {
                  wx[item + 'P'] = _this3.wxPromisify(wx[item]);
                });
                Object.assign(Date.prototype, { Format: this.Format });
                Object.assign(Date.prototype, { LeftTimer: this.LeftTimer });
                console.log(Date.prototype);

                wx.clearStorage();
                _context.next = 7;
                return _user2.default.login();

              case 7:
                loginResult = _context.sent;

                console.log('loginResult', loginResult);
                // request(api.AuthLoginByWeixin, { code, userInfo }, 'POST')
                // .then(res => {
                //   console.log('登录结果: ', res)
                // });

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onLaunch() {
        return _ref.apply(this, arguments);
      }

      return onLaunch;
    }()

    // 日期格式化


    // 用时

  }, {
    key: 'wxPromisify',
    value: function wxPromisify(fn) {
      return function () {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
          obj.success = function (res) {
            console.log('Promise success 返回参数：', res);
            resolve(res);
          };
          obj.fail = function (res) {
            console.warn('Promise fail 返回参数：', res);
            reject(res);
          };
          fn(obj); // 执行函数，obj为传入函数的参数
        });
      };
    }
  }, {
    key: 'getUserInfo',
    value: function getUserInfo(cb) {
      var that = this;
      if (this.globalData.userInfo) {
        return this.globalData.userInfo;
      }
      _wepy2.default.getUserInfo({
        success: function success(res) {
          that.globalData.userInfo = res.userInfo;
          cb && cb(res.userInfo);
        }
      });
    }
  }]);

  return _default;
}(_wepy2.default.app);


App(require('./npm/wepy/lib/wepy.js').default.$createApp(_default, {"noPromiseAPI":["createSelectorQuery"]}));
require('./_wepylogs.js')

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJzdG9yZSIsImNvbmZpZyIsImJhY2tncm91bmRUZXh0U3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJUZXh0U3R5bGUiLCJnbG9iYWxEYXRhIiwidXNlckluZm8iLCJGb3JtYXQiLCJmbXQiLCJvIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIk1hdGgiLCJmbG9vciIsImdldE1pbGxpc2Vjb25kcyIsInRlc3QiLCJyZXBsYWNlIiwiUmVnRXhwIiwiJDEiLCJnZXRGdWxsWWVhciIsInN1YnN0ciIsImxlbmd0aCIsImsiLCJMZWZ0VGltZXIiLCJ0aW1lc3RhbXAiLCJ0aW1lIiwiY2hlY2tUaW1lIiwiaSIsImlzRW1wdHkiLCJ4IiwiY2hlY2taZXJvIiwiX3RoaXMiLCJoYXZlRmlyc3ROb3RFbXB0eVZhbHVlIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJkYXlzIiwicGFyc2VJbnQiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmRzIiwic3RyaW5nIiwidXNlIiwid3giLCJpdGVtIiwid3hQcm9taXNpZnkiLCJhc3NpZ24iLCJEYXRlIiwicHJvdG90eXBlIiwiY29uc29sZSIsImxvZyIsImNsZWFyU3RvcmFnZSIsInVzZXJTZXJ2aWNlIiwibG9naW4iLCJsb2dpblJlc3VsdCIsImZuIiwib2JqIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdWNjZXNzIiwicmVzIiwiZmFpbCIsIndhcm4iLCJjYiIsInRoYXQiLCJ3ZXB5IiwiZ2V0VXNlckluZm8iLCJhcHAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxRQUFRLHNCQUFkO0FBQ0EseUJBQVNBLEtBQVQ7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QyxHQUFSLENBQVksYUFBWixFQUEyQkksV0FBM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHRjs7O0FBc0JBOzs7O2dDQXdEWUMsRSxFQUFJO0FBQ2QsYUFBTyxZQUFvQjtBQUFBLFlBQVZDLEdBQVUsdUVBQUosRUFBSTs7QUFDekIsZUFBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDSCxjQUFJSSxPQUFKLEdBQWMsVUFBVUMsR0FBVixFQUFlO0FBQzNCWixvQkFBUUMsR0FBUixDQUFZLHVCQUFaLEVBQXFDVyxHQUFyQztBQUNBSCxvQkFBUUcsR0FBUjtBQUNELFdBSEQ7QUFJQUwsY0FBSU0sSUFBSixHQUFXLFVBQVVELEdBQVYsRUFBZTtBQUN4Qlosb0JBQVFjLElBQVIsQ0FBYSxvQkFBYixFQUFtQ0YsR0FBbkM7QUFDQUYsbUJBQU9FLEdBQVA7QUFDRCxXQUhEO0FBSUFOLGFBQUdDLEdBQUgsRUFUc0MsQ0FTOUI7QUFDVCxTQVZNLENBQVA7QUFXRCxPQVpEO0FBYUQ7OztnQ0FFV1EsRSxFQUFJO0FBQ2QsVUFBTUMsT0FBTyxJQUFiO0FBQ0EsVUFBSSxLQUFLaEUsVUFBTCxDQUFnQkMsUUFBcEIsRUFBOEI7QUFDNUIsZUFBTyxLQUFLRCxVQUFMLENBQWdCQyxRQUF2QjtBQUNEO0FBQ0RnRSxxQkFBS0MsV0FBTCxDQUFpQjtBQUNmUCxlQURlLG1CQUNOQyxHQURNLEVBQ0Q7QUFDWkksZUFBS2hFLFVBQUwsQ0FBZ0JDLFFBQWhCLEdBQTJCMkQsSUFBSTNELFFBQS9CO0FBQ0E4RCxnQkFBTUEsR0FBR0gsSUFBSTNELFFBQVAsQ0FBTjtBQUNEO0FBSmMsT0FBakI7QUFNRDs7OztFQWhMMEJnRSxlQUFLRSxHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5J1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nXHJcblxyXG5pbXBvcnQgeyBzZXRTdG9yZSB9IGZyb20gJ3dlcHktcmVkdXgnXHJcbmltcG9ydCBjb25maWdTdG9yZSBmcm9tICcuL3N0b3JlJ1xyXG5pbXBvcnQgdXNlclNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlL3VzZXInXHJcblxyXG5jb25zdCBzdG9yZSA9IGNvbmZpZ1N0b3JlKClcclxuc2V0U3RvcmUoc3RvcmUpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIHdlcHkuYXBwIHtcclxuICBjb25maWcgPSB7XHJcbiAgICAncGFnZXMnOiBbXHJcbiAgICAgICdwYWdlcy9pbmRleCcsXHJcbiAgICAgICdwYWdlcy91Y2VudGVyJ1xyXG4gICAgXSxcclxuICAgICd3aW5kb3cnOiB7XHJcbiAgICAgIGJhY2tncm91bmRUZXh0U3R5bGU6ICdsaWdodCcsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcclxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ1dlQ2hhdCcsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJUZXh0U3R5bGU6ICdibGFjaydcclxuICAgIH0sXHJcbiAgICAndGFiQmFyJzoge1xyXG4gICAgICAnYmFja2dyb3VuZENvbG9yJzogJyNmYWZhZmEnLFxyXG4gICAgICAnYm9yZGVyU3R5bGUnOiAnd2hpdGUnLFxyXG4gICAgICAnc2VsZWN0ZWRDb2xvcic6ICcjYjQyODJkJyxcclxuICAgICAgJ2NvbG9yJzogJyM2NjYnLFxyXG4gICAgICAnbGlzdCc6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAncGFnZVBhdGgnOiAncGFnZXMvaW5kZXgnLFxyXG4gICAgICAgICAgJ3RleHQnOiAn6aaW6aG1JyxcclxuICAgICAgICAgICdpY29uUGF0aCc6ICcuL3N0YXRpYy9pbWFnZS9ob21lLnBuZycsXHJcbiAgICAgICAgICAnc2VsZWN0ZWRJY29uUGF0aCc6ICcuL3N0YXRpYy9pbWFnZS9ob21lLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICdwYWdlUGF0aCc6ICdwYWdlcy91Y2VudGVyJyxcclxuICAgICAgICAgICd0ZXh0JzogJ+aIkeeahCcsXHJcbiAgICAgICAgICAnaWNvblBhdGgnOiAnLi9zdGF0aWMvaW1hZ2UvdWNlbnRlci5wbmcnLFxyXG4gICAgICAgICAgJ3NlbGVjdGVkSWNvblBhdGgnOiAnLi9zdGF0aWMvaW1hZ2UvdWNlbnRlci5wbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy8g6ZyA6KaB5L+u5pS55Li6UHJvbWlzZeW9ouW8j+eahHd4QVBJXHJcbiAgICAncHJvbWlzaWZ5JzogW1xyXG4gICAgICAnc2NhbkNvZGUnLFxyXG4gICAgICAnc3dpdGNoVGFiJyxcclxuICAgICAgJ25hdmlnYXRlVG8nLFxyXG4gICAgICAnc2hvd01vZGFsJyxcclxuICAgICAgJ3VwbG9hZEZpbGUnLFxyXG4gICAgICAnY2hvb3NlSW1hZ2UnLFxyXG4gICAgICAnbWFrZVBob25lQ2FsbCdcclxuICAgIF1cclxuICB9XHJcblxyXG4gIGdsb2JhbERhdGEgPSB7XHJcbiAgICB1c2VySW5mbzogbnVsbFxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy51c2UoJ3JlcXVlc3RmaXgnKVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25MYXVuY2goKSB7XHJcbiAgICAvLyDlh73mlbBQcm9taXNl5YyWXHJcbiAgICB0aGlzLmNvbmZpZ1sncHJvbWlzaWZ5J10uZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgd3hbaXRlbSArICdQJ10gPSB0aGlzLnd4UHJvbWlzaWZ5KHd4W2l0ZW1dKVxyXG4gICAgfSlcclxuICAgIE9iamVjdC5hc3NpZ24oRGF0ZS5wcm90b3R5cGUsIHsgRm9ybWF0OiB0aGlzLkZvcm1hdCB9KVxyXG4gICAgT2JqZWN0LmFzc2lnbihEYXRlLnByb3RvdHlwZSwgeyBMZWZ0VGltZXI6IHRoaXMuTGVmdFRpbWVyIH0pXHJcbiAgICBjb25zb2xlLmxvZyhEYXRlLnByb3RvdHlwZSlcclxuXHJcbiAgICB3eC5jbGVhclN0b3JhZ2UoKVxyXG4gICAgY29uc3QgbG9naW5SZXN1bHQgPSBhd2FpdCB1c2VyU2VydmljZS5sb2dpbigpXHJcbiAgICBjb25zb2xlLmxvZygnbG9naW5SZXN1bHQnLCBsb2dpblJlc3VsdClcclxuICAgIC8vIHJlcXVlc3QoYXBpLkF1dGhMb2dpbkJ5V2VpeGluLCB7IGNvZGUsIHVzZXJJbmZvIH0sICdQT1NUJylcclxuICAgIC8vIC50aGVuKHJlcyA9PiB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKCfnmbvlvZXnu5Pmnpw6ICcsIHJlcylcclxuICAgIC8vIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8g5pel5pyf5qC85byP5YyWXHJcbiAgRm9ybWF0ID0gZnVuY3Rpb24oZm10KSB7XHJcbiAgICBjb25zdCBvID0ge1xyXG4gICAgICAnTSsnOiB0aGlzLmdldE1vbnRoKCkgKyAxLFxyXG4gICAgICAnZCsnOiB0aGlzLmdldERhdGUoKSxcclxuICAgICAgJ2grJzogdGhpcy5nZXRIb3VycygpLFxyXG4gICAgICAnbSsnOiB0aGlzLmdldE1pbnV0ZXMoKSxcclxuICAgICAgJ3MrJzogdGhpcy5nZXRTZWNvbmRzKCksXHJcbiAgICAgICdxKyc6IE1hdGguZmxvb3IoKHRoaXMuZ2V0TW9udGgoKSArIDMpIC8gMyksXHJcbiAgICAgICdTJzogdGhpcy5nZXRNaWxsaXNlY29uZHMoKVxyXG4gICAgfVxyXG4gICAgaWYgKC8oeSspLy50ZXN0KGZtdCkpIHtcclxuICAgICAgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAodGhpcy5nZXRGdWxsWWVhcigpICsgJycpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpXHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBrIGluIG8pIHtcclxuICAgICAgaWYgKG5ldyBSZWdFeHAoJygnICsgayArICcpJykudGVzdChmbXQpKSB7XHJcbiAgICAgICAgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAoUmVnRXhwLiQxLmxlbmd0aCA9PT0gMSkgPyAob1trXSkgOiAoKCcwMCcgKyBvW2tdKS5zdWJzdHIoKCcnICsgb1trXSkubGVuZ3RoKSkpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmbXRcclxuICB9XHJcblxyXG4gIC8vIOeUqOaXtlxyXG4gIExlZnRUaW1lciA9IGZ1bmN0aW9uKHRpbWVzdGFtcCkge1xyXG4gICAgdGhpcy50aW1lID0ge31cclxuICAgIC8vIOWwhjAtOeeahOaVsOWtl+WJjemdouWKoOS4ijDvvIzkvosx5Y+Y5Li6MDFcclxuICAgIHRoaXMuY2hlY2tUaW1lID0gZnVuY3Rpb24oaSkge1xyXG4gICAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgaSA9ICcwJyArIGlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpID0gJycgKyBpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGlcclxuICAgIH1cclxuICAgIC8vIOajgOa1i+aYr+WQpuS4uiAnMDAnXHJcbiAgICB0aGlzLmlzRW1wdHkgPSBmdW5jdGlvbih4KSB7XHJcbiAgICAgIGlmICh4ID09PSAnMDAnKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8g5aaC4oCcMDDlsI/ml7YwMOWIhumSnzEw56eS4oCd6L+Z56eN5qC85byPLOWwhui9rOaNouS4uuKAnDEw56eS4oCdXHJcbiAgICB0aGlzLmNoZWNrWmVybyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjb25zdCBfdGhpcyA9IHRoaXNcclxuICAgICAgbGV0IGhhdmVGaXJzdE5vdEVtcHR5VmFsdWUgPSBmYWxzZVxyXG5cclxuICAgICAgT2JqZWN0LmtleXMoX3RoaXMudGltZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICAgIGlmIChfdGhpcy5pc0VtcHR5KF90aGlzLnRpbWVba2V5XSkpIHtcclxuICAgICAgICAgIF90aGlzW2tleSArICdfc3RyJ10gPSAnJ1xyXG4gICAgICAgICAgaWYgKGhhdmVGaXJzdE5vdEVtcHR5VmFsdWUpIHtcclxuICAgICAgICAgICAgX3RoaXNba2V5ICsgJ19zdHInXSA9IF90aGlzW2tleSArICdfc3RyJ11cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgX3RoaXNba2V5ICsgJ19zdHInXSA9IF90aGlzW2tleSArICdfc3RyJ11cclxuICAgICAgICAgIGhhdmVGaXJzdE5vdEVtcHR5VmFsdWUgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IF90aGlzID0gdGhpc1xyXG5cclxuICAgIHRoaXMudGltZS5kYXlzID0gcGFyc2VJbnQodGltZXN0YW1wIC8gMTAwMCAvIDYwIC8gNjAgLyAyNCwgMTApIC8vIOiuoeeul+WJqeS9meeahOWkqeaVsFxyXG4gICAgdGhpcy50aW1lLmhvdXJzID0gcGFyc2VJbnQodGltZXN0YW1wIC8gMTAwMCAvIDYwIC8gNjAgJSAyNCwgMTApIC8vIOiuoeeul+WJqeS9meeahOWwj+aXtlxyXG4gICAgdGhpcy50aW1lLm1pbnV0ZXMgPSBwYXJzZUludCh0aW1lc3RhbXAgLyAxMDAwIC8gNjAgJSA2MCwgMTApIC8vIOiuoeeul+WJqeS9meeahOWIhumSn1xyXG4gICAgdGhpcy50aW1lLnNlY29uZHMgPSBwYXJzZUludCh0aW1lc3RhbXAgLyAxMDAwICUgNjAsIDEwKSAvLyDorqHnrpfliankvZnnmoTnp5LmlbBcclxuXHJcbiAgICBPYmplY3Qua2V5cyhfdGhpcy50aW1lKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgIF90aGlzLnRpbWVba2V5XSA9IF90aGlzLmNoZWNrVGltZShfdGhpcy50aW1lW2tleV0pXHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXNbJ2RheXNfc3RyJ10gPSB0aGlzLnRpbWVbJ2RheXMnXSArICflpKknXHJcbiAgICB0aGlzWydob3Vyc19zdHInXSA9IHRoaXMudGltZVsnaG91cnMnXSArICflsI/ml7YnXHJcbiAgICB0aGlzWydtaW51dGVzX3N0ciddID0gdGhpcy50aW1lWydtaW51dGVzJ10gKyAn5YiG6ZKfJ1xyXG4gICAgdGhpc1snc2Vjb25kc19zdHInXSA9IHRoaXMudGltZVsnc2Vjb25kcyddICsgJ+enkidcclxuXHJcbiAgICB0aGlzLmNoZWNrWmVybygpXHJcbiAgICB0aGlzLnN0cmluZyA9IGAke3RoaXNbJ2RheXNfc3RyJ119JHt0aGlzWydob3Vyc19zdHInXX0ke3RoaXNbJ21pbnV0ZXNfc3RyJ119JHt0aGlzWydzZWNvbmRzX3N0ciddfWBcclxuICB9XHJcblxyXG4gIHd4UHJvbWlzaWZ5KGZuKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaiA9IHt9KSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgb2JqLnN1Y2Nlc3MgPSBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUHJvbWlzZSBzdWNjZXNzIOi/lOWbnuWPguaVsO+8micsIHJlcylcclxuICAgICAgICAgIHJlc29sdmUocmVzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBvYmouZmFpbCA9IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignUHJvbWlzZSBmYWlsIOi/lOWbnuWPguaVsO+8micsIHJlcylcclxuICAgICAgICAgIHJlamVjdChyZXMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZuKG9iaikgLy8g5omn6KGM5Ye95pWw77yMb2Jq5Li65Lyg5YWl5Ye95pWw55qE5Y+C5pWwXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRVc2VySW5mbyhjYikge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXNcclxuICAgIGlmICh0aGlzLmdsb2JhbERhdGEudXNlckluZm8pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mb1xyXG4gICAgfVxyXG4gICAgd2VweS5nZXRVc2VySW5mbyh7XHJcbiAgICAgIHN1Y2Nlc3MgKHJlcykge1xyXG4gICAgICAgIHRoYXQuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xyXG4gICAgICAgIGNiICYmIGNiKHJlcy51c2VySW5mbylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuIl19