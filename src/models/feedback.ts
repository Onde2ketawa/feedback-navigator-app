
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

// Update generateMockData to use new categories and subcategories
export const generateMockData = (): Feedback[] => {
  return Array.from({ length: 50 }).map((_, i) => {
    const id = `feedback-${i + 1}`;
    const channels = ['LINE Bank', 'MyHana'];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    const submitDate = date.toISOString().split('T')[0];
    
    // Improved category and subcategory selection
    let category, subcategory;
    if (Math.random() > 0.3) {
      const catIndex = Math.floor(Math.random() * mockCategories.length);
      category = mockCategories[catIndex].id;
      
      const subcats = mockSubcategories.filter(sc => 
        sc.id.startsWith(category.split('-')[0])
      );
      
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
