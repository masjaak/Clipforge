import { Link } from "react-router";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-center p-8">
      <div>
        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Zap className="size-7 text-primary" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight mb-3">404</h1>
        <p className="text-muted-foreground mb-8">This page doesn't exist or was moved.</p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
            <ArrowLeft className="size-4" /> Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
