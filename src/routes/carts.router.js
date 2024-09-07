import { error } from "console";
import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.json();
});

router.get("/:cid", (req, res) => {
  res.send(`${req.params.cid}`);
});

router.post("/:cid", (req, res) => {
  res.send();
});

export default router;
