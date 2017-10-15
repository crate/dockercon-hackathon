import Logger from './helpers/logger';
import crate from 'node-crate';
import createStatement from './statements/createTable';
import 'babel-polyfill';
let inprogress = false;
let lastTimestamp = null;

const getLatestTimestamp = async crate => {
  const res = await crate.execute('select ts from sgmdata_aggregated order by ts desc limit 1');
  if (res && res.json.length > 0) {
    return res.json[0].ts;
  }
  return null;
};

const getTS = timestamp => {
  let ts;
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

const getRecords = async lastTimestamp => {
  const res = await crate.execute("select * from sgmdata where payload['ts'] > ? order by ts ASC limit 20", [
    getTS(lastTimestamp)
  ]);
  if (res && res.json.length > 0) {
    return res.json;
  }
  return null;
};

const handleRecord = async record => {
  Logger.info('handleRequest', record);
  const data = getDataFromPayload(record.payload);
  const ts = new Date(data.ts);
  ts.setSeconds(ts.getSeconds() - 4);
  await crate.execute('refresh table sgmdata_aggregated');
  const res = await crate.execute(
    'select * from sgmdata_aggregated where identifier=? and ts>=? order by ts ASC limit 1',
    [data.identifier, ts.getTime()]
  );
  let entity;
  let isNew = false;
  if (res && res.json.length > 0) {
    Logger.info('update');
    entity = res.json[0];
  } else {
    Logger.info('insert');
    isNew = true;
    entity = { ts: data.ts, identifier: data.identifier, data: {} };
  }

  entity.data[data.valueKey] = data.value;
  if (isNew) {
    await crate.insert('sgmdata_aggregated', entity);
  } else {
    await crate.update('sgmdata_aggregated', { data: entity.data }, `ts=${entity.ts.getTime()}`);
  }

  lastTimestamp = data.ts;
};

const getDataFromPayload = payload => {
  const keys = Object.keys(payload);
  const data = {};
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    if (key !== 'ts') {
      const tmp = key.split('_');
      data.identifier = `${tmp[1].toLowerCase()}-${tmp[2].toLowerCase()}`;
      data.valueKey = tmp[0].toLowerCase();
      data.value = payload[key];
    } else {
      data.ts = payload.ts;
    }
  }
  return data;
};

const handleData = async crate => {
  if (!lastTimestamp) {
    lastTimestamp = await getLatestTimestamp(crate);
  }

  setInterval(async function() {
    if (inprogress === true) {
      return;
    }
    inprogress = true;

    try {
      const records = await getRecords(lastTimestamp);
      if (records) {
        Logger.info(`${records.length} new Records from MQTT`);
        for (let i = 0; i < records.length; ++i) {
          const record = records[i];
          await handleRecord(record);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
    inprogress = false;
  }, 2000);
};

//configure connection
crate.connect(process.env.CRATE_HOST, 4200);

try {
  crate.execute(createStatement).then(res => {
    Logger.info('result on create Table', res);
    handleData(crate);
  });
} catch (err) {
  Logger.error('cannot create Table');
}
