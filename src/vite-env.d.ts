
/// <reference types="vite/client" />

// Declare pdfMake as a global variable
interface Window {
  pdfMake: {
    createPdf: (documentDefinition: any) => {
      download: (filename: string) => void;
    };
  };
}
