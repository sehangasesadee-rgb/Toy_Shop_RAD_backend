import { Request, Response } from "express";
import offerService from "../services/offerService";

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

const getDailyOffers = async (req: Request, res: Response) => {
  try {
    const offers = await offerService.getDailyOffers();

    return sendResponse(
      res,
      200,
      "Daily offers retrieved successfully",
      offers
    );
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getSeasonalOffers = async (req: Request, res: Response) => {
  try {
    const offers = await offerService.getSeasonalOffers();

    return sendResponse(
      res,
      200,
      "Seasonal offers retrieved successfully",
      offers
    );
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const createSeasonalOffers = async (req: Request, res: Response) => {
  try {
    const offers = await offerService.createSeasonalOffers(
      req.body.offers
    );

    return sendResponse(
      res,
      201,
      "Seasonal offers created successfully",
      offers
    );
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteSeasonalOffer = async (req: Request, res: Response) => {
  try {
    const offer = await offerService.deleteSeasonalOffer(
      String(req.params.id)
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Seasonal offer not found",
      });
    }

    return sendResponse(
      res,
      200,
      "Seasonal offer deleted successfully"
    );
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getDailyOffers,
  getSeasonalOffers,
  createSeasonalOffers,
  deleteSeasonalOffer,
};
