
interface ValidationResult {
  valid: boolean;
  invalidRows: number[];
}

export const useCsvValidation = () => {
  // Validate CSV data: rating and submitDate fields are required
  const validateCsvData = (data: any[]): ValidationResult => {
    const invalidRows: number[] = [];
    
    data.forEach((row, index) => {
      // Check for required fields: rating and submitDate must have values
      if (!row.rating || row.rating === '' || !row.submitDate || row.submitDate === '') {
        invalidRows.push(index);
      }
    });
    
    return {
      valid: invalidRows.length === 0,
      invalidRows
    };
  };

  return { validateCsvData };
};
