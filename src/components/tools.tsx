"use client";

import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { CodeBlock, CodeBlockCode } from "./ui/code-block";

export function ToolMessage({ toolInvocation }: { toolInvocation: UIMessage["parts"][number]; className?: string }) {
  if ((toolInvocation as any).type === "tool-list_directory") {
    return <ToolBlock name="listing directory" argsText={(toolInvocation as any).input?.path?.split("/").slice(2).join("/")} toolInvocation={toolInvocation} />;
  }

  if ((toolInvocation as any).type === "tool-read_file") {
    return <ToolBlock name="read file" argsText={(toolInvocation as any).input?.path?.split("/").slice(2).join("/")} toolInvocation={toolInvocation} />;
  }

  if ((toolInvocation as any).type === "tool-edit_file") {
    return <EditFileTool toolInvocation={toolInvocation as any} />;
  }

  if ((toolInvocation as any).type === "tool-write_file") {
    return <WriteFileTool toolInvocation={toolInvocation as any} />;
  }

  if ((toolInvocation as any).type === "tool-exec") {
    return <ToolBlock name="exec" toolInvocation={toolInvocation} argsText={(toolInvocation as any).input?.command} />;
  }

  if ((toolInvocation as any).type === "tool-create_directory") {
    return <ToolBlock name="create directory" toolInvocation={toolInvocation} argsText={(toolInvocation as any).input?.path?.split("/").slice(2).join("/")} />;
  }

  if ((toolInvocation as any).type === "tool-update_todo_list") {
    return (
      <ToolBlock name="update todo list" toolInvocation={toolInvocation}>
        <div className="grid gap-2">
          {(toolInvocation as any).input?.items?.map?.((item: { description: string; completed: boolean }, index: number) => (
            <div key={index} className="flex items-center gap-3 px-4 py-1">
              <div className="relative flex-shrink-0 pointer-events-none">
                <div className={cn("h-4 w-4 rounded border transition-all duration-200", item.completed ? "border-black bg-black" : "border-gray-300 hover:border-gray-400")}>{item.completed && <svg className="absolute left-0.5 top-0.5 h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}</div>
              </div>
              <span className={cn("flex-1", item.completed && "text-gray-500 line-through")}>{item.description}</span>
            </div>
          ))}
        </div>
      </ToolBlock>
    );
  }

  return <ToolBlock toolInvocation={toolInvocation} name={(toolInvocation as any).type.replaceAll("_", " ").replace("tool-", "")} />;
}

function EditFileTool({ toolInvocation }: { toolInvocation: UIMessage["parts"][number] & { type: "tool-edit_file" } }) {
  return (
    <ToolBlock name="edit file" argsText={(toolInvocation as any).input?.path?.split("/").slice(2).join("/")} toolInvocation={toolInvocation}>
      <div className="grid gap-2">
        {(toolInvocation as any).input?.edits?.map?.((edit: { newText: string; oldText: string }, index: number) =>
          (edit.oldText || edit.newText) && (
            <CodeBlock key={index} className="overflow-scroll py-2">
              <CodeBlockCode code={(edit.oldText?.split("\n").slice(0, 5).join("\n")) as string} language={"tsx"} className="bg-red-200 [&>pre]:py-0! col-start-1 col-end-1 row-start-1 row-end-1 overflow-visible" />
              {edit.oldText?.split("\n").length > 5 && <div className="px-4 font-mono text-xs text-red-700">+{edit.oldText?.split("\n").length - 5} more</div>}
              <CodeBlockCode code={(edit.newText?.trimEnd()?.split("\n").slice(0, 5).join("\n")) as string} language={"tsx"} className="bg-green-200 [&>pre]:py-0! col-start-1 col-end-1 row-start-1 row-end-1 overflow-visible" />
              {edit.newText?.split("\n").length > 5 && <div className="px-4 font-mono text-xs text-green-700">+{edit.newText?.split("\n").length - 5} more</div>}
            </CodeBlock>
          )
        )}
      </div>
    </ToolBlock>
  );
}

function WriteFileTool({ toolInvocation }: { toolInvocation: UIMessage["parts"][number] & { type: "tool-write_file" } }) {
  return (
    <ToolBlock name="write file" argsText={(toolInvocation as any).input?.path?.split("/").slice(2).join("/")} toolInvocation={toolInvocation}>
      {(toolInvocation as any).input?.content && (
        <CodeBlock className="sticky bottom-0 overflow-scroll">
          <CodeBlockCode code={(((toolInvocation as any).input?.content as string)?.split("\n").slice(0, 5).join("\n")) ?? ""} language={"tsx"} className="bg-green-200" />
          {((toolInvocation as any).input?.content as string)?.split("\n").length > 5 && <div className="px-4 pb-2 font-mono text-xs text-green-700">+{((toolInvocation as any).input?.content as string)?.split("\n").length - 5} more</div>}
        </CodeBlock>
      )}
    </ToolBlock>
  );
}

function ToolBlock(props: { toolInvocation?: UIMessage["parts"][number] & { type: "tool-" }; name: string; argsText?: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="flex py-1">
        <div className="flex items-center gap-2">
          <div className="grid translate-y-[1px]">
            {(props.toolInvocation as any)?.state !== "output-available" && <div className={cn("col-start-1 col-end-1 row-start-1 row-end-1 inline-block h-2 w-2 animate-ping rounded-full border border-black bg-black")}></div>}
            <div
              className={cn(
                "col-start-1 col-end-1 row-start-1 row-end-1 inline-block h-2 w-2 rounded-full border",
                (props.toolInvocation as any)?.state === "output-available" && (props.toolInvocation as any).result?.isError
                  ? "border-red-500 bg-red-500"
                  : (props.toolInvocation as any)?.state === "output-available"
                  ? "border-gray-400 bg-gray-400"
                  : "border-black bg-black"
              )}
            ></div>
          </div>
          <span className="font-medium">{props.name}</span>
          <span>{props.argsText}</span>
        </div>
      </div>
      {(props.children && <div className="mb-2">{props.children}</div>) ||
        ((props.toolInvocation as any)?.state === "output-available" &&
          (props.toolInvocation as any)?.output?.isError &&
          (props.toolInvocation as any)?.output?.content?.map((content: { type: "text"; text: string }, i: number) => (
            <CodeBlock key={i} className="py-2 overflow-scroll">
              <CodeBlockCode className="py-2 text-red-500 [&>pre]:py-0!" code={content.text} language="text" />
            </CodeBlock>
          )))}
    </div>
  );
}


