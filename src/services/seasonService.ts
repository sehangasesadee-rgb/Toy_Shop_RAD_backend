import mongoose from "mongoose";
import Season from "../models/Season";
import Offer from "../models/Offer";
import Product from "../models/Product";

const getAllSeasons = async () => {
  return await Season.find().sort({ createdAt: -1 });
};

const getActiveSeasons = async () => {
  const now = new Date();

  return await Season.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ startDate: 1 });
};

const createSeason = async (seasonData: {
  name: string;
  description: string;
  bannerImage: string;
  startDate: Date;
  endDate: Date;
}) => {
  const { name, description, bannerImage, startDate, endDate } = seasonData;

  if (new Date(startDate) >= new Date(endDate)) {
    throw new Error("End date must be after start date");
  }

  return await Season.create({
    name,
    description,
    bannerImage,
    startDate,
    endDate,
    isActive: true,
  });
};

const updateSeason = async (
  seasonId: string,
  updateData: Partial<{
    name: string;
    description: string;
    bannerImage: string;
    startDate: Date;
    endDate: Date;
  }>
) => {
  if (!mongoose.Types.ObjectId.isValid(seasonId)) {
    throw new Error("Invalid season ID");
  }

  const season = await Season.findById(seasonId);

  if (!season) {
    throw new Error("Season not found");
  }

  const startDate = updateData.startDate ?? season.startDate;
  const endDate = updateData.endDate ?? season.endDate;

  if (new Date(startDate) >= new Date(endDate)) {
    throw new Error("End date must be after start date");
  }

  const updatedSeason = await Season.findByIdAndUpdate(
    seasonId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedSeason) {
    throw new Error("Season update failed");
  }

  await Offer.updateMany(
    {
      seasonId: updatedSeason._id,
      offerType: "SEASONAL",
    },
    {
      $set: {
        campaignName: updatedSeason.name,
        startDate: updatedSeason.startDate,
        endDate: updatedSeason.endDate,
      },
    }
  );

  return updatedSeason;
};

const changeSeasonStatus = async (
  seasonId: string,
  isActive: boolean
) => {
  if (!mongoose.Types.ObjectId.isValid(seasonId)) {
    throw new Error("Invalid season ID");
  }

  const season = await Season.findByIdAndUpdate(
    seasonId,
    { isActive },
    { new: true, runValidators: true }
  );

  if (!season) {
    throw new Error("Season not found");
  }

  await Offer.updateMany(
    { seasonId: season._id },
    { isActive }
  );

  return season;
};

const deleteSeason = async (seasonId: string) => {
  if (!mongoose.Types.ObjectId.isValid(seasonId)) {
    throw new Error("Invalid season ID");
  }

  const season = await Season.findById(seasonId);

  if (!season) {
    throw new Error("Season not found");
  }

  await Offer.deleteMany({ seasonId: season._id });
  await Season.findByIdAndDelete(seasonId);

  return { message: "Season deleted successfully" };
};

const addProductsToSeason = async (
  seasonId: string,
  products: {
    productId: string;
    offerPrice: number;
  }[]
) => {
  if (!mongoose.Types.ObjectId.isValid(seasonId)) {
    throw new Error("Invalid season ID");
  }

  const season = await Season.findById(seasonId);

  if (!season) {
    throw new Error("Season not found");
  }

  if (!products || products.length === 0) {
    throw new Error("Please select at least one product");
  }

  const createdOffers = [];

  for (const item of products) {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      throw new Error("Invalid product ID");
    }

    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (
      !Number.isFinite(item.offerPrice) ||
      item.offerPrice <= 0 ||
      item.offerPrice >= product.price
    ) {
      throw new Error(
        `Offer price must be greater than 0 and lower than the product price: ${product.name}`
      );
    }

    const existingOffer = await Offer.findOne({
      seasonId: season._id,
      productId: product._id,
    });

    if (existingOffer) {
      throw new Error(`${product.name} is already in this season`);
    }

    const discountPercent = Math.round(
      ((product.price - item.offerPrice) / product.price) * 100
    );

    const offer = await Offer.create({
      productId: product._id,
      seasonId: season._id,
      offerType: "SEASONAL",
      offerPrice: item.offerPrice,
      discountPercent,
      campaignName: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      isActive: season.isActive,
    });

    createdOffers.push(offer);
  }

  return createdOffers;
};

const getSeasonProducts = async (seasonId: string) => {
  if (!mongoose.Types.ObjectId.isValid(seasonId)) {
    throw new Error("Invalid season ID");
  }

  const season = await Season.findById(seasonId);

  if (!season) {
    throw new Error("Season not found");
  }

  return await Offer.find({
    seasonId: season._id,
    offerType: "SEASONAL",
  }).populate("productId");
};

const updateSeasonProductPrice = async (
  seasonId: string,
  offerId: string,
  offerPrice: number
) => {
  if (
    !mongoose.Types.ObjectId.isValid(seasonId) ||
    !mongoose.Types.ObjectId.isValid(offerId)
  ) {
    throw new Error("Invalid ID");
  }

  const offer = await Offer.findOne({
    _id: offerId,
    seasonId,
    offerType: "SEASONAL",
  }).populate("productId");

  if (!offer) {
    throw new Error("Season product offer not found");
  }

  const product = offer.productId as any;

  if (
    !Number.isFinite(offerPrice) ||
    offerPrice <= 0 ||
    offerPrice >= product.price
  ) {
    throw new Error("Offer price must be lower than the product price");
  }

  const discountPercent = Math.round(
    ((product.price - offerPrice) / product.price) * 100
  );

  offer.offerPrice = offerPrice;
  offer.discountPercent = discountPercent;

  await offer.save();

  return offer;
};

const removeProductFromSeason = async (
  seasonId: string,
  offerId: string
) => {
  if (
    !mongoose.Types.ObjectId.isValid(seasonId) ||
    !mongoose.Types.ObjectId.isValid(offerId)
  ) {
    throw new Error("Invalid ID");
  }

  const deletedOffer = await Offer.findOneAndDelete({
    _id: offerId,
    seasonId,
    offerType: "SEASONAL",
  });

  if (!deletedOffer) {
    throw new Error("Season product offer not found");
  }

  return { message: "Product removed from season successfully" };
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
