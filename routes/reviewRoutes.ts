import express from "express";
import { createReview, deleteReview } from "../controllers/reviewController";

const router = express.Router({ mergeParams: true });



router.post("/", createReview)

router.delete("/:reviewId",deleteReview)


module.exports = router;