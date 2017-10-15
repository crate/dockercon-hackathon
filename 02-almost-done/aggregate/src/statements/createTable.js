const statement = `
  create table if not exists sgmdata_aggregated (
    ts timestamp,
    identifier string,
    data object(dynamic) as (
      offseta float,
      offsetx float,
      offsety float
    ),
    PRIMARY KEY ("ts", "identifier")
  );`;

export default statement;
