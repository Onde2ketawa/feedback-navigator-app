
import Papa from 'papaparse';

interface CsvParseResult {
  data: any[];
  headers: string[];
  error: string | null;
}

// Updated documentation for CSV upload headers
export const CSV_UPLOAD_HEADERS = {
  RATING: 'rating',
  SUBMIT_DATE: 'submitDate',
  FEEDBACK: 'feedback'
};

export const CSV_UPLOAD_TEMPLATE = [
  CSV_UPLOAD_HEADERS.RATING,
  CSV_UPLOAD_HEADERS.SUBMIT_DATE,
  CSV_UPLOAD_HEADERS.FEEDBACK
].join(',') + '\n';

export const parseCsvFile = (file: File): Promise<CsvParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          resolve({
            data: [],
            headers: [],
            error: results.errors[0].message
          });
          return;
        }
        
        const data = results.data as any[];
        const headers = results.meta.fields || [];
        
        resolve({
          data,
          headers,
          error: null
        });
      },
      error: (error) => {
        resolve({
          data: [],
          headers: [],
          error: error.message
        });
      }
    });
  });
};
