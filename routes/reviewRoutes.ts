import express from "express";
import { createReview, deleteReview } from "../controllers/review";
import { isLoggedIn } from "../middleware";
const router = express.Router({ mergeParams: true });



router.post("/", isLoggedIn, createReview)

router.delete("/:reviewId",isLoggedIn,deleteReview)


module.exports = router;