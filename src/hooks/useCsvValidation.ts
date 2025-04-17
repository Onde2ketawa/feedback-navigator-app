
interface ValidationResult {
  valid: boolean;
  invalidRows: number[];
  missingFields: {
    rating: boolean;
    submitDate: boolean;
  };
}

export const useCsvValidation = () => {
  // Validate CSV data: rating and submitDate fields are required
  const validateCsvData = (data: any[]): ValidationResult => {
    const invalidRows: number[] = [];
    let missingRating = false;
    let missingSubmitDate = false;
    
    data.forEach((row, index) => {
      // Check for required fields: rating and submitDate must have values
      const isMissingRating = !row.rating || row.rating === '';
      const isMissingSubmitDate = !row.submitDate || row.submitDate === '';
      
      if (isMissingRating || isMissingSubmitDate) {
        invalidRows.push(index);
        
        if (isMissingRating) missingRating = true;
        if (isMissingSubmitDate) missingSubmitDate = true;
      }
    });
    
    return {
      valid: invalidRows.length === 0,
      invalidRows,
      missingFields: {
        rating: missingRating,
        submitDate: missingSubmitDate
      }
    };
  };

  return { validateCsvData };
};
