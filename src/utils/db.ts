import StormDB from "stormdb";
const engine = new StormDB.localFileEngine("./db.stormdb");

export const db = new StormDB(engine);

db.default({ allowlist: [] })
db.save()
