import { Request, Response } from "express";
import seasonService from "../services/seasonService";

const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const getAllSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await seasonService.getAllSeasons();

    return sendResponse(
      res,
      200,
      "Seasons retrieved successfully",
      seasons
    );
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getActiveSeasons = async (req: Request, res: Response) => {
  try {
    const seasons = await seasonService.getActiveSeasons();

    return sendResponse(
      res,
      200,
      "Active seasons retrieved successfully",
      seasons
    );
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const createSeason = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a season banner image",
      });
    }

    const seasonData = {
      ...req.body,
      bannerImage: `/uploads/seasons/${req.file.filename}`,
    };

    const season = await seasonService.createSeason(seasonData);

    return sendResponse(
      res,
      201,
      "Season created successfully",
      season
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSeason = async (req: Request, res: Response) => {
  try {
    const updateData = {
      ...req.body,
      ...(req.file && {
        bannerImage: `/uploads/seasons/${req.file.filename}`,
      }),
    };

    const season = await seasonService.updateSeason(
      String(req.params.id),
      updateData
    );

    return sendResponse(
      res,
      200,
      "Season updated successfully",
      season
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const changeSeasonStatus = async (req: Request, res: Response) => {
  try {
    const season = await seasonService.changeSeasonStatus(
      String(req.params.id),
      req.body.isActive
    );

    return sendResponse(
      res,
      200,
      "Season status updated successfully",
      season
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSeason = async (req: Request, res: Response) => {
  try {
    const result = await seasonService.deleteSeason(
      String(req.params.id)
    );

    return sendResponse(
      res,
      200,
      "Season deleted successfully",
      result
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const addProductsToSeason = async (req: Request, res: Response) => {
  try {
    const offers = await seasonService.addProductsToSeason(
      String(req.params.id),
      req.body.products
    );

    return sendResponse(
      res,
      201,
      "Products added to season successfully",
      offers
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSeasonProducts = async (req: Request, res: Response) => {
  try {
    const products = await seasonService.getSeasonProducts(
      String(req.params.id)
    );

    return sendResponse(
      res,
      200,
      "Season products retrieved successfully",
      products
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSeasonProductPrice = async (
  req: Request,
  res: Response
) => {
  try {
    const offer = await seasonService.updateSeasonProductPrice(
      String(req.params.id),
      String(req.params.offerId),
      Number(req.body.offerPrice)
    );

    return sendResponse(
      res,
      200,
      "Season product offer price updated successfully",
      offer
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const removeProductFromSeason = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await seasonService.removeProductFromSeason(
      String(req.params.id),
      String(req.params.offerId)
    );

    return sendResponse(
      res,
      200,
      "Product removed from season successfully",
      result
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getAllSeasons,
  getActiveSeasons,
  createSeason,
  updateSeason,
  changeSeasonStatus,
  deleteSeason,
  addProductsToSeason,
  getSeasonProducts,
  updateSeasonProductPrice,
  removeProductFromSeason,
};
