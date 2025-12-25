import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LiveAnalysisSection from "@/components/LiveAnalysisSection";
import AudienceSection from "@/components/AudienceSection";
import TemplatesSection from "@/components/TemplatesSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CinematicResumePreview from "@/components/CinematicResumePreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CinematicResumePreview />
        <LiveAnalysisSection />
        <AudienceSection />
        <TemplatesSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
