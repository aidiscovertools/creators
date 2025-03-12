import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";

interface MemberHeaderProps {
  platformName: string;
  platformLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const MemberHeader: React.FC<MemberHeaderProps> = ({
  platformName,
  platformLogo,
  primaryColor,
  secondaryColor,
}) => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams<{ platformId: string }>();
  const platformId = params.platformId;

  // Custom styles based on platform branding
  const headerStyle = {
    backgroundColor: primaryColor || "var(--background)",
    color: primaryColor ? "white" : "var(--foreground)",
  };

  const buttonStyle = {
    backgroundColor: secondaryColor || "var(--primary)",
    color: secondaryColor ? "white" : "var(--primary-foreground)",
  };

  return (
    <header
      className="w-full h-20 border-b border-border flex items-center justify-between px-6 md:px-10 lg:px-16 fixed top-0 z-50"
      style={headerStyle}
    >
      <div className="flex items-center gap-2">
        <Link
          to={platformId ? `/platform/${platformId}/view` : "/"}
          className="flex items-center gap-2"
        >
          {platformLogo ? (
            <img
              src={platformLogo}
              alt={platformName}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {platformName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-xl font-bold hidden md:block">
            {platformName}
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Link
          to={platformId ? `/platform/${platformId}/view/content` : "/"}
          className="text-sm font-medium hover:opacity-80 transition-colors"
          style={{ color: headerStyle.color }}
        >
          Content
        </Link>
        <Link
          to={platformId ? `/platform/${platformId}/view/community` : "/"}
          className="text-sm font-medium hover:opacity-80 transition-colors"
          style={{ color: headerStyle.color }}
        >
          Community
        </Link>
        <Link
          to={platformId ? `/platform/${platformId}/view/pricing` : "/"}
          className="text-sm font-medium hover:opacity-80 transition-colors"
          style={{ color: headerStyle.color }}
        >
          Pricing
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  {profile?.avatar_url ? (
                    <AvatarImage
                      src={profile.avatar_url}
                      alt={profile.name || "User"}
                    />
                  ) : (
                    <AvatarFallback
                      style={{
                        backgroundColor: secondaryColor || "var(--primary)",
                      }}
                    >
                      {(profile?.name || user.email || "U")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to={platformId ? `/platform/${platformId}/view/account` : "/"}
                  className="cursor-pointer w-full"
                >
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={
                    platformId
                      ? `/platform/${platformId}/view/subscriptions`
                      : "/"
                  }
                  className="cursor-pointer w-full"
                >
                  My Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button
                  onClick={() => signOut()}
                  className="cursor-pointer w-full text-left px-2 py-1.5 text-sm"
                >
                  Sign Out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              style={{ color: headerStyle.color }}
            >
              <Link
                to={platformId ? `/platform/${platformId}/view/login` : "/"}
              >
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild style={buttonStyle}>
              <Link
                to={platformId ? `/platform/${platformId}/view/signup` : "/"}
              >
                Join Now
              </Link>
            </Button>
          </>
        )}

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" style={{ color: headerStyle.color }} />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border p-4 z-50">
          <div className="flex flex-col space-y-3">
            <Link
              to={platformId ? `/platform/${platformId}/view/content` : "/"}
              className="text-sm font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Content
            </Link>
            <Link
              to={platformId ? `/platform/${platformId}/view/community` : "/"}
              className="text-sm font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link
              to={platformId ? `/platform/${platformId}/view/pricing` : "/"}
              className="text-sm font-medium p-2 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  to={platformId ? `/platform/${platformId}/view/account` : "/"}
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  to={
                    platformId
                      ? `/platform/${platformId}/view/subscriptions`
                      : "/"
                  }
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Subscription
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md text-left w-full"
                >
                  Sign Out
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

export default MemberHeader;
