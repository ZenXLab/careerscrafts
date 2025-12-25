import { ResumeData, TemplateConfig } from "@/types/resume";

// A4 dimensions at 96 DPI
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

export interface ExportOptions {
  format: "pdf" | "png";
  filename?: string;
  scale?: number;
}

/**
 * Exports the resume to PDF using browser print functionality
 * This ensures pixel-perfect A4 formatting
 */
export const exportToPDF = async (
  resumeElement: HTMLElement,
  template: TemplateConfig,
  data: ResumeData,
  options: ExportOptions = { format: "pdf" }
): Promise<void> => {
  const { filename = `${data.personalInfo.name.replace(/\s+/g, "_")}_Resume` } = options;
  
  // Create a new window for printing
  const printWindow = window.open("", "_blank", `width=${A4_WIDTH_PX},height=${A4_HEIGHT_PX}`);
  
  if (!printWindow) {
    throw new Error("Could not open print window. Please allow popups.");
  }
  
  // Get the resume HTML content
  const resumeContent = resumeElement.innerHTML;
  
  // Build the print document
  const printDocument = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    html, body {
      width: 210mm;
      min-height: 297mm;
      margin: 0;
      padding: 0;
      background: white;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
      }
      
      .resume-page {
        width: 210mm;
        min-height: 297mm;
        page-break-after: always;
        page-break-inside: avoid;
      }
    }
    
    .resume-page {
      width: 210mm;
      min-height: 297mm;
      background: white;
      margin: 0 auto;
    }
    
    /* Typography */
    h1 { font-size: 24pt; font-weight: 700; }
    h2 { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
    h3 { font-size: 12pt; font-weight: 700; }
    p, li, span { font-size: 10pt; line-height: 1.45; }
    
    /* Print-specific overrides */
    .no-print { display: none !important; }
    
    /* Ensure backgrounds print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="resume-page">
    ${resumeContent}
  </div>
  <script>
    // Auto-print when loaded
    window.onload = function() {
      setTimeout(function() {
        window.print();
        // Close after a delay to allow print dialog
        setTimeout(function() {
          window.close();
        }, 1000);
      }, 500);
    };
  </script>
</body>
</html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
};

/**
 * Generates a print-ready preview element
 */
export const createPrintPreview = (
  resumeElement: HTMLElement,
  scale: number = 1
): HTMLElement => {
  const preview = document.createElement("div");
  preview.style.cssText = `
    width: ${A4_WIDTH_PX * scale}px;
    height: ${A4_HEIGHT_PX * scale}px;
    background: white;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    transform-origin: top left;
  `;
  
  const content = resumeElement.cloneNode(true) as HTMLElement;
  content.style.cssText = `
    transform: scale(${scale});
    transform-origin: top left;
    width: ${A4_WIDTH_PX}px;
    min-height: ${A4_HEIGHT_PX}px;
  `;
  
  preview.appendChild(content);
  return preview;
};

/**
 * Checks if content overflows the page
 */
export const checkPageOverflow = (resumeElement: HTMLElement): boolean => {
  const height = resumeElement.scrollHeight;
  return height > A4_HEIGHT_PX;
};

/**
 * Gets the number of pages needed
 */
export const getPageCount = (resumeElement: HTMLElement): number => {
  const height = resumeElement.scrollHeight;
  return Math.ceil(height / A4_HEIGHT_PX);
};
