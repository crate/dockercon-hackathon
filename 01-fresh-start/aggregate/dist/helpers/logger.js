'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDateStr = function getDateStr() {
  var date = new Date();
  return date.toLocaleString();
};

var Logger = function () {
  function Logger() {
    _classCallCheck(this, Logger);
  }

  _createClass(Logger, null, [{
    key: 'log',
    value: function log() {
      var _console;

      for (var _len = arguments.length, message = Array(_len), _key = 0; _key < _len; _key++) {
        message[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, [_colors2.default.green('LOG') + ' | ' + getDateStr() + ' |'].concat(message));
    }
  }, {
    key: 'error',
    value: function error() {
      var _console2;

      for (var _len2 = arguments.length, message = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        message[_key2] = arguments[_key2];
      }

      (_console2 = console).log.apply(_console2, [_colors2.default.red('ERROR') + ' | ' + getDateStr() + ' |'].concat(message));
    }
  }, {
    key: 'info',
    value: function info() {
      var _console3;

      for (var _len3 = arguments.length, message = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        message[_key3] = arguments[_key3];
      }

      (_console3 = console).log.apply(_console3, [_colors2.default.blue('INFO') + ' | ' + getDateStr() + ' |'].concat(message));
    }
  }]);

  return Logger;
}();

exports.default = Logger;