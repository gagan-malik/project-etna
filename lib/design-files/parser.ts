/**
 * Design File Parser for Verilog, VHDL, and SystemVerilog
 * Extracts module/entity hierarchy, signals, ports, and other metadata
 */

export interface PortDefinition {
  name: string;
  direction: "input" | "output" | "inout";
  type: string;
  width?: number;
}

export interface SignalDefinition {
  name: string;
  type: string; // wire, reg, logic, etc.
  width?: number;
}

export interface ModuleDefinition {
  name: string;
  ports: PortDefinition[];
  signals: SignalDefinition[];
  parameters: Record<string, string>;
  instances: ModuleInstance[];
  lineStart: number;
  lineEnd: number;
}

export interface ModuleInstance {
  moduleName: string;
  instanceName: string;
  line: number;
}

export interface ParsedDesignFile {
  format: "verilog" | "vhdl" | "systemverilog";
  modules: ModuleDefinition[];
  topModule?: string;
  fileType: "rtl" | "testbench" | "constraint" | "netlist";
  errors: string[];
  warnings: string[];
}

/**
 * Detect the design file format based on content and extension
 */
export function detectFormat(
  content: string,
  filename: string
): "verilog" | "vhdl" | "systemverilog" {
  const ext = filename.toLowerCase().split(".").pop();

  // Check extension first
  if (ext === "vhd" || ext === "vhdl") {
    return "vhdl";
  }
  if (ext === "sv" || ext === "svh") {
    return "systemverilog";
  }
  if (ext === "v" || ext === "vh") {
    // Could be Verilog or SystemVerilog, check content
    if (hasSystemVerilogFeatures(content)) {
      return "systemverilog";
    }
    return "verilog";
  }

  // Fall back to content analysis
  if (content.includes("entity ") && content.includes("architecture ")) {
    return "vhdl";
  }
  if (hasSystemVerilogFeatures(content)) {
    return "systemverilog";
  }
  return "verilog";
}

function hasSystemVerilogFeatures(content: string): boolean {
  const svKeywords = [
    /\binterface\b/,
    /\blogic\b/,
    /\bbit\b/,
    /\bbyte\b/,
    /\bshortint\b/,
    /\bint\b/,
    /\blongint\b/,
    /\bclass\b/,
    /\bprogram\b/,
    /\bproperty\b/,
    /\bsequence\b/,
    /\bassert\b/,
    /\bassume\b/,
    /\bcover\b/,
    /\bunique\b\s+case/,
    /\bpriority\b\s+case/,
    /\balways_ff\b/,
    /\balways_comb\b/,
    /\balways_latch\b/,
  ];

  return svKeywords.some((re) => re.test(content));
}

/**
 * Detect if the file is a testbench
 */
