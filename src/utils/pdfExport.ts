import { ResumeData, TemplateConfig } from "@/types/resume";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// A4 dimensions at 96 DPI
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export interface ExportOptions {
  format: "pdf" | "png";
  filename?: string;
  scale?: number;
}

/**
 * Exports the resume to PDF using html2canvas + jsPDF
 * This ensures pixel-perfect A4 formatting that matches preview
 */
export const exportToPDF = async (
  resumeElement: HTMLElement,
  _template: TemplateConfig,
  data: ResumeData,
  options: ExportOptions = { format: "pdf" }
): Promise<void> => {
  const filename = options.filename || `${data.personalInfo.name.replace(/\s+/g, "_")}_Resume`;
  const scale = options.scale || 2;
  
  // Find the actual resume content
  const resumeShell = resumeElement.querySelector('.resume-shell') as HTMLElement | null;
  const targetElement = resumeShell || resumeElement;
  
  // Clone the element to avoid affecting the original
  const clone = targetElement.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.minHeight = `${A4_HEIGHT_PX}px`;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.background = 'white';
  
  // Remove any hover/focus states and editing UI
  const dragHandles = clone.querySelectorAll('[data-drag-handle]');
  dragHandles.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
  
  const hiddenElements = clone.querySelectorAll('.opacity-0');
  hiddenElements.forEach(el => el.classList.add('hidden'));
  
  document.body.appendChild(clone);
  
  try {
    // Calculate pages needed
    const contentHeight = clone.scrollHeight;
    const pageCount = Math.ceil(contentHeight / A4_HEIGHT_PX);
    
    // Create canvas with high resolution
    const canvas = await html2canvas(clone, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: contentHeight,
      logging: false,
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = A4_WIDTH_MM;
    const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;
    
    // Add image to PDF - handle multi-page
    if (pageCount === 1) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page: Split the canvas into pages
      const pageHeightPx = A4_HEIGHT_PX * scale;
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Create a canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightPx, canvas.height - (i * pageHeightPx));
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, i * pageHeightPx,
            canvas.width, pageCanvas.height,
            0, 0,
            canvas.width, pageCanvas.height
          );
        }
        
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const pageImgHeight = (pageCanvas.height * A4_WIDTH_MM) / pageCanvas.width;
        pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageImgHeight);
      }
    }
    
    // Download PDF
    pdf.save(`${filename}.pdf`);
    
  } finally {
    // Clean up
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
};

/**
 * Alternative export using direct canvas rendering for resume element
 */
export const exportResumeCanvas = async (
  canvasElement: HTMLElement,
  filename: string = "Resume"
): Promise<void> => {
  const scale = 2;
  
  const canvas = await html2canvas(canvasElement, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
  });
  
  const contentHeight = canvas.height / scale;
  const pageCount = Math.ceil(contentHeight / A4_HEIGHT_PX);
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  if (pageCount === 1) {
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  } else {
    const pageHeightPx = A4_HEIGHT_PX * scale;
    
    for (let i = 0; i < pageCount; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageHeightPx, canvas.height - (i * pageHeightPx));
      
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, i * pageHeightPx,
          canvas.width, pageCanvas.height,
          0, 0,
          canvas.width, pageCanvas.height
        );
      }
      
      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
      const pageImgHeight = (pageCanvas.height * A4_WIDTH_MM) / pageCanvas.width;
      pdf.addImage(pageImgData, 'JPEG', 0, 0, A4_WIDTH_MM, pageImgHeight);
    }
  }
  
  pdf.save(`${filename}.pdf`);
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
