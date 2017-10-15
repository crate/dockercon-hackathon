"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var statement = "\n  create table if not exists sgmdata_aggregated (\n    ts timestamp,\n    identifier string,\n    data object(dynamic) as (\n      offseta float,\n      offsetx float,\n      offsety float\n    ),\n    PRIMARY KEY (\"ts\", \"identifier\")\n  );";

exports.default = statement;