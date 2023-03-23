import { CampSite } from "../models/campingSite";
import { UserType } from "../models/user";
import { Request, Response } from "express";

import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const mapBoxToken = process.env.MAPBOX_TOKEN as string;

const geocoder = mbxGeocoding({ accessToken: mapBoxToken as string });

const cloudinary = require("../cloudinary");

// READ

// Get All campsites
export const getAllCampSite = async (_req: Request, res: Response) => {
  try {
    const campSites = await CampSite.find();
    res.status(200).json(campSites);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// Get a Single campsite
export const getCampSite = async (req: Request, res: Response) => {
  try {
    const campsite = await CampSite.findById(req.params.id)
      .populate({
        //this is a nested populate. We populate all the review from the campsite that we are finding
        path: "reviews", // there are many reviews which were written by many user. We also need to populate the author in every reviews
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campsite) {
      res.status(404).json({ message: "Camping place not found" });
      return;
    }
    res.status(200).json(campsite);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a New Campsite
export const createCampSite = async (req: Request, res: Response) => {
  try {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
     const userTypeWithId = req.user as UserType & { _id: string };
    const { title, location, price, description } = req.body;

    const campsite = new CampSite({
      title,
      images: {
        url: req?.file?.path,
        fileName: req?.file?.fieldname,
      },
      description: description,
      author: userTypeWithId._id,
      location,
      price,
      geometry: geoData.body.features[0].geometry,
    });
    await campsite.save();
    res.status(200).json(campsite);

  } catch (error) {
    (error: any) => {
      res.status(500).json({ message: error.message });
    };
  }
};

//--Edit campsite--

export const editCampsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let image;
    const campsite = await CampSite.findById(id);
    if (req?.file === undefined) {
      if (!req.body?.imageUrl) {
        image = { url: "", fileName: "" };
      } else {
        image = {
          url: campsite.images.url,
          fileName: campsite.images.fileName,
        };
      }
    } else {
      image = {
        url: req.file?.path,
        fileName: req.file?.fieldname,
      };
    }

    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();

    if (image?.fileName !== campsite.images.fileName) {
      await cloudinary?.uploader?.destroy(campsite.images.fileName);
    }
    const campsiteUpdated = await CampSite.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: req.file === undefined ? campsite.images : image,
        geometry: geoData.body.features[0].geometry,
      },
      { new: true }
    );
    res.status(200).json(campsiteUpdated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCampsite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CampSite.findByIdAndDelete(id);
    res.status(200).json("deleted successfully!!!");
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
