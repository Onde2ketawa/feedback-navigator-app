
import Papa from 'papaparse';

interface CsvParseResult {
  data: any[];
  headers: string[];
  error: string | null;
}

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
