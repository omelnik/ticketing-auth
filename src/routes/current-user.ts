import { Router } from "express";
import { currentUser } from "@git-tickets/common";

const router = Router();

router.get("/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
