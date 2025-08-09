"use client";

import { Button } from "@/components/ui/button";
import { Share2Icon, LinkIcon, CopyIcon, ExternalLinkIcon, RocketIcon, Loader2Icon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { publishApp } from "@/actions/publish-app";
import { useState } from "react";

interface ShareButtonProps {
  className?: string;
  domain?: string;
  appId: string;
}

export function ShareButton({ className, domain, appId }: ShareButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({ description: "Link copied to clipboard!" });
      })
      .catch(() => {
        toast({ description: "Failed to copy link" });
      });
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await publishApp({ appId });
      toast({ description: "Latest version published successfully!" });
    } catch (error) {
      toast({ description: "Failed to publish app" });
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex items-center gap-1 ${className || ""}`}>
          Share
          <Share2Icon className="ml-1 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[450px] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share App</DialogTitle>
          <DialogDescription>{domain ? "Share your app using the preview domain or publish the latest version." : "Publish your app to create a shareable preview URL."}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col space-y-6">
          {domain ? (
            <>
              <div>
                <Label htmlFor="share-url" className="mb-2 block">
                  Preview Domain
                </Label>
                <div className="grid w-full grid-cols-[1fr_auto] overflow-hidden rounded-md border border-input">
                  <div className="flex items-center overflow-hidden bg-muted px-3 py-2">
                    <LinkIcon className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="truncate">
                      <span className="text-sm">https://{domain}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="h-10 rounded-l-none border-l border-input px-3" onClick={() => copyToClipboard(`https://${domain}`)}>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex w-full flex-col space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => window.open(`https://${domain}`, "_blank")}>
                  <ExternalLinkIcon className="h-4 w-4" />
                  Visit Preview
                </Button>

                <Button variant="default" size="sm" className="w-full gap-2" onClick={handlePublish} disabled={isPublishing}>
                  {isPublishing ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <RocketIcon className="h-4 w-4" />}
                  Publish Latest
                </Button>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-4 text-muted-foreground">No preview domain available yet. Publish your app to create a preview URL.</p>
              <Button variant="default" size="default" className="w-full gap-2" onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <RocketIcon className="h-4 w-4" />}
                Publish
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


