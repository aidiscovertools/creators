import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Edit,
  ExternalLink,
  Globe,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { platformApi } from "@/lib/api";

interface PlatformCardProps {
  platform: {
    id: string;
    name: string;
    description?: string;
    subdomain?: string;
    custom_domain?: string;
    status?: string;
    created_at?: string;
  };
  onDelete?: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await platformApi.deletePlatform(platform.id);
      toast({
        title: "Platform deleted",
        description: "Your platform has been deleted successfully.",
      });
      if (onDelete) onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete platform. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDomain = () => {
    if (platform.custom_domain) return platform.custom_domain;
    if (platform.subdomain) return `${platform.subdomain}.creatorplatform.com`;
    return null;
  };

  const domain = getDomain();
  const isActive = platform.status === "active";

  return (
    <Card className={platform.status === "draft" ? "border-dashed" : ""}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{platform.name}</CardTitle>
          {isActive ? (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              Draft
            </span>
          )}
        </div>
        <CardDescription>
          {domain ? (
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline"
            >
              <Globe className="h-3 w-3 mr-1" />
              {domain}
            </a>
          ) : (
            <span className="text-muted-foreground">No domain configured</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {platform.description || "No description provided."}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Created: {new Date(platform.created_at || "").toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        {isActive ? (
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Visit
            </a>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/platform/${platform.id}/settings`)}
          >
            <Globe className="h-4 w-4 mr-1" /> Configure
          </Button>
        )}
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/platform/${platform.id}/analytics`)}
          >
            <BarChart className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/platform/${platform.id}`)}
              >
                <Globe className="h-4 w-4 mr-2" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/platform/${platform.id}/settings`)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PlatformCard;
