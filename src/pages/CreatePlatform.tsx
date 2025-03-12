import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import PlatformForm from "../components/platform/PlatformForm";

export default function CreatePlatform() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Platform
            </h1>
            <p className="text-muted-foreground mt-1">
              Set up your white-label community platform
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Platform Setup</CardTitle>
              <CardDescription>
                Configure your platform details, domain, and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlatformForm />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
