import { ArrowUpRightIcon, GlobeIcon, HomeIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function TopBar({ appName, children, repoId, consoleUrl, codeServerUrl }: { appName: string; children?: React.ReactNode; repoId: string; consoleUrl: string; codeServerUrl: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="sticky top-0 flex h-12 items-center justify-between border-b border-gray-200 bg-background px-4">
      <Link href={"/"}>
        <HomeIcon className="h-5 w-5" />
      </Link>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant={"ghost"}>
            <Image src="/logos/vscode.svg" width={16} height={16} alt="VS Code Logo" />
            <TerminalIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Open In</DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex flex-col gap-2 pb-4">
              <div className="mt-4 flex items-center gap-2 font-bold">
                <GlobeIcon className="ml-1 inline h-4 w-4" />
                Browser
              </div>
              <div>
                <a href={codeServerUrl} target="_blank" className="w-full">
                  <Button variant="outline" className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/logos/vscode.svg" width={16} height={16} alt="VS Code Logo" />
                      <span>VS Code</span>
                    </div>
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </Button>
                </a>
              </div>
              <div>
                <a href={consoleUrl} target="_blank" className="w-full">
                  <Button variant="outline" className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="h-4 w-4" />
                      <span>Console</span>
                    </div>
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


