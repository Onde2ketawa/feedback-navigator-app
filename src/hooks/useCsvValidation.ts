
interface ValidationResult {
  valid: boolean;
  invalidRows: number[];
  missingFields: {
    rating: boolean;
    submitDate: boolean;
  };
  dateFormatErrors: number[];
  nonNumericRatingErrors: number[];
  errorMessages: string[];
}

export const useCsvValidation = () => {
  // Validate CSV data: rating and submitDate fields are required
  const validateCsvData = (data: any[]): ValidationResult => {
    const invalidRows: number[] = [];
    const dateFormatErrors: number[] = [];
    const nonNumericRatingErrors: number[] = [];
    const errorMessages: string[] = [];
    let missingRating = false;
    let missingSubmitDate = false;
    
    data.forEach((row, index) => {
      const rowNum = index + 1;
      let hasError = false;
      
      // Check for required fields: rating must have values and be numeric
      const isMissingRating = !row.rating || row.rating === '';
      if (isMissingRating) {
        invalidRows.push(index);
        errorMessages.push(`Baris ${rowNum}: Kolom 'rating' kosong.`);
        missingRating = true;
        hasError = true;
      } else if (isNaN(Number(row.rating))) {
        nonNumericRatingErrors.push(index);
        errorMessages.push(`Baris ${rowNum}: Kolom 'rating' harus numerik.`);
        hasError = true;
      }
      
      // Check for required fields: submitDate must have values and be a valid date
      const isMissingSubmitDate = !row.submitDate || row.submitDate === '';
      if (isMissingSubmitDate) {
        if (!hasError) invalidRows.push(index);
        errorMessages.push(`Baris ${rowNum}: Kolom 'submit_date' kosong.`);
        missingSubmitDate = true;
        hasError = true;
      } else {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(row.submitDate) && !isNaN(Date.parse(row.submitDate))) {
          dateFormatErrors.push(index);
          errorMessages.push(`Baris ${rowNum}: Format 'submit_date' tidak valid (harus YYYY-MM-DD).`);
          hasError = true;
        }
      }
    });
    
    return {
      valid: invalidRows.length === 0 && dateFormatErrors.length === 0 && nonNumericRatingErrors.length === 0,
      invalidRows,
      missingFields: {
        rating: missingRating,
        submitDate: missingSubmitDate
      },
      dateFormatErrors,
      nonNumericRatingErrors,
      errorMessages
    };
  };

  return { validateCsvData };
};
