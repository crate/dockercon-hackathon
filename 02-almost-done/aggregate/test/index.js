/*eslint-disable no-undef */

import http from 'http';
import assert from 'assert';

import '../src/server.js';

describe('return index route', () => {
  it('should return 200', done => {
    http.get('http://127.0.0.1:3001/api', res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
/*eslint-enable no-undef */
