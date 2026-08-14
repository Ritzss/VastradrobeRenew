export type ProductReview = {
  _id: string;
  displayName: string;
  isAnonymous: boolean;
  rating: number;
  comment: string;
  variant: {
    color: string;
    design: string;
  };
  verifiedPurchase: boolean;
  createdAt: string;
};

export type ReviewRating = {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};