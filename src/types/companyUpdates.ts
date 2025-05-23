
export interface CompanyUpdate {
  title: string;
  date: string;
  description: string;
  category: string;
  url?: string;
  documentUrl?: string;
  documentType?: 'document' | 'video'; // Added to differentiate between document and video
}
