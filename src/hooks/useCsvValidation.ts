
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
  // Validate CSV data: only rating and submitDate fields are required
  const validateCsvData = (data: any[]): ValidationResult => {
    const invalidRows: number[] = [];
    const dateFormatErrors: number[] = [];
    const nonNumericRatingErrors: number[] = [];
    const errorMessages: string[] = [];
    let missingRating = false;
    let missingSubmitDate = false;
    
    data.forEach((row, index) => {
      // Menampilkan baris dimulai dari 2 (karena baris 1 adalah header)
      const rowNum = index + 2;
      let rowHasError = false;
      
      // Check for required fields: rating must have values and be numeric
      if (!row.rating || row.rating === '') {
        invalidRows.push(index);
        errorMessages.push(`Baris ${rowNum}: Kolom 'rating' wajib diisi.`);
        missingRating = true;
        rowHasError = true;
      } else if (isNaN(Number(row.rating))) {
        nonNumericRatingErrors.push(index);
        errorMessages.push(`Baris ${rowNum}: Kolom 'rating' harus numerik.`);
        if (!rowHasError) {
          invalidRows.push(index);
          rowHasError = true;
        }
      }
      
      // Check for required fields: submitDate must have values and be a valid date
      if (!row.submitDate || row.submitDate === '') {
        if (!rowHasError) invalidRows.push(index);
        errorMessages.push(`Baris ${rowNum}: Kolom 'submit_date' wajib diisi.`);
        missingSubmitDate = true;
        rowHasError = true;
      } else {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(row.submitDate)) {
          dateFormatErrors.push(index);
          errorMessages.push(`Baris ${rowNum}: Format 'submit_date' tidak valid (harus YYYY-MM-DD).`);
          if (!rowHasError) invalidRows.push(index);
          rowHasError = true;
        }
      }
      
      // No validation for other fields - they can be empty
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
