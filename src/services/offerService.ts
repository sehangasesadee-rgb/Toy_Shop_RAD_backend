import Offer from "../models/Offer";
import Product from "../models/Product";

const getTodayKey = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};


const getDailyOffers = async () => {
  const todayKey = getTodayKey();
  const now = new Date();

  let offers = await Offer.find({
    offerType: "DAILY",
    dailyKey: todayKey,
    isActive: true,
  }).populate("productId");

  const validOffers = offers.filter((offer: any) => {
    const product = offer.productId;

    return (
      product &&
      product.discount > 0 &&
      product.oldPrice > product.price &&
      offer.offerPrice === product.price &&
      offer.discountPercent === product.discount
    );
  });

  if (validOffers.length !== offers.length || offers.length === 0) {
    await Offer.deleteMany({
      offerType: "DAILY",
      dailyKey: todayKey,
    });

    const products = await Product.find({
      stock: { $gt: 0 },
      discount: { $gt: 0 },
    }).limit(13);

    const newOffers = products.map((product) => ({
      productId: product._id,
      offerType: "DAILY" as const,
      offerPrice: product.price,
      discountPercent: product.discount,
      startDate: now,
      endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      dailyKey: todayKey,
      isActive: true,
    }));

    if (newOffers.length > 0) {
      await Offer.insertMany(newOffers);
    }

    offers = await Offer.find({
      offerType: "DAILY",
      dailyKey: todayKey,
      isActive: true,
    }).populate("productId");
  }

  return offers;
};


const getSeasonalOffers = async () => {
  const now = new Date();

  return await Offer.find({
    offerType: "SEASONAL",
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).populate("productId");
};

interface SeasonalOfferData {
  productId: string;
  offerPrice: number;
  campaignName: string;
  startDate: Date;
  endDate: Date;
}

const createSeasonalOffers = async (
  offersData: SeasonalOfferData[]
) => {
  const newOffers = [];

  for (const data of offersData) {
    const product = await Product.findById(data.productId);

    if (!product) {
      throw new Error(`Product not found: ${data.productId}`);
    }

    if (data.offerPrice >= product.price || data.offerPrice < 1) {
      throw new Error(
        `Offer price must be lower than product price: ${product.name}`
      );
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new Error("End date must be after start date");
    }

    const discountPercent = Math.round(
      ((product.price - data.offerPrice) / product.price) * 100
    );

    newOffers.push({
      productId: product._id,
      offerType: "SEASONAL" as const,
      offerPrice: data.offerPrice,
      discountPercent,
      campaignName: data.campaignName,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: true,
    });
  }

  return await Offer.insertMany(newOffers);
};


const deleteSeasonalOffer = async (offerId: string) => {
  return await Offer.findOneAndDelete({
    _id: offerId,
    offerType: "SEASONAL",
  });
};

export default {
  getDailyOffers,
  getSeasonalOffers,
  createSeasonalOffers,
  deleteSeasonalOffer,
};
