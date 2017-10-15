'use strict';

var _logger = require('./helpers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _nodeCrate = require('node-crate');

var _nodeCrate2 = _interopRequireDefault(_nodeCrate);

var _createTable = require('./statements/createTable');

var _createTable2 = _interopRequireDefault(_createTable);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var inprogress = false;
var lastTimestamp = null;

var getLatestTimestamp = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(crate) {
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return crate.execute('select ts from sgmdata_aggregated order by ts desc limit 1');

          case 2:
            res = _context.sent;

            if (!(res && res.json.length > 0)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', res.json[0].ts);

          case 5:
            return _context.abrupt('return', null);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getLatestTimestamp(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getTS = function getTS(timestamp) {
  var ts = void 0;
  if (!timestamp) {
    ts = new Date();
    ts.setTime(0);
  } else {
    ts = timestamp;
  }
  if (ts.getTime) {
    ts = ts.getTime();
  }
  return ts;
};

var getRecords = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(lastTimestamp) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _nodeCrate2.default.execute("select * from sgmdata where payload['ts'] > ? order by ts ASC limit 20", [getTS(lastTimestamp)]);

          case 2:
            res = _context2.sent;

            if (!(res && res.json.length > 0)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt('return', res.json);

          case 5:
            return _context2.abrupt('return', null);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getRecords(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var handleRecord = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(record) {
    var data, ts, res, entity, isNew;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger2.default.info('handleRequest', record);
            data = getDataFromPayload(record.payload);
            ts = new Date(data.ts);

            ts.setSeconds(ts.getSeconds() - 4);
            _context3.next = 6;
            return _nodeCrate2.default.execute('refresh table sgmdata_aggregated');

          case 6:
            _context3.next = 8;
            return _nodeCrate2.default.execute('select * from sgmdata_aggregated where identifier=? and ts>=? order by ts ASC limit 1', [data.identifier, ts.getTime()]);

          case 8:
            res = _context3.sent;
            entity = void 0;
            isNew = false;

            if (res && res.json.length > 0) {
              _logger2.default.info('update');
              entity = res.json[0];
            } else {
              _logger2.default.info('insert');
              isNew = true;
              entity = { ts: data.ts, identifier: data.identifier, data: {} };
            }

            entity.data[data.valueKey] = data.value;

            if (!isNew) {
              _context3.next = 18;
              break;
            }

            _context3.next = 16;
            return _nodeCrate2.default.insert('sgmdata_aggregated', entity);

          case 16:
            _context3.next = 20;
            break;

          case 18:
            _context3.next = 20;
            return _nodeCrate2.default.update('sgmdata_aggregated', { data: entity.data }, 'ts=' + entity.ts.getTime());

          case 20:

            lastTimestamp = data.ts;

          case 21:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function handleRecord(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getDataFromPayload = function getDataFromPayload(payload) {
  var keys = Object.keys(payload);
  var data = {};
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    if (key !== 'ts') {
      var tmp = key.split('_');
      data.identifier = tmp[1].toLowerCase() + '-' + tmp[2].toLowerCase();
      data.valueKey = tmp[0].toLowerCase();
      data.value = payload[key];
    } else {
      data.ts = payload.ts;
    }
  }
  return data;
};

var handleData = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(crate) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (lastTimestamp) {
              _context5.next = 4;
              break;
            }

            _context5.next = 3;
            return getLatestTimestamp(crate);

          case 3:
            lastTimestamp = _context5.sent;

          case 4:

            setInterval(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
              var records, i, record;
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      if (!(inprogress === true)) {
                        _context4.next = 2;
                        break;
                      }

                      return _context4.abrupt('return');

                    case 2:
                      inprogress = true;

                      _context4.prev = 3;
                      _context4.next = 6;
                      return getRecords(lastTimestamp);

                    case 6:
                      records = _context4.sent;

                      if (!records) {
                        _context4.next = 17;
                        break;
                      }

                      _logger2.default.info(records.length + ' new Records from MQTT');
                      i = 0;

                    case 10:
                      if (!(i < records.length)) {
                        _context4.next = 17;
                        break;
                      }

                      record = records[i];
                      _context4.next = 14;
                      return handleRecord(record);

                    case 14:
                      ++i;
                      _context4.next = 10;
                      break;

                    case 17:
                      _context4.next = 22;
                      break;

                    case 19:
                      _context4.prev = 19;
                      _context4.t0 = _context4['catch'](3);

                      _logger2.default.error(_context4.t0);

                    case 22:
                      inprogress = false;

                    case 23:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _callee4, this, [[3, 19]]);
            })), 2000);

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function handleData(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

//configure connection
_nodeCrate2.default.connect(process.env.CRATE_HOST, 4200);

try {
  _nodeCrate2.default.execute(_createTable2.default).then(function (res) {
    _logger2.default.info('result on create Table', res);
    handleData(_nodeCrate2.default);
  });
} catch (err) {
  _logger2.default.error('cannot create Table');
}