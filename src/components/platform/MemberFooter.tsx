import React from "react";
import { Link } from "react-router-dom";

interface MemberFooterProps {
  platformName: string;
  platformLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
}

const MemberFooter: React.FC<MemberFooterProps> = ({
  platformName,
  platformLogo,
  primaryColor,
  secondaryColor,
  socialLinks = {},
}) => {
  const currentYear = new Date().getFullYear();

  // Custom styles based on platform branding
  const footerStyle = {
    backgroundColor: primaryColor || "var(--background)",
    color: primaryColor ? "white" : "var(--foreground)",
  };

  const linkStyle = {
    color: primaryColor ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)",
  };

  return (
    <footer
      className="py-8 px-6 md:px-10 lg:px-16 border-t border-border"
      style={footerStyle}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {platformLogo ? (
                <img
                  src={platformLogo}
                  alt={platformName}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {platformName.charAt(0)}
                  </span>
                </div>
              )}
              <span
                className="text-lg font-bold"
                style={{ color: footerStyle.color }}
              >
                {platformName}
              </span>
            </div>
            <p className="text-sm" style={linkStyle}>
              Join our community to access exclusive content, connect with
              like-minded individuals, and grow together.
            </p>
          </div>

          <div>
            <h3
              className="font-medium mb-4"
              style={{ color: footerStyle.color }}
            >
              Content
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/content/latest"
                  className="hover:opacity-100 transition-opacity"
                  style={linkStyle}
                >
                  Latest Content
                </Link>
              </li>
              <li>
                <Link
                  to="/content/popular"
                  className="hover:opacity-100 transition-opacity"
                  style={linkStyle}
                >
                  Popular Content
                </Link>
              </li>
              <li>
                <Link
                  to="/content/categories"
                  className="hover:opacity-100 transition-opacity"
                  style={linkStyle}
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="font-medium mb-4"
              style={{ color: footerStyle.color }}
            >
              Membership
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/pricing"
                  className="hover:opacity-100 transition-opacity"
                  style={linkStyle}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/benefits"
                  className="hover:opacity-100 transition-opacity"
                  style={linkStyle}
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:opacity-100 transition-opacity"
                  style={linkStyle}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="font-medium mb-4"
              style={{ color: footerStyle.color }}
            >
              Connect
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:opacity-100 transition-opacity"
                  style={linkStyle}
                >
                  Contact
                </Link>
              </li>
              {socialLinks.twitter && (
                <li>
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                    style={linkStyle}
                  >
                    Twitter
                  </a>
                </li>
              )}
              {socialLinks.instagram && (
                <li>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                    style={linkStyle}
                  >
                    Instagram
                  </a>
                </li>
              )}
              {socialLinks.youtube && (
                <li>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                    style={linkStyle}
                  >
                    YouTube
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div
          className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row md:items-center md:justify-between text-sm"
          style={linkStyle}
        >
          <div>
            © {currentYear} {platformName}. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/terms"
              className="hover:opacity-100 transition-opacity"
              style={linkStyle}
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="hover:opacity-100 transition-opacity"
              style={linkStyle}
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MemberFooter;
