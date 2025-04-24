
import { FeedbackData } from '@/hooks/useFeedbackReview';
import * as XLSX from 'xlsx';

export const exportToExcel = (data: FeedbackData[]) => {
  // Transform data for Excel
  const excelData = data.map(item => ({
    Channel: item.channel?.name || '',
    Rating: item.rating,
    'Submit Date': item.submit_date,
    'Submit Time': item.submit_time,
    Feedback: item.feedback,
    Category: item.category_name,
    'Sub Category': item.subcategory_name,
    Device: item.device,
    'App Version': item.app_version,
    Language: item.language,
    Sentiment: item.sentiment
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Feedback');
  
  // Save file
  XLSX.writeFile(wb, 'feedback_export.xlsx');
};

export const exportToPDF = (data: FeedbackData[]) => {
  // Create the PDF content
  const content = data.map(item => ({
    text: [
      `Channel: ${item.channel?.name || ''}`,
      `Rating: ${item.rating}`,
      `Date: ${item.submit_date}`,
      `Time: ${item.submit_time}`,
      `Feedback: ${item.feedback}`,
      `Category: ${item.category_name}`,
      `Sub Category: ${item.subcategory_name}`,
      `Device: ${item.device}`,
      `App Version: ${item.app_version}`,
      `Language: ${item.language}`,
      `Sentiment: ${item.sentiment}`,
      '-------------------'
    ].join('\n'),
    margin: [0, 0, 0, 10]
  }));

  const documentDefinition = {
    content: [
      { text: 'Feedback Export', style: 'header' },
      ...content
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    }
  };

  // Create and download PDF using pdfMake
  // @ts-ignore - pdfMake is loaded globally
  window.pdfMake.createPdf(documentDefinition).download('feedback_export.pdf');
};
