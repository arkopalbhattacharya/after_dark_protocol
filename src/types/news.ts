export type NewsSourceId = 
  | 'PLANETARY_AFFAIRS' 
  | 'UNIVERSAL_SPORTS' 
  | 'COMMERCE_TRADE' 
  | 'VOID_SATIRE';

export interface NewsSource {
  id: NewsSourceId;
  code: string;
  name: string;
  codename: string;
  icon: string;
  description: string;
  frequencyMinutes: { min: number; max: number };
}

export interface NewsArticle {
  id: string;
  sourceId: NewsSourceId;
  headline: string;
  content: string;
  planetOrSector: string;
  timestamp: string;
  tag: string;
  urgency?: 'ROUTINE' | 'FLASH' | 'CRITICAL' | 'ODDITY';
  authorOrWire?: string;
}
