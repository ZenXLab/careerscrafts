import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import careersCraftLogo from "@/assets/careerscraft-logo.png";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={careersCraftLogo} 
            alt="CareersCraft Logo" 
            className="w-8 h-8 rounded-md object-contain"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground tracking-tight leading-tight">CareersCraft</span>
            <span className="text-[9px] text-muted-foreground -mt-0.5">by Cropxon</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#features" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            How it Works
          </a>
          <a 
            href="#templates" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Industry Templates
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="/editor">
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
