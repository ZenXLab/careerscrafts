import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-3.5 h-3.5 text-primary"
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
            <span className="font-medium text-foreground text-sm">CareersCraft</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors duration-300">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors duration-300">Support</a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 CareersCraft
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
