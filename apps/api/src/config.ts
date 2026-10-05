import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  oracle: {
    user: required("ORACLE_USER"),
    password: required("ORACLE_PASSWORD"),
    connectString: required("ORACLE_CONNECTION_STRING")
  }
};
