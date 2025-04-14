
// Define the feedback data model based on Supabase database structure
export interface Feedback {
  id: string;
  channel: string;
  rating: number;
  submitDate: string;
  feedback?: string;
  category?: string;
  subcategory?: string;
  sentiment?: string;
  sentiment_score?: number;
}

// Define the category data models
export interface Category {
  id: string;
  name: string;
}

export interface Subcategory {
  id: string;
  name: string;
}

// Update the existing mockCategories and mockSubcategories

export const mockCategories: Category[] = [
  { id: 'tech-issues', name: 'Technical Issues' },
  { id: 'customer-service', name: 'Customer Service' },
  { id: 'product-features', name: 'Product Features' },
  { id: 'usability', name: 'Usability' },
  { id: 'performance', name: 'Performance' },
  { id: 'security', name: 'Security' }
];

export const mockSubcategories: Subcategory[] = [
  // Technical Issues
  { id: 'login-problems', name: 'Login Problems' },
  { id: 'app-crashes', name: 'App Crashes' },
  { id: 'connectivity', name: 'Connectivity Issues' },

  // Customer Service
  { id: 'response-time', name: 'Response Time' },
  { id: 'staff-knowledge', name: 'Staff Knowledge' },
  { id: 'communication', name: 'Communication Quality' },

  // Product Features
  { id: 'missing-features', name: 'Missing Features' },
  { id: 'feature-requests', name: 'Feature Requests' },
  { id: 'feature-complexity', name: 'Feature Complexity' },

  // Usability
  { id: 'ui-design', name: 'UI Design' },
  { id: 'navigation', name: 'Navigation' },
  { id: 'accessibility', name: 'Accessibility' },

  // Performance
  { id: 'slow-loading', name: 'Slow Loading' },
  { id: 'resource-usage', name: 'Resource Usage' },
  { id: 'battery-drain', name: 'Battery Drain' },

  // Security
  { id: 'data-privacy', name: 'Data Privacy' },
  { id: 'authentication', name: 'Authentication' },
  { id: 'data-protection', name: 'Data Protection' }
];

// We'll remove the generateMockData function as we'll use real data from Supabase
