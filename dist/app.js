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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      'pages': ['pages/index', 'pages/check', 'pages/service', 'pages/shop', 'pages/order', 'pages/refund_result', 'pages/ucenter/index', 'pages/ucenter/detail', 'pages/ucenter/idcard'],
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
          'pagePath': 'pages/service',
          'text': '服务',
          'iconPath': './static/image/service.png',
          'selectedIconPath': './static/image/service.png'
        }, {
          'pagePath': 'pages/ucenter/index',
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
    value: function onLaunch() {
      var _this3 = this;

      // 函数Promise化
      this.config['promisify'].forEach(function (item) {
        wx[item + 'P'] = _this3.wxPromisify(wx[item]);
      });
      Object.assign(Date.prototype, { Format: this.Format });
      Object.assign(Date.prototype, { LeftTimer: this.LeftTimer });
      console.log(Date.prototype);
    }

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJzdG9yZSIsImNvbmZpZyIsImJhY2tncm91bmRUZXh0U3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJUZXh0U3R5bGUiLCJnbG9iYWxEYXRhIiwidXNlckluZm8iLCJGb3JtYXQiLCJmbXQiLCJvIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIk1hdGgiLCJmbG9vciIsImdldE1pbGxpc2Vjb25kcyIsInRlc3QiLCJyZXBsYWNlIiwiUmVnRXhwIiwiJDEiLCJnZXRGdWxsWWVhciIsInN1YnN0ciIsImxlbmd0aCIsImsiLCJMZWZ0VGltZXIiLCJ0aW1lc3RhbXAiLCJ0aW1lIiwiY2hlY2tUaW1lIiwiaSIsImlzRW1wdHkiLCJ4IiwiY2hlY2taZXJvIiwiX3RoaXMiLCJoYXZlRmlyc3ROb3RFbXB0eVZhbHVlIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJkYXlzIiwicGFyc2VJbnQiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmRzIiwic3RyaW5nIiwidXNlIiwid3giLCJpdGVtIiwid3hQcm9taXNpZnkiLCJhc3NpZ24iLCJEYXRlIiwicHJvdG90eXBlIiwiY29uc29sZSIsImxvZyIsImZuIiwib2JqIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdWNjZXNzIiwicmVzIiwiZmFpbCIsIndhcm4iLCJjYiIsInRoYXQiLCJ3ZXB5IiwiZ2V0VXNlckluZm8iLCJhcHAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFFBQVEsc0JBQWQ7QUFDQSx5QkFBU0EsS0FBVDs7Ozs7QUErREUsc0JBQWU7QUFBQTs7QUFBQTs7QUFBQSxXQTVEZkMsTUE0RGUsR0E1RE47QUFDUCxlQUFT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QyxHQUFSLENBQVlILEtBQUtDLFNBQWpCO0FBQ0Q7O0FBRUQ7OztBQXNCQTs7OztnQ0F3RFlHLEUsRUFBSTtBQUNkLGFBQU8sWUFBb0I7QUFBQSxZQUFWQyxHQUFVLHVFQUFKLEVBQUk7O0FBQ3pCLGVBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0Q0gsY0FBSUksT0FBSixHQUFjLFVBQVVDLEdBQVYsRUFBZTtBQUMzQlIsb0JBQVFDLEdBQVIsQ0FBWSx1QkFBWixFQUFxQ08sR0FBckM7QUFDQUgsb0JBQVFHLEdBQVI7QUFDRCxXQUhEO0FBSUFMLGNBQUlNLElBQUosR0FBVyxVQUFVRCxHQUFWLEVBQWU7QUFDeEJSLG9CQUFRVSxJQUFSLENBQWEsb0JBQWIsRUFBbUNGLEdBQW5DO0FBQ0FGLG1CQUFPRSxHQUFQO0FBQ0QsV0FIRDtBQUlBTixhQUFHQyxHQUFILEVBVHNDLENBUzlCO0FBQ1QsU0FWTSxDQUFQO0FBV0QsT0FaRDtBQWFEOzs7Z0NBRVdRLEUsRUFBSTtBQUNkLFVBQU1DLE9BQU8sSUFBYjtBQUNBLFVBQUksS0FBSzVELFVBQUwsQ0FBZ0JDLFFBQXBCLEVBQThCO0FBQzVCLGVBQU8sS0FBS0QsVUFBTCxDQUFnQkMsUUFBdkI7QUFDRDtBQUNENEQscUJBQUtDLFdBQUwsQ0FBaUI7QUFDZlAsZUFEZSxtQkFDTkMsR0FETSxFQUNEO0FBQ1pJLGVBQUs1RCxVQUFMLENBQWdCQyxRQUFoQixHQUEyQnVELElBQUl2RCxRQUEvQjtBQUNBMEQsZ0JBQU1BLEdBQUdILElBQUl2RCxRQUFQLENBQU47QUFDRDtBQUpjLE9BQWpCO0FBTUQ7Ozs7RUFyTDBCNEQsZUFBS0UsRyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSdcclxuaW1wb3J0ICd3ZXB5LWFzeW5jLWZ1bmN0aW9uJ1xyXG5cclxuaW1wb3J0IHsgc2V0U3RvcmUgfSBmcm9tICd3ZXB5LXJlZHV4J1xyXG5pbXBvcnQgY29uZmlnU3RvcmUgZnJvbSAnLi9zdG9yZSdcclxuXHJcbmNvbnN0IHN0b3JlID0gY29uZmlnU3RvcmUoKVxyXG5zZXRTdG9yZShzdG9yZSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgd2VweS5hcHAge1xyXG4gIGNvbmZpZyA9IHtcclxuICAgICdwYWdlcyc6IFtcclxuICAgICAgJ3BhZ2VzL2luZGV4JyxcclxuICAgICAgJ3BhZ2VzL2NoZWNrJyxcclxuICAgICAgJ3BhZ2VzL3NlcnZpY2UnLFxyXG4gICAgICAncGFnZXMvc2hvcCcsXHJcbiAgICAgICdwYWdlcy9vcmRlcicsXHJcbiAgICAgICdwYWdlcy9yZWZ1bmRfcmVzdWx0JyxcclxuICAgICAgJ3BhZ2VzL3VjZW50ZXIvaW5kZXgnLFxyXG4gICAgICAncGFnZXMvdWNlbnRlci9kZXRhaWwnLFxyXG4gICAgICAncGFnZXMvdWNlbnRlci9pZGNhcmQnXHJcbiAgICBdLFxyXG4gICAgJ3dpbmRvdyc6IHtcclxuICAgICAgYmFja2dyb3VuZFRleHRTdHlsZTogJ2xpZ2h0JyxcclxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAnV2VDaGF0JyxcclxuICAgICAgbmF2aWdhdGlvbkJhclRleHRTdHlsZTogJ2JsYWNrJ1xyXG4gICAgfSxcclxuICAgICd0YWJCYXInOiB7XHJcbiAgICAgICdiYWNrZ3JvdW5kQ29sb3InOiAnI2ZhZmFmYScsXHJcbiAgICAgICdib3JkZXJTdHlsZSc6ICd3aGl0ZScsXHJcbiAgICAgICdzZWxlY3RlZENvbG9yJzogJyNiNDI4MmQnLFxyXG4gICAgICAnY29sb3InOiAnIzY2NicsXHJcbiAgICAgICdsaXN0JzogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICdwYWdlUGF0aCc6ICdwYWdlcy9pbmRleCcsXHJcbiAgICAgICAgICAndGV4dCc6ICfpppbpobUnLFxyXG4gICAgICAgICAgJ2ljb25QYXRoJzogJy4vc3RhdGljL2ltYWdlL2hvbWUucG5nJyxcclxuICAgICAgICAgICdzZWxlY3RlZEljb25QYXRoJzogJy4vc3RhdGljL2ltYWdlL2hvbWUucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJ3BhZ2VQYXRoJzogJ3BhZ2VzL3NlcnZpY2UnLFxyXG4gICAgICAgICAgJ3RleHQnOiAn5pyN5YqhJyxcclxuICAgICAgICAgICdpY29uUGF0aCc6ICcuL3N0YXRpYy9pbWFnZS9zZXJ2aWNlLnBuZycsXHJcbiAgICAgICAgICAnc2VsZWN0ZWRJY29uUGF0aCc6ICcuL3N0YXRpYy9pbWFnZS9zZXJ2aWNlLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICdwYWdlUGF0aCc6ICdwYWdlcy91Y2VudGVyL2luZGV4JyxcclxuICAgICAgICAgICd0ZXh0JzogJ+aIkeeahCcsXHJcbiAgICAgICAgICAnaWNvblBhdGgnOiAnLi9zdGF0aWMvaW1hZ2UvdWNlbnRlci5wbmcnLFxyXG4gICAgICAgICAgJ3NlbGVjdGVkSWNvblBhdGgnOiAnLi9zdGF0aWMvaW1hZ2UvdWNlbnRlci5wbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy8g6ZyA6KaB5L+u5pS55Li6UHJvbWlzZeW9ouW8j+eahHd4QVBJXHJcbiAgICAncHJvbWlzaWZ5JzogW1xyXG4gICAgICAnc2NhbkNvZGUnLFxyXG4gICAgICAnc3dpdGNoVGFiJyxcclxuICAgICAgJ25hdmlnYXRlVG8nLFxyXG4gICAgICAnc2hvd01vZGFsJyxcclxuICAgICAgJ3VwbG9hZEZpbGUnLFxyXG4gICAgICAnY2hvb3NlSW1hZ2UnLFxyXG4gICAgICAnbWFrZVBob25lQ2FsbCdcclxuICAgIF1cclxuICB9XHJcblxyXG4gIGdsb2JhbERhdGEgPSB7XHJcbiAgICB1c2VySW5mbzogbnVsbFxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy51c2UoJ3JlcXVlc3RmaXgnKVxyXG4gIH1cclxuXHJcbiAgb25MYXVuY2goKSB7XHJcbiAgICAvLyDlh73mlbBQcm9taXNl5YyWXHJcbiAgICB0aGlzLmNvbmZpZ1sncHJvbWlzaWZ5J10uZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgd3hbaXRlbSArICdQJ10gPSB0aGlzLnd4UHJvbWlzaWZ5KHd4W2l0ZW1dKVxyXG4gICAgfSlcclxuICAgIE9iamVjdC5hc3NpZ24oRGF0ZS5wcm90b3R5cGUsIHsgRm9ybWF0OiB0aGlzLkZvcm1hdCB9KVxyXG4gICAgT2JqZWN0LmFzc2lnbihEYXRlLnByb3RvdHlwZSwgeyBMZWZ0VGltZXI6IHRoaXMuTGVmdFRpbWVyIH0pXHJcbiAgICBjb25zb2xlLmxvZyhEYXRlLnByb3RvdHlwZSlcclxuICB9XHJcblxyXG4gIC8vIOaXpeacn+agvOW8j+WMllxyXG4gIEZvcm1hdCA9IGZ1bmN0aW9uKGZtdCkge1xyXG4gICAgY29uc3QgbyA9IHtcclxuICAgICAgJ00rJzogdGhpcy5nZXRNb250aCgpICsgMSxcclxuICAgICAgJ2QrJzogdGhpcy5nZXREYXRlKCksXHJcbiAgICAgICdoKyc6IHRoaXMuZ2V0SG91cnMoKSxcclxuICAgICAgJ20rJzogdGhpcy5nZXRNaW51dGVzKCksXHJcbiAgICAgICdzKyc6IHRoaXMuZ2V0U2Vjb25kcygpLFxyXG4gICAgICAncSsnOiBNYXRoLmZsb29yKCh0aGlzLmdldE1vbnRoKCkgKyAzKSAvIDMpLFxyXG4gICAgICAnUyc6IHRoaXMuZ2V0TWlsbGlzZWNvbmRzKClcclxuICAgIH1cclxuICAgIGlmICgvKHkrKS8udGVzdChmbXQpKSB7XHJcbiAgICAgIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgKHRoaXMuZ2V0RnVsbFllYXIoKSArICcnKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XHJcbiAgICAgIGlmIChuZXcgUmVnRXhwKCcoJyArIGsgKyAnKScpLnRlc3QoZm10KSkge1xyXG4gICAgICAgIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgKFJlZ0V4cC4kMS5sZW5ndGggPT09IDEpID8gKG9ba10pIDogKCgnMDAnICsgb1trXSkuc3Vic3RyKCgnJyArIG9ba10pLmxlbmd0aCkpKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZm10XHJcbiAgfVxyXG5cclxuICAvLyDnlKjml7ZcclxuICBMZWZ0VGltZXIgPSBmdW5jdGlvbih0aW1lc3RhbXApIHtcclxuICAgIHRoaXMudGltZSA9IHt9XHJcbiAgICAvLyDlsIYwLTnnmoTmlbDlrZfliY3pnaLliqDkuIow77yM5L6LMeWPmOS4ujAxXHJcbiAgICB0aGlzLmNoZWNrVGltZSA9IGZ1bmN0aW9uKGkpIHtcclxuICAgICAgaWYgKGkgPCAxMCkge1xyXG4gICAgICAgIGkgPSAnMCcgKyBpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaSA9ICcnICsgaVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBpXHJcbiAgICB9XHJcbiAgICAvLyDmo4DmtYvmmK/lkKbkuLogJzAwJ1xyXG4gICAgdGhpcy5pc0VtcHR5ID0gZnVuY3Rpb24oeCkge1xyXG4gICAgICBpZiAoeCA9PT0gJzAwJykge1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIOWmguKAnDAw5bCP5pe2MDDliIbpkp8xMOenkuKAnei/meenjeagvOW8jyzlsIbovazmjaLkuLrigJwxMOenkuKAnVxyXG4gICAgdGhpcy5jaGVja1plcm8gPSBmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3QgX3RoaXMgPSB0aGlzXHJcbiAgICAgIGxldCBoYXZlRmlyc3ROb3RFbXB0eVZhbHVlID0gZmFsc2VcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKF90aGlzLnRpbWUpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICBpZiAoX3RoaXMuaXNFbXB0eShfdGhpcy50aW1lW2tleV0pKSB7XHJcbiAgICAgICAgICBfdGhpc1trZXkgKyAnX3N0ciddID0gJydcclxuICAgICAgICAgIGlmIChoYXZlRmlyc3ROb3RFbXB0eVZhbHVlKSB7XHJcbiAgICAgICAgICAgIF90aGlzW2tleSArICdfc3RyJ10gPSBfdGhpc1trZXkgKyAnX3N0ciddXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIF90aGlzW2tleSArICdfc3RyJ10gPSBfdGhpc1trZXkgKyAnX3N0ciddXHJcbiAgICAgICAgICBoYXZlRmlyc3ROb3RFbXB0eVZhbHVlID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBfdGhpcyA9IHRoaXNcclxuXHJcbiAgICB0aGlzLnRpbWUuZGF5cyA9IHBhcnNlSW50KHRpbWVzdGFtcCAvIDEwMDAgLyA2MCAvIDYwIC8gMjQsIDEwKSAvLyDorqHnrpfliankvZnnmoTlpKnmlbBcclxuICAgIHRoaXMudGltZS5ob3VycyA9IHBhcnNlSW50KHRpbWVzdGFtcCAvIDEwMDAgLyA2MCAvIDYwICUgMjQsIDEwKSAvLyDorqHnrpfliankvZnnmoTlsI/ml7ZcclxuICAgIHRoaXMudGltZS5taW51dGVzID0gcGFyc2VJbnQodGltZXN0YW1wIC8gMTAwMCAvIDYwICUgNjAsIDEwKSAvLyDorqHnrpfliankvZnnmoTliIbpkp9cclxuICAgIHRoaXMudGltZS5zZWNvbmRzID0gcGFyc2VJbnQodGltZXN0YW1wIC8gMTAwMCAlIDYwLCAxMCkgLy8g6K6h566X5Ymp5L2Z55qE56eS5pWwXHJcblxyXG4gICAgT2JqZWN0LmtleXMoX3RoaXMudGltZSkuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICBfdGhpcy50aW1lW2tleV0gPSBfdGhpcy5jaGVja1RpbWUoX3RoaXMudGltZVtrZXldKVxyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzWydkYXlzX3N0ciddID0gdGhpcy50aW1lWydkYXlzJ10gKyAn5aSpJ1xyXG4gICAgdGhpc1snaG91cnNfc3RyJ10gPSB0aGlzLnRpbWVbJ2hvdXJzJ10gKyAn5bCP5pe2J1xyXG4gICAgdGhpc1snbWludXRlc19zdHInXSA9IHRoaXMudGltZVsnbWludXRlcyddICsgJ+WIhumSnydcclxuICAgIHRoaXNbJ3NlY29uZHNfc3RyJ10gPSB0aGlzLnRpbWVbJ3NlY29uZHMnXSArICfnp5InXHJcblxyXG4gICAgdGhpcy5jaGVja1plcm8oKVxyXG4gICAgdGhpcy5zdHJpbmcgPSBgJHt0aGlzWydkYXlzX3N0ciddfSR7dGhpc1snaG91cnNfc3RyJ119JHt0aGlzWydtaW51dGVzX3N0ciddfSR7dGhpc1snc2Vjb25kc19zdHInXX1gXHJcbiAgfVxyXG5cclxuICB3eFByb21pc2lmeShmbikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmogPSB7fSkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIG9iai5zdWNjZXNzID0gZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1Byb21pc2Ugc3VjY2VzcyDov5Tlm57lj4LmlbDvvJonLCByZXMpXHJcbiAgICAgICAgICByZXNvbHZlKHJlcylcclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqLmZhaWwgPSBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1Byb21pc2UgZmFpbCDov5Tlm57lj4LmlbDvvJonLCByZXMpXHJcbiAgICAgICAgICByZWplY3QocmVzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBmbihvYmopIC8vIOaJp+ihjOWHveaVsO+8jG9iauS4uuS8oOWFpeWHveaVsOeahOWPguaVsFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0VXNlckluZm8oY2IpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzXHJcbiAgICBpZiAodGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdsb2JhbERhdGEudXNlckluZm9cclxuICAgIH1cclxuICAgIHdlcHkuZ2V0VXNlckluZm8oe1xyXG4gICAgICBzdWNjZXNzIChyZXMpIHtcclxuICAgICAgICB0aGF0Lmdsb2JhbERhdGEudXNlckluZm8gPSByZXMudXNlckluZm9cclxuICAgICAgICBjYiAmJiBjYihyZXMudXNlckluZm8pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiJdfQ==