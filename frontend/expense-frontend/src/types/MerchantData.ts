export interface MerchantData {
  merchant_data: {
    // Handles any dynamic merchant string key with a numeric total expense
    merchants_grouped: {
      [merchantName: string]: number
    }

    // Explicitly types your known categories, but allows for new ones safely
    merchant_category_grouped: {
      MISCELLANEOUS: number
      PERSONAL_SERVICES: number
      RESTAURANTS: number
      RETAIL_STORES: number
      [category: string]: number // Fallback for any new categories added later
    }
  }
}
