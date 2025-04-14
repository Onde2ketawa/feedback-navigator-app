
// Define the feedback data model
export interface Feedback {
  id: string;
  channel: string;
  rating: number;
  submitDate: string;
  feedback?: string;
  category?: string;
  subcategory?: string;
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

// Mock data for categories and subcategories
export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Technical Issues' },
  { id: 'cat2', name: 'Customer Service' },
  { id: 'cat3', name: 'Product Features' },
  { id: 'cat4', name: 'Usability' },
];

export const mockSubcategories: Subcategory[] = [
  { id: 'cat1-sub1', name: 'Login Problems' },
  { id: 'cat1-sub2', name: 'App Crashes' },
  { id: 'cat1-sub3', name: 'Slow Performance' },
  { id: 'cat2-sub1', name: 'Response Time' },
  { id: 'cat2-sub2', name: 'Staff Knowledge' },
  { id: 'cat3-sub1', name: 'Missing Features' },
  { id: 'cat3-sub2', name: 'Feature Requests' },
  { id: 'cat4-sub1', name: 'UI Design' },
  { id: 'cat4-sub2', name: 'Navigation' },
];

// Generate mock data
export const generateMockData = (): Feedback[] => {
  return Array.from({ length: 50 }).map((_, i) => {
    const id = `feedback-${i + 1}`;
    const channels = ['LINE Bank', 'MyHana'];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    
    // Generate a date within the last 6 months
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    const submitDate = date.toISOString().split('T')[0];
    
    // Add categories to some items
    let category, subcategory;
    if (Math.random() > 0.4) {
      const catIndex = Math.floor(Math.random() * mockCategories.length);
      category = mockCategories[catIndex].id;
      
      const subcats = mockSubcategories.filter(sc => sc.id.startsWith(category));
      if (subcats.length && Math.random() > 0.3) {
        const subIndex = Math.floor(Math.random() * subcats.length);
        subcategory = subcats[subIndex].id;
      }
    }
    
    return {
      id,
      channel,
      rating,
      submitDate,
      feedback: Math.random() > 0.3 ? `Sample feedback text ${i + 1}` : undefined,
      category,
      subcategory,
    };
  });
};
