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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJzdG9yZSIsImNvbmZpZyIsImJhY2tncm91bmRUZXh0U3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJUZXh0U3R5bGUiLCJnbG9iYWxEYXRhIiwidXNlckluZm8iLCJGb3JtYXQiLCJmbXQiLCJvIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsIk1hdGgiLCJmbG9vciIsImdldE1pbGxpc2Vjb25kcyIsInRlc3QiLCJyZXBsYWNlIiwiUmVnRXhwIiwiJDEiLCJnZXRGdWxsWWVhciIsInN1YnN0ciIsImxlbmd0aCIsImsiLCJMZWZ0VGltZXIiLCJ0aW1lc3RhbXAiLCJ0aW1lIiwiY2hlY2tUaW1lIiwiaSIsImlzRW1wdHkiLCJ4IiwiY2hlY2taZXJvIiwiX3RoaXMiLCJoYXZlRmlyc3ROb3RFbXB0eVZhbHVlIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJkYXlzIiwicGFyc2VJbnQiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmRzIiwic3RyaW5nIiwidXNlIiwid3giLCJpdGVtIiwid3hQcm9taXNpZnkiLCJhc3NpZ24iLCJEYXRlIiwicHJvdG90eXBlIiwiY29uc29sZSIsImxvZyIsImZuIiwib2JqIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdWNjZXNzIiwicmVzIiwiZmFpbCIsIndhcm4iLCJjYiIsInRoYXQiLCJ3ZXB5IiwiZ2V0VXNlckluZm8iLCJhcHAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFFBQVEsc0JBQWQ7QUFDQSx5QkFBU0EsS0FBVDs7Ozs7QUFrREUsc0JBQWU7QUFBQTs7QUFBQTs7QUFBQSxXQS9DZkMsTUErQ2UsR0EvQ047QUFDUCxlQUFT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LEVBQXFCO0FBQ3RDSCxjQUFJSSxPQUFKLEdBQWMsVUFBVUMsR0FBVixFQUFlO0FBQzNCUixvQkFBUUMsR0FBUixDQUFZLHVCQUFaLEVBQXFDTyxHQUFyQztBQUNBSCxvQkFBUUcsR0FBUjtBQUNELFdBSEQ7QUFJQUwsY0FBSU0sSUFBSixHQUFXLFVBQVVELEdBQVYsRUFBZTtBQUN4QlIsb0JBQVFVLElBQVIsQ0FBYSxvQkFBYixFQUFtQ0YsR0FBbkM7QUFDQUYsbUJBQU9FLEdBQVA7QUFDRCxXQUhEO0FBSUFOLGFBQUdDLEdBQUgsRUFUc0MsQ0FTOUI7QUFDVCxTQVZNLENBQVA7QUFXRCxPQVpEO0FBYUQ7OztnQ0FFV1EsRSxFQUFJO0FBQ2QsVUFBTUMsT0FBTyxJQUFiO0FBQ0EsVUFBSSxLQUFLNUQsVUFBTCxDQUFnQkMsUUFBcEIsRUFBOEI7QUFDNUIsZUFBTyxLQUFLRCxVQUFMLENBQWdCQyxRQUF2QjtBQUNEO0FBQ0Q0RCxxQkFBS0MsV0FBTCxDQUFpQjtBQUNmUCxlQURlLG1CQUNOQyxHQURNLEVBQ0Q7QUFDWkksZUFBSzVELFVBQUwsQ0FBZ0JDLFFBQWhCLEdBQTJCdUQsSUFBSXZELFFBQS9CO0FBQ0EwRCxnQkFBTUEsR0FBR0gsSUFBSXZELFFBQVAsQ0FBTjtBQUNEO0FBSmMsT0FBakI7QUFNRDs7OztFQXhLMEI0RCxlQUFLRSxHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5J1xyXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nXHJcblxyXG5pbXBvcnQgeyBzZXRTdG9yZSB9IGZyb20gJ3dlcHktcmVkdXgnXHJcbmltcG9ydCBjb25maWdTdG9yZSBmcm9tICcuL3N0b3JlJ1xyXG5cclxuY29uc3Qgc3RvcmUgPSBjb25maWdTdG9yZSgpXHJcbnNldFN0b3JlKHN0b3JlKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyB3ZXB5LmFwcCB7XHJcbiAgY29uZmlnID0ge1xyXG4gICAgJ3BhZ2VzJzogW1xyXG4gICAgICAncGFnZXMvaW5kZXgnLFxyXG4gICAgICAncGFnZXMvdWNlbnRlcidcclxuICAgIF0sXHJcbiAgICAnd2luZG93Jzoge1xyXG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiAnbGlnaHQnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXHJcbiAgICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICdXZUNoYXQnLFxyXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snXHJcbiAgICB9LFxyXG4gICAgJ3RhYkJhcic6IHtcclxuICAgICAgJ2JhY2tncm91bmRDb2xvcic6ICcjZmFmYWZhJyxcclxuICAgICAgJ2JvcmRlclN0eWxlJzogJ3doaXRlJyxcclxuICAgICAgJ3NlbGVjdGVkQ29sb3InOiAnI2I0MjgyZCcsXHJcbiAgICAgICdjb2xvcic6ICcjNjY2JyxcclxuICAgICAgJ2xpc3QnOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJ3BhZ2VQYXRoJzogJ3BhZ2VzL2luZGV4JyxcclxuICAgICAgICAgICd0ZXh0JzogJ+mmlumhtScsXHJcbiAgICAgICAgICAnaWNvblBhdGgnOiAnLi9zdGF0aWMvaW1hZ2UvaG9tZS5wbmcnLFxyXG4gICAgICAgICAgJ3NlbGVjdGVkSWNvblBhdGgnOiAnLi9zdGF0aWMvaW1hZ2UvaG9tZS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAncGFnZVBhdGgnOiAncGFnZXMvdWNlbnRlcicsXHJcbiAgICAgICAgICAndGV4dCc6ICfmiJHnmoQnLFxyXG4gICAgICAgICAgJ2ljb25QYXRoJzogJy4vc3RhdGljL2ltYWdlL3VjZW50ZXIucG5nJyxcclxuICAgICAgICAgICdzZWxlY3RlZEljb25QYXRoJzogJy4vc3RhdGljL2ltYWdlL3VjZW50ZXIucG5nJ1xyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIC8vIOmcgOimgeS/ruaUueS4ulByb21pc2XlvaLlvI/nmoR3eEFQSVxyXG4gICAgJ3Byb21pc2lmeSc6IFtcclxuICAgICAgJ3NjYW5Db2RlJyxcclxuICAgICAgJ3N3aXRjaFRhYicsXHJcbiAgICAgICduYXZpZ2F0ZVRvJyxcclxuICAgICAgJ3Nob3dNb2RhbCcsXHJcbiAgICAgICd1cGxvYWRGaWxlJyxcclxuICAgICAgJ2Nob29zZUltYWdlJyxcclxuICAgICAgJ21ha2VQaG9uZUNhbGwnXHJcbiAgICBdXHJcbiAgfVxyXG5cclxuICBnbG9iYWxEYXRhID0ge1xyXG4gICAgdXNlckluZm86IG51bGxcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yICgpIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMudXNlKCdyZXF1ZXN0Zml4JylcclxuICB9XHJcblxyXG4gIG9uTGF1bmNoKCkge1xyXG4gICAgLy8g5Ye95pWwUHJvbWlzZeWMllxyXG4gICAgdGhpcy5jb25maWdbJ3Byb21pc2lmeSddLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgIHd4W2l0ZW0gKyAnUCddID0gdGhpcy53eFByb21pc2lmeSh3eFtpdGVtXSlcclxuICAgIH0pXHJcbiAgICBPYmplY3QuYXNzaWduKERhdGUucHJvdG90eXBlLCB7IEZvcm1hdDogdGhpcy5Gb3JtYXQgfSlcclxuICAgIE9iamVjdC5hc3NpZ24oRGF0ZS5wcm90b3R5cGUsIHsgTGVmdFRpbWVyOiB0aGlzLkxlZnRUaW1lciB9KVxyXG4gICAgY29uc29sZS5sb2coRGF0ZS5wcm90b3R5cGUpXHJcbiAgfVxyXG5cclxuICAvLyDml6XmnJ/moLzlvI/ljJZcclxuICBGb3JtYXQgPSBmdW5jdGlvbihmbXQpIHtcclxuICAgIGNvbnN0IG8gPSB7XHJcbiAgICAgICdNKyc6IHRoaXMuZ2V0TW9udGgoKSArIDEsXHJcbiAgICAgICdkKyc6IHRoaXMuZ2V0RGF0ZSgpLFxyXG4gICAgICAnaCsnOiB0aGlzLmdldEhvdXJzKCksXHJcbiAgICAgICdtKyc6IHRoaXMuZ2V0TWludXRlcygpLFxyXG4gICAgICAncysnOiB0aGlzLmdldFNlY29uZHMoKSxcclxuICAgICAgJ3ErJzogTWF0aC5mbG9vcigodGhpcy5nZXRNb250aCgpICsgMykgLyAzKSxcclxuICAgICAgJ1MnOiB0aGlzLmdldE1pbGxpc2Vjb25kcygpXHJcbiAgICB9XHJcbiAgICBpZiAoLyh5KykvLnRlc3QoZm10KSkge1xyXG4gICAgICBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsICh0aGlzLmdldEZ1bGxZZWFyKCkgKyAnJykuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSlcclxuICAgIH1cclxuICAgIGZvciAodmFyIGsgaW4gbykge1xyXG4gICAgICBpZiAobmV3IFJlZ0V4cCgnKCcgKyBrICsgJyknKS50ZXN0KGZtdCkpIHtcclxuICAgICAgICBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsIChSZWdFeHAuJDEubGVuZ3RoID09PSAxKSA/IChvW2tdKSA6ICgoJzAwJyArIG9ba10pLnN1YnN0cigoJycgKyBvW2tdKS5sZW5ndGgpKSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZtdFxyXG4gIH1cclxuXHJcbiAgLy8g55So5pe2XHJcbiAgTGVmdFRpbWVyID0gZnVuY3Rpb24odGltZXN0YW1wKSB7XHJcbiAgICB0aGlzLnRpbWUgPSB7fVxyXG4gICAgLy8g5bCGMC0555qE5pWw5a2X5YmN6Z2i5Yqg5LiKMO+8jOS+izHlj5jkuLowMVxyXG4gICAgdGhpcy5jaGVja1RpbWUgPSBmdW5jdGlvbihpKSB7XHJcbiAgICAgIGlmIChpIDwgMTApIHtcclxuICAgICAgICBpID0gJzAnICsgaVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGkgPSAnJyArIGlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gaVxyXG4gICAgfVxyXG4gICAgLy8g5qOA5rWL5piv5ZCm5Li6ICcwMCdcclxuICAgIHRoaXMuaXNFbXB0eSA9IGZ1bmN0aW9uKHgpIHtcclxuICAgICAgaWYgKHggPT09ICcwMCcpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyDlpoLigJwwMOWwj+aXtjAw5YiG6ZKfMTDnp5LigJ3ov5nnp43moLzlvI8s5bCG6L2s5o2i5Li64oCcMTDnp5LigJ1cclxuICAgIHRoaXMuY2hlY2taZXJvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnN0IF90aGlzID0gdGhpc1xyXG4gICAgICBsZXQgaGF2ZUZpcnN0Tm90RW1wdHlWYWx1ZSA9IGZhbHNlXHJcblxyXG4gICAgICBPYmplY3Qua2V5cyhfdGhpcy50aW1lKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgaWYgKF90aGlzLmlzRW1wdHkoX3RoaXMudGltZVtrZXldKSkge1xyXG4gICAgICAgICAgX3RoaXNba2V5ICsgJ19zdHInXSA9ICcnXHJcbiAgICAgICAgICBpZiAoaGF2ZUZpcnN0Tm90RW1wdHlWYWx1ZSkge1xyXG4gICAgICAgICAgICBfdGhpc1trZXkgKyAnX3N0ciddID0gX3RoaXNba2V5ICsgJ19zdHInXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBfdGhpc1trZXkgKyAnX3N0ciddID0gX3RoaXNba2V5ICsgJ19zdHInXVxyXG4gICAgICAgICAgaGF2ZUZpcnN0Tm90RW1wdHlWYWx1ZSA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSB0aGlzXHJcblxyXG4gICAgdGhpcy50aW1lLmRheXMgPSBwYXJzZUludCh0aW1lc3RhbXAgLyAxMDAwIC8gNjAgLyA2MCAvIDI0LCAxMCkgLy8g6K6h566X5Ymp5L2Z55qE5aSp5pWwXHJcbiAgICB0aGlzLnRpbWUuaG91cnMgPSBwYXJzZUludCh0aW1lc3RhbXAgLyAxMDAwIC8gNjAgLyA2MCAlIDI0LCAxMCkgLy8g6K6h566X5Ymp5L2Z55qE5bCP5pe2XHJcbiAgICB0aGlzLnRpbWUubWludXRlcyA9IHBhcnNlSW50KHRpbWVzdGFtcCAvIDEwMDAgLyA2MCAlIDYwLCAxMCkgLy8g6K6h566X5Ymp5L2Z55qE5YiG6ZKfXHJcbiAgICB0aGlzLnRpbWUuc2Vjb25kcyA9IHBhcnNlSW50KHRpbWVzdGFtcCAvIDEwMDAgJSA2MCwgMTApIC8vIOiuoeeul+WJqeS9meeahOenkuaVsFxyXG5cclxuICAgIE9iamVjdC5rZXlzKF90aGlzLnRpbWUpLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgX3RoaXMudGltZVtrZXldID0gX3RoaXMuY2hlY2tUaW1lKF90aGlzLnRpbWVba2V5XSlcclxuICAgIH0pXHJcblxyXG4gICAgdGhpc1snZGF5c19zdHInXSA9IHRoaXMudGltZVsnZGF5cyddICsgJ+WkqSdcclxuICAgIHRoaXNbJ2hvdXJzX3N0ciddID0gdGhpcy50aW1lWydob3VycyddICsgJ+Wwj+aXtidcclxuICAgIHRoaXNbJ21pbnV0ZXNfc3RyJ10gPSB0aGlzLnRpbWVbJ21pbnV0ZXMnXSArICfliIbpkp8nXHJcbiAgICB0aGlzWydzZWNvbmRzX3N0ciddID0gdGhpcy50aW1lWydzZWNvbmRzJ10gKyAn56eSJ1xyXG5cclxuICAgIHRoaXMuY2hlY2taZXJvKClcclxuICAgIHRoaXMuc3RyaW5nID0gYCR7dGhpc1snZGF5c19zdHInXX0ke3RoaXNbJ2hvdXJzX3N0ciddfSR7dGhpc1snbWludXRlc19zdHInXX0ke3RoaXNbJ3NlY29uZHNfc3RyJ119YFxyXG4gIH1cclxuXHJcbiAgd3hQcm9taXNpZnkoZm4pIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAob2JqID0ge30pIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBvYmouc3VjY2VzcyA9IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdQcm9taXNlIHN1Y2Nlc3Mg6L+U5Zue5Y+C5pWw77yaJywgcmVzKVxyXG4gICAgICAgICAgcmVzb2x2ZShyZXMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iai5mYWlsID0gZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdQcm9taXNlIGZhaWwg6L+U5Zue5Y+C5pWw77yaJywgcmVzKVxyXG4gICAgICAgICAgcmVqZWN0KHJlcylcclxuICAgICAgICB9XHJcbiAgICAgICAgZm4ob2JqKSAvLyDmiafooYzlh73mlbDvvIxvYmrkuLrkvKDlhaXlh73mlbDnmoTlj4LmlbBcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFVzZXJJbmZvKGNiKSB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpc1xyXG4gICAgaWYgKHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbykge1xyXG4gICAgICByZXR1cm4gdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvXHJcbiAgICB9XHJcbiAgICB3ZXB5LmdldFVzZXJJbmZvKHtcclxuICAgICAgc3VjY2VzcyAocmVzKSB7XHJcbiAgICAgICAgdGhhdC5nbG9iYWxEYXRhLnVzZXJJbmZvID0gcmVzLnVzZXJJbmZvXHJcbiAgICAgICAgY2IgJiYgY2IocmVzLnVzZXJJbmZvKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG4iXX0=