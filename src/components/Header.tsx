import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 text-primary"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <span className="font-semibold text-foreground tracking-tight">CareersCraft</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            How it Works
          </a>
          <a href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
            Templates
          </a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button variant="hero" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
