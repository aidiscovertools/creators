import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformId: string;
  platformName: string;
  subdomain: string;
}

const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
  platformId,
  platformName,
  subdomain,
}) => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<
    "idle" | "deploying" | "success" | "error"
  >("idle");
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus("deploying");

    try {
      const { data: functionData, error: functionError } =
        await supabase.functions.invoke("deploy-platform", {
          body: { platformId },
        });

      if (functionError) throw functionError;
      if (!functionData.success)
        throw new Error(functionData.error || "Deployment failed");

      setDeploymentUrl(functionData.data.deploymentUrl);
      setDeploymentStatus("success");

      toast({
        title: "Deployment successful",
        description: `Your platform has been deployed and is now live.`,
      });
    } catch (error: any) {
      console.error("Deployment error:", error);
      setDeploymentStatus("error");
      setErrorMessage(
        error.message || "An unexpected error occurred during deployment.",
      );

      toast({
        title: "Deployment failed",
        description:
          error.message || "Failed to deploy your platform. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleClose = () => {
    if (!isDeploying) {
      setDeploymentStatus("idle");
      setErrorMessage("");
      setDeploymentUrl("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {deploymentStatus === "idle" && "Deploy Platform"}
            {deploymentStatus === "deploying" && "Deploying Platform..."}
            {deploymentStatus === "success" && "Deployment Successful"}
            {deploymentStatus === "error" && "Deployment Failed"}
          </DialogTitle>
          <DialogDescription>
            {deploymentStatus === "idle" && (
              <>Deploy your platform to make it accessible to your audience.</>
            )}
            {deploymentStatus === "deploying" && (
              <>Please wait while we deploy your platform...</>
            )}
            {deploymentStatus === "success" && (
              <>Your platform has been successfully deployed and is now live!</>
            )}
            {deploymentStatus === "error" && (
              <>There was an error deploying your platform. Please try again.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {deploymentStatus === "idle" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Ready to Deploy</h3>
                  <p className="text-sm text-muted-foreground">
                    {platformName} will be deployed to:
                  </p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">
                  https://{subdomain}.sharp-jennings4-ykw3j.dev-2.tempolabs.ai
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                This will make your platform publicly accessible. You can always
                update your content after deployment.
              </p>
            </div>
          )}

          {deploymentStatus === "deploying" && (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="font-medium text-lg mb-2">Deploying Platform</h3>
              <p className="text-sm text-muted-foreground text-center">
                This may take a few moments. Please don't close this window.
              </p>
            </div>
          )}

          {deploymentStatus === "success" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Deployment Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    Your platform is now live at:
                  </p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">{deploymentUrl}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                You can now share this URL with your audience or set up a custom
                domain in your platform settings.
              </p>
            </div>
          )}

          {deploymentStatus === "error" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium">Deployment Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    We encountered an error while deploying your platform.
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {deploymentStatus === "idle" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleDeploy} disabled={isDeploying}>
                Deploy Platform
              </Button>
            </>
          )}

          {deploymentStatus === "deploying" && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deploying...
            </Button>
          )}

          {deploymentStatus === "success" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => window.open(deploymentUrl, "_blank")}>
                Visit Platform
              </Button>
            </>
          )}

          {deploymentStatus === "error" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleDeploy}>Try Again</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentModal;
