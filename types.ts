export interface AdConfig {
  shopName: string;
  slogan: string;
  location: string;
  whatsappNumber: string;
  subtext: string;
  misopPriceStart: string;
  misopPriceRange: string;
  gorenganPriceRange: string;
  kuePriceRange: string;
}

export interface Creation {
  id: string;
  name: string;
  html: string;
  originalImage?: string;
  timestamp: Date;
}
