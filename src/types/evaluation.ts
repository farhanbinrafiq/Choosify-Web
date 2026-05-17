export interface EvaluationCriteria {
  label: string;
  score: number; // 1-10
}

export interface EvaluationData {
  productId: number;
  productName: string;
  categoryType: string;
  overallScore: number;
  grade: string; // e.g., "A+", "B", etc.
  criteria: EvaluationCriteria[];
  strengths: string[];
  considerations: string[];
  bestFor: string;
  valueScore: number;
  evaluationDetails: {
    audience: {
      label: string;
      items: string[];
    };
    styling: {
      label: string;
      items: string[];
    };
    trend: {
      label: string;
      items: string[];
    };
    sizeFitting?: {
      label: string;
      items: string[];
    };
    material?: {
      label: string;
      items: string[];
    };
    occasion?: {
      label: string;
      items: string[];
    };
  };
}

export interface ComparisonProduct {
  brand: string;
  subBrand?: string;
  quality: 'Excellent' | 'Great' | 'Good' | 'Budget' | 'Premium' | 'Affordable' | 'Normal';
  service: 'Excellent' | 'Best' | 'Great' | 'Premium' | 'Normal' | 'Average';
  priceRange: {
    min: number;
    max?: number;
  };
  packaging: string;
  performance: 'Awesome' | 'Excellent' | 'Great' | 'Good' | 'Average' | 'Disappointed';
  score: number;
  actionLabel: string;
}
