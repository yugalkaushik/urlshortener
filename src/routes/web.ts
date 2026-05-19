import { Router } from "express";
import path from "path";

const router = Router();
const indexFile = path.resolve(__dirname, "../../public/index.html");

router.get("/", (_req, res) => {
  res.sendFile(indexFile);
});

export default router;