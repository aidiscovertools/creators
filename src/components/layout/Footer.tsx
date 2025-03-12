import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Facebook, Mail } from "lucide-react";

interface FooterProps {
  companyName?: string;
  logoUrl?: string;
}

const Footer = ({
  companyName = "Creator Platform",
  logoUrl = "/vite.svg",
}: FooterProps) => {
  return (
    <footer className="bg-background border-t border-border w-full py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-4">
            <img src={logoUrl} alt="Logo" className="h-8 w-8 mr-2" />
            <span className="font-bold text-lg">{companyName}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            The ultimate white-label platform for content creators to build
            their own subscription-based communities.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Platform</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/features"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/blog"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/documentation"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                to="/guides"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Creator Guides
              </Link>
            </li>
            <li>
              <Link
                to="/api"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                API
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/careers"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <a
              href="mailto:support@creatorplatform.com"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center"
            >
              <Mail size={16} className="mr-2" />
              support@creatorplatform.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
