"use client";

import { requestDevServer as requestDevServerInner } from "./webview-actions";
import "./loader.css";
import { FreestyleDevServer, FreestyleDevServerHandle } from "freestyle-sandboxes/react/dev-server";
import { useRef } from "react";
import { Button } from "./ui/button";
import { RefreshCwIcon } from "lucide-react";
import { ShareButton } from "./share-button";

export default function WebView(props: { repo: string; baseId: string; appId: string; domain?: string }) {
  function requestDevServer({ repoId }: { repoId: string }) {
    return requestDevServerInner({ repoId });
  }

  const devServerRef = useRef<FreestyleDevServerHandle>(null);

  return (
    <div className="mt-[2px] flex h-screen flex-col overflow-hidden border-l transition-opacity duration-700">
      <div className="sticky top-0 flex h-12 items-center justify-end gap-2 border-b border-gray-200 bg-background px-2">
        <Button variant={"ghost"} size={"icon"} onClick={() => devServerRef.current?.refresh()}>
          <RefreshCwIcon />
        </Button>
        <ShareButton domain={props.domain} appId={props.appId} />
      </div>
      <FreestyleDevServer
        ref={devServerRef}
        actions={{ requestDevServer }}
        repoId={props.repo}
        loadingComponent={({ iframeLoading, devCommandRunning }) =>
          !devCommandRunning && (
            <div className="flex h-full items-center justify-center">
              <div>
                <div className="text-center">{iframeLoading ? "JavaScript Loading" : "Starting VM"}</div>
                <div>
                  <div className="loader"></div>
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}


