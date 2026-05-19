import serverless from "serverless-http";
import app from "../src/app";
import { connectDB } from "../src/config/db";

let handler: any;

export default async function (req: any, res: any) {
  await connectDB();

  if (!handler) {
    handler = serverless(app);
  }

  return handler(req, res);
}
