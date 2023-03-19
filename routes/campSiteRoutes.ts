import express from "express";
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary");
import {
  createCampSite,
  deleteCampsite,
  editCampsite,
  getAllCampSite,
  getCampSite,
} from "../controllers/campSites";

const upload = multer({ storage });

router.get("/", getAllCampSite);

router.post("/", upload.single("image"), createCampSite);

router.get("/:id", getCampSite);

router.put("/:id", upload.single("image"), editCampsite);

router.delete("/:id", deleteCampsite);

module.exports = router;