export function detectFileType(
  content: string,
  filename: string
): "rtl" | "testbench" | "constraint" | "netlist" {
  const lowerFilename = filename.toLowerCase();
  const lowerContent = content.toLowerCase();

  // Check filename patterns
  if (
    lowerFilename.includes("_tb") ||
    lowerFilename.includes("_test") ||
    lowerFilename.includes("testbench")
  ) {
    return "testbench";
  }

  if (lowerFilename.includes(".sdc") || lowerFilename.includes(".xdc")) {
    return "constraint";
  }

  // Check content patterns for testbench
  const testbenchIndicators = [
    /initial\s+begin/,
    /\$display\s*\(/,
    /\$monitor\s*\(/,
    /\$finish\s*[;(]/,
    /\$stop\s*[;(]/,
    /\$dumpfile\s*\(/,
    /\$dumpvars\s*\(/,
    /#\d+\s*;/, // Delays like #10;
    /`timescale\b/,
  ];

  const testbenchCount = testbenchIndicators.filter((re) =>
    re.test(lowerContent)
  ).length;
  if (testbenchCount >= 2) {
    return "testbench";
  }

  return "rtl";
}

/**
 * Parse Verilog/SystemVerilog content
 */
export function parseVerilog(content: string): Omit<ParsedDesignFile, "format" | "fileType"> {
  const modules: ModuleDefinition[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const lines = content.split("\n");

  // Remove comments for easier parsing
  const cleanContent = removeComments(content, "verilog");

  // Find all module definitions
  const moduleRegex = /\bmodule\s+(\w+)\s*(?:#\s*\([^)]*\))?\s*\(([^)]*)\)\s*;/gs;
  let match;

  while ((match = moduleRegex.exec(cleanContent)) !== null) {
    const moduleName = match[1];
    const portsSection = match[2];
    const moduleStartIndex = match.index;

    // Find module end
    const moduleEndRegex = new RegExp(
      `\\bmodule\\s+${moduleName}[\\s\\S]*?\\bendmodule\\b`,
      "g"
    );
    const endMatch = moduleEndRegex.exec(cleanContent);
    const moduleContent = endMatch
      ? endMatch[0]
      : cleanContent.slice(moduleStartIndex);

    // Calculate line numbers
    const lineStart =
      content.slice(0, moduleStartIndex).split("\n").length;
    const lineEnd =
      lineStart + (moduleContent.match(/\n/g) || []).length;

    // Parse ports
    const ports = parseVerilogPorts(portsSection, moduleContent);

    // Parse signals
    const signals = parseVerilogSignals(moduleContent);

    // Parse parameters
    const parameters = parseVerilogParameters(moduleContent);

    // Parse module instances
    const instances = parseVerilogInstances(moduleContent, lineStart);

    modules.push({
      name: moduleName,
      ports,
      signals,
      parameters,
      instances,
      lineStart,
      lineEnd,
    });
  }

  // Determine top module (module that's not instantiated by others)
  const instantiatedModules = new Set(
    modules.flatMap((m) => m.instances.map((i) => i.moduleName))
  );
  const topModules = modules.filter((m) => !instantiatedModules.has(m.name));
  const topModule = topModules.length === 1 ? topModules[0].name : undefined;

  return { modules, topModule, errors, warnings };
}

/**
 * Parse VHDL content
 */
export function parseVHDL(content: string): Omit<ParsedDesignFile, "format" | "fileType"> {
  const modules: ModuleDefinition[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Remove comments
  const cleanContent = removeComments(content, "vhdl");

  // Find all entity definitions
  const entityRegex =
    /\bentity\s+(\w+)\s+is\s+([\s\S]*?)\bend\s+(?:entity\s+)?(\w+)?;/gi;
  let match;

  while ((match = entityRegex.exec(cleanContent)) !== null) {
    const entityName = match[1];
    const entityBody = match[2];
    const moduleStartIndex = match.index;

    // Calculate line numbers
    const lineStart =
      content.slice(0, moduleStartIndex).split("\n").length;

    // Find corresponding architecture
    const archRegex = new RegExp(
      `\\barchitecture\\s+\\w+\\s+of\\s+${entityName}\\s+is\\s+([\\s\\S]*?)\\bend\\s+(?:architecture\\s+)?`,
      "gi"
    );
    const archMatch = archRegex.exec(cleanContent);
    const archContent = archMatch ? archMatch[1] : "";

    const lineEnd =
      lineStart +
      (entityBody.match(/\n/g) || []).length +
      (archContent.match(/\n/g) || []).length;

    // Parse ports
    const ports = parseVHDLPorts(entityBody);

    // Parse signals from architecture
    const signals = parseVHDLSignals(archContent);

    // Parse generics as parameters
    const parameters = parseVHDLGenerics(entityBody);

    // Parse component instances
    const instances = parseVHDLInstances(archContent, lineStart);

    modules.push({
      name: entityName,
      ports,
      signals,
      parameters,
      instances,
      lineStart,
      lineEnd,
    });
  }

  // Determine top module
  const instantiatedModules = new Set(
    modules.flatMap((m) => m.instances.map((i) => i.moduleName))
  );
  const topModules = modules.filter((m) => !instantiatedModules.has(m.name));
  const topModule = topModules.length === 1 ? topModules[0].name : undefined;

  return { modules, topModule, errors, warnings };
}

function removeComments(content: string, format: "verilog" | "vhdl"): string {
  if (format === "vhdl") {
    // VHDL uses -- for comments
    return content.replace(/--.*$/gm, "");
  } else {
    // Verilog uses // and /* */
    return content
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
  }
}

function parseVerilogPorts(
  portsSection: string,
  moduleContent: string
): PortDefinition[] {
  const ports: PortDefinition[] = [];

  // ANSI-style port declarations in module header
  const ansiPortRegex =
    /\b(input|output|inout)\s+(?:(wire|reg|logic)\s+)?(?:\[(\d+):(\d+)\]\s+)?(\w+)/g;
  let match;

  while ((match = ansiPortRegex.exec(moduleContent)) !== null) {
    const direction = match[1] as "input" | "output" | "inout";
    const type = match[2] || "wire";
    const msb = match[3] ? parseInt(match[3]) : undefined;
    const lsb = match[4] ? parseInt(match[4]) : undefined;
    const name = match[5];

    ports.push({
      name,
      direction,
      type,
      width: msb !== undefined && lsb !== undefined ? msb - lsb + 1 : 1,
    });
  }

  return ports;
}

function parseVerilogSignals(moduleContent: string): SignalDefinition[] {
  const signals: SignalDefinition[] = [];

  const signalRegex =
    /\b(wire|reg|logic|integer)\s+(?:\[(\d+):(\d+)\]\s+)?(\w+(?:\s*,\s*\w+)*)\s*;/g;
  let match;

  while ((match = signalRegex.exec(moduleContent)) !== null) {
    const type = match[1];
    const msb = match[2] ? parseInt(match[2]) : undefined;
    const lsb = match[3] ? parseInt(match[3]) : undefined;
    const names = match[4].split(",").map((n) => n.trim());
    const width =
      msb !== undefined && lsb !== undefined ? msb - lsb + 1 : 1;

    for (const name of names) {
      if (name) {
        signals.push({ name, type, width });
      }
    }
  }

  return signals;
}

function parseVerilogParameters(
  moduleContent: string
): Record<string, string> {
  const parameters: Record<string, string> = {};

  const paramRegex = /\bparameter\s+(\w+)\s*=\s*([^;,\)]+)/g;
  let match;

  while ((match = paramRegex.exec(moduleContent)) !== null) {
    parameters[match[1]] = match[2].trim();
  }

  return parameters;
}

function parseVerilogInstances(
  moduleContent: string,
  baseLineNumber: number
): ModuleInstance[] {
  const instances: ModuleInstance[] = [];

  // Match module instantiations: ModuleName #(...) instance_name (...);
  // or ModuleName instance_name (...);
  const instanceRegex =
    /\b(\w+)\s+(?:#\s*\([^)]*\)\s+)?(\w+)\s*\([^)]*\)\s*;/g;
  const primitives = new Set([
    "wire",
    "reg",
    "input",
    "output",
    "inout",
    "assign",
    "always",
    "initial",
    "parameter",
    "localparam",
    "genvar",
    "generate",
    "if",
    "else",
    "case",
    "for",
    "while",
    "function",
    "task",
    "begin",
    "end",
  ]);

  let match;
  while ((match = instanceRegex.exec(moduleContent)) !== null) {
    const moduleName = match[1];
    const instanceName = match[2];

    // Skip primitives and keywords
    if (!primitives.has(moduleName.toLowerCase())) {
      const lineOffset = moduleContent
        .slice(0, match.index)
        .split("\n").length;
      instances.push({
        moduleName,
        instanceName,
        line: baseLineNumber + lineOffset,
      });
    }
  }

  return instances;
}

function parseVHDLPorts(entityBody: string): PortDefinition[] {
  const ports: PortDefinition[] = [];

  // Find port section
  const portMatch = /\bport\s*\(([\s\S]*?)\);/i.exec(entityBody);
  if (!portMatch) return ports;

  const portSection = portMatch[1];
  const portRegex = /(\w+(?:\s*,\s*\w+)*)\s*:\s*(in|out|inout)\s+(\w+)/gi;
  let match;

  while ((match = portRegex.exec(portSection)) !== null) {
    const names = match[1].split(",").map((n) => n.trim());
    const direction = match[2].toLowerCase() as "input" | "output" | "inout";
    const type = match[3];

    const directionMap: Record<string, "input" | "output" | "inout"> = {
      in: "input",
      out: "output",
      inout: "inout",
    };

    for (const name of names) {
      if (name) {
        ports.push({
          name,
          direction: directionMap[direction] || direction,
          type,
        });
      }
    }
  }

  return ports;
}

function parseVHDLSignals(archContent: string): SignalDefinition[] {
  const signals: SignalDefinition[] = [];

  const signalRegex = /\bsignal\s+(\w+(?:\s*,\s*\w+)*)\s*:\s*(\w+)/gi;
  let match;

  while ((match = signalRegex.exec(archContent)) !== null) {
    const names = match[1].split(",").map((n) => n.trim());
    const type = match[2];

    for (const name of names) {
      if (name) {
        signals.push({ name, type });
      }
    }
  }

  return signals;
}

function parseVHDLGenerics(entityBody: string): Record<string, string> {
  const generics: Record<string, string> = {};

  const genericMatch = /\bgeneric\s*\(([\s\S]*?)\);/i.exec(entityBody);
  if (!genericMatch) return generics;

  const genericSection = genericMatch[1];
  const genericRegex = /(\w+)\s*:\s*\w+\s*:=\s*([^;,]+)/gi;
  let match;

  while ((match = genericRegex.exec(genericSection)) !== null) {
    generics[match[1]] = match[2].trim();
  }

  return generics;
}

function parseVHDLInstances(
  archContent: string,
  baseLineNumber: number
): ModuleInstance[] {
  const instances: ModuleInstance[] = [];

  // Match component instantiations: label : component_name port map (...)
  const instanceRegex = /(\w+)\s*:\s*(\w+)\s+(?:generic\s+map\s*\([^)]*\)\s+)?port\s+map/gi;
  let match;

  while ((match = instanceRegex.exec(archContent)) !== null) {
    const instanceName = match[1];
    const moduleName = match[2];
    const lineOffset = archContent.slice(0, match.index).split("\n").length;

    instances.push({
      moduleName,
      instanceName,
      line: baseLineNumber + lineOffset,
    });
  }

  return instances;
}

/**
 * Main parsing function
 */
export function parseDesignFile(
  content: string,
  filename: string
): ParsedDesignFile {
  const format = detectFormat(content, filename);
  const fileType = detectFileType(content, filename);

  let parseResult: Omit<ParsedDesignFile, "format" | "fileType">;

  if (format === "vhdl") {
    parseResult = parseVHDL(content);
  } else {
    parseResult = parseVerilog(content);
  }

  return {
    format,
    fileType,
    ...parseResult,
  };
}
