"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FileCode,
  Layers,
  Terminal,
  Zap,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortDefinition {
  name: string;
  direction: string; // "input" | "output" | "inout" - using string for API compatibility
  type: string;
  width?: number;
}

interface ModuleInfo {
  name: string;
  ports: PortDefinition[];
  signals: number;
  parameters: Record<string, string>;
  instances: string[];
  lineStart: number;
  lineEnd: number;
}

interface DesignFileMetadata {
  modules?: ModuleInfo[];
  topModule?: string;
  errors?: string[];
  warnings?: string[];
}

interface DesignFileViewerProps {
  name: string;
  content: string;
  format: "verilog" | "vhdl" | "systemverilog";
  type: "rtl" | "testbench" | "constraint" | "netlist";
  metadata?: DesignFileMetadata;
  onAskAboutCode?: (selectedCode: string, context: string) => void;
  className?: string;
}

// Basic syntax highlighting for Verilog/VHDL
function highlightSyntax(code: string, format: string): string {
  if (format === "vhdl") {
    return highlightVHDL(code);
  }
  return highlightVerilog(code);
}

function highlightVerilog(code: string): string {
  // Keywords
  const keywords = [
    "module", "endmodule", "input", "output", "inout", "wire", "reg", "logic",
    "always", "always_ff", "always_comb", "always_latch", "initial", "begin", "end",
    "if", "else", "case", "endcase", "for", "while", "repeat", "forever",
    "assign", "parameter", "localparam", "genvar", "generate", "endgenerate",
    "posedge", "negedge", "or", "and", "not", "xor", "nand", "nor",
    "task", "endtask", "function", "endfunction", "return",
    "integer", "real", "time", "bit", "byte", "shortint", "int", "longint",
    "default", "fork", "join", "disable", "wait", "event",
  ];

  // Escape HTML
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments (// and /* */)
  highlighted = highlighted.replace(
    /(\/\/.*$)/gm,
    '<span class="text-muted-foreground italic">$1</span>'
  );
  highlighted = highlighted.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span class="text-muted-foreground italic">$1</span>'
  );

  // Strings
  highlighted = highlighted.replace(
    /("(?:[^"\\]|\\.)*")/g,
    '<span class="text-green-600 dark:text-green-400">$1</span>'
  );

  // Numbers
  highlighted = highlighted.replace(
    /\b(\d+'[hbod]?[0-9a-fA-FxXzZ_]+|\d+)\b/g,
    '<span class="text-orange-600 dark:text-orange-400">$1</span>'
  );

  // Keywords
  const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  highlighted = highlighted.replace(
    keywordPattern,
    '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>'
  );

  // System tasks ($display, $finish, etc.)
  highlighted = highlighted.replace(
    /(\$\w+)/g,
    '<span class="text-blue-600 dark:text-blue-400">$1</span>'
  );

  // Compiler directives
  highlighted = highlighted.replace(
    /(`\w+)/g,
    '<span class="text-pink-600 dark:text-pink-400">$1</span>'
  );

  return highlighted;
}

function highlightVHDL(code: string): string {
  const keywords = [
    "library", "use", "entity", "is", "port", "in", "out", "inout", "end",
    "architecture", "of", "begin", "signal", "variable", "constant", "type",
    "process", "if", "then", "else", "elsif", "case", "when", "others",
    "for", "loop", "while", "next", "exit", "return", "function", "procedure",
    "component", "generic", "map", "generate", "with", "select", "after",
    "wait", "until", "rising_edge", "falling_edge", "event", "all",
    "std_logic", "std_logic_vector", "unsigned", "signed", "integer", "natural",
    "boolean", "true", "false", "downto", "to", "and", "or", "not", "xor", "nand", "nor",
  ];

  // Escape HTML
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments (--)
  highlighted = highlighted.replace(
    /(--.*$)/gm,
    '<span class="text-muted-foreground italic">$1</span>'
  );

  // Strings
  highlighted = highlighted.replace(
    /("(?:[^"\\]|\\.)*")/g,
    '<span class="text-green-600 dark:text-green-400">$1</span>'
  );

  // Character literals
  highlighted = highlighted.replace(
    /('.')/g,
    '<span class="text-green-600 dark:text-green-400">$1</span>'
  );

  // Numbers
  highlighted = highlighted.replace(
    /\b(\d+)\b/g,
    '<span class="text-orange-600 dark:text-orange-400">$1</span>'
  );

  // Keywords (case insensitive)
  const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  highlighted = highlighted.replace(
    keywordPattern,
    '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>'
  );

  return highlighted;
}

export function DesignFileViewer({
  name,
  content,
  format,
  type,
  metadata,
  onAskAboutCode,
  className,
}: DesignFileViewerProps) {
  const [selectedText, setSelectedText] = useState<string>("");
  const [copiedLine, setCopiedLine] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(metadata?.modules?.map((m) => m.name) || [])
  );

  const lines = useMemo(() => content.split("\n"), [content]);
  const highlightedLines = useMemo(
    () => lines.map((line) => highlightSyntax(line, format)),
    [lines, format]
  );

  const handleCopyLine = async (lineIndex: number) => {
    await navigator.clipboard.writeText(lines[lineIndex]);
    setCopiedLine(lineIndex);
    setTimeout(() => setCopiedLine(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(content);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
    }
  };

  const toggleModule = (moduleName: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleName)) {
      newExpanded.delete(moduleName);
    } else {
      newExpanded.add(moduleName);
    }
    setExpandedModules(newExpanded);
  };

  const scrollToLine = (lineNumber: number) => {
    const element = document.getElementById(`line-${lineNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bg-primary/20");
      setTimeout(() => element.classList.remove("bg-primary/20"), 2000);
    }
  };

  return (
    <div className={cn("flex gap-4", className)}>
      {/* Module hierarchy panel */}
      {metadata?.modules && metadata.modules.length > 0 && (
        <Card className="w-64 flex-shrink-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Module Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[400px]">
              {metadata.modules.map((module) => (
                <Collapsible
                  key={module.name}
                  open={expandedModules.has(module.name)}
                  onOpenChange={() => toggleModule(module.name)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 h-auto py-2 px-2"
                    >
                      {expandedModules.has(module.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{module.name}</span>
                      {metadata.topModule === module.name && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          TOP
                        </Badge>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 space-y-1">
                    <div
                      className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => scrollToLine(module.lineStart)}
                    >
                      Lines {module.lineStart}-{module.lineEnd}
                    </div>
                    {module.ports.length > 0 && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Ports: </span>
                        <span className="text-green-600 dark:text-green-400">
                          {module.ports.filter((p) => p.direction === "input").length} in
                        </span>
                        {" / "}
                        <span className="text-primary">
                          {module.ports.filter((p) => p.direction === "output").length} out
                        </span>
                      </div>
                    )}
                    {module.signals > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Signals: {module.signals}
                      </div>
                    )}
                    {module.instances.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Instances: {module.instances.join(", ")}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Code viewer */}
      <Card className="flex-1 min-w-0">
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <CardTitle className="text-sm font-mono">{name}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {format.toUpperCase()}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {selectedText && onAskAboutCode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAskAboutCode(selectedText, `In ${name}`)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Ask about selection
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div
              className="font-mono text-sm"
              onMouseUp={handleTextSelection}
            >
              <table className="w-full border-collapse">
                <tbody>
                  {highlightedLines.map((line, index) => (
                    <tr
                      key={index}
                      id={`line-${index + 1}`}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <td className="w-12 text-right px-2 py-0.5 text-muted-foreground select-none border-r sticky left-0 bg-background">
                        {index + 1}
                      </td>
                      <td className="px-4 py-0.5 whitespace-pre overflow-x-auto">
                        <span dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />
                      </td>
                      <td className="w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCopyLine(index)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>

        {/* Errors and warnings */}
        {(metadata?.errors?.length || metadata?.warnings?.length) && (
          <div className="border-t p-4 space-y-2">
            {metadata?.errors?.map((error, i) => (
              <div
                key={`error-${i}`}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <Terminal className="h-4 w-4" />
                {error}
              </div>
            ))}
            {metadata?.warnings?.map((warning, i) => (
              <div
                key={`warning-${i}`}
                className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400"
              >
                <Zap className="h-4 w-4" />
                {warning}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
