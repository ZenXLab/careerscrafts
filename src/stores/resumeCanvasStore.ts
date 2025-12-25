import { create } from 'zustand';

// Section order store - keeps Slate content separate from layout state
interface ResumeCanvasStore {
  // Section order (layout state)
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  addSection: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;
  
  // UI state
  activeSection: string | null;
  setActiveSection: (sectionId: string | null) => void;
  
  // Photo state
  showPhoto: boolean;
  setShowPhoto: (show: boolean) => void;
  
  // Preview mode
  isPreviewMode: boolean;
  setPreviewMode: (preview: boolean) => void;
  
  // Zoom
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useResumeCanvasStore = create<ResumeCanvasStore>((set, get) => ({
  // Default section order
  sectionOrder: ['summary', 'experience', 'skills', 'education'],
  
  setSectionOrder: (order) => set({ sectionOrder: order }),
  
  moveSection: (fromIndex, toIndex) => {
    const { sectionOrder } = get();
    const newOrder = [...sectionOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    
    // ATS guardrail: Experience must be before Education
    const expIdx = newOrder.indexOf('experience');
    const eduIdx = newOrder.indexOf('education');
    if (expIdx !== -1 && eduIdx !== -1 && expIdx > eduIdx) {
      return; // Block invalid moves
    }
    
    set({ sectionOrder: newOrder });
  },
  
  addSection: (sectionId) => {
    const { sectionOrder } = get();
    if (!sectionOrder.includes(sectionId)) {
      set({ sectionOrder: [...sectionOrder, sectionId] });
    }
  },
  
  removeSection: (sectionId) => {
    const { sectionOrder } = get();
    // Core sections cannot be removed
    const coreSections = ['summary', 'experience', 'skills', 'education'];
    if (coreSections.includes(sectionId)) return;
    
    set({ sectionOrder: sectionOrder.filter(id => id !== sectionId) });
  },
  
  // UI State
  activeSection: null,
  setActiveSection: (sectionId) => set({ activeSection: sectionId }),
  
  // Photo
  showPhoto: true,
  setShowPhoto: (show) => set({ showPhoto: show }),
  
  // Preview
  isPreviewMode: false,
  setPreviewMode: (preview) => set({ isPreviewMode: preview }),
  
  // Zoom
  zoom: 0.75,
  setZoom: (zoom) => set({ zoom: Math.max(0.3, Math.min(1.5, zoom)) }),
}));
