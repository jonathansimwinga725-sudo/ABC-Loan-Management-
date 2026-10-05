import oracledb from "oracledb";
import { config } from "./config.js";

export async function initialiseDatabase(): Promise<void> {
  await oracledb.createPool({
    user: config.oracle.user,
    password: config.oracle.password,
    connectString: config.oracle.connectString,
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1
  });
}

export async function closeDatabase(): Promise<void> {
  const pool = oracledb.getPool();
  await pool.close(10);
}
