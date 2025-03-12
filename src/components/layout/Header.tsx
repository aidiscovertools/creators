import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu, User } from "lucide-react";

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: "creator" | "subscriber";
  userName?: string;
  userAvatar?: string;
}

const Header = ({
  isLoggedIn = false,
  userType = "subscriber",
  userName = "Guest User",
  userAvatar = "",
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-6 md:px-10 lg:px-16 fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold hidden md:block">
            CreatorPlatform
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Link
          to="/features"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Features
        </Link>
        <Link
          to="/pricing"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Pricing
        </Link>
        <Link
          to="/showcase"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Showcase
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    {userAvatar ? (
                      <AvatarImage src={userAvatar} alt={userName} />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/logout" className="cursor-pointer w-full">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/features" className="cursor-pointer w-full">
                  Features
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/pricing" className="cursor-pointer w-full">
                  Pricing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/showcase" className="cursor-pointer w-full">
                  Showcase
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
