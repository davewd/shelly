import React, { useState } from "react";

interface ParsedCommand {
  id: string;
  originalCommand: string;
  components: {
    action?: string;
    target?: string;
    parameters?: string[];
    flags?: string[];
  };
  regex: string;
  confidence: number;
}

interface ParserSectionProps {
  parsedCommands: ParsedCommand[];
  isVisible: boolean;
}

export const ParserSection: React.FC<ParserSectionProps> = ({
  parsedCommands,
  isVisible,
}) => {
  // State to manage which regex sections are expanded (collapsed by default)
  const [expandedRegex, setExpandedRegex] = useState<Set<string>>(new Set());

  const toggleRegexExpansion = (commandId: string) => {
    setExpandedRegex((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commandId)) {
        newSet.delete(commandId);
      } else {
        newSet.add(commandId);
      }
      return newSet;
    });
  };

  if (!isVisible) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50 border-green-200";
    if (confidence >= 0.6)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
  };

  // Helper function to get command type label
  const getCommandType = (action: string, target?: string): string => {
    if (target) {
      switch (target) {
        case "git":
          return "Version Control";
        case "docker":
          return "Container";
        case "npm":
        case "yarn":
          return "Package Manager";
        case "python":
        case "node":
          return "Runtime";
        default:
          return "Command";
      }
    }

    // Action-based type detection
    if (action.includes("cd")) return "Navigation";
    if (["ls", "dir", "cat", "head", "tail"].includes(action))
      return "File Operation";
    if (["mkdir", "rm", "cp", "mv"].includes(action)) return "File Management";
    if (["chmod", "chown"].includes(action)) return "Permissions";

    return "System Command";
  };

  // Helper function to get flag descriptions
  const getFlagDescription = (flag: string): string => {
    const flagDescriptions: Record<string, string> = {
      "-v": "verbose output",
      "--verbose": "verbose output",
      "-f": "force operation",
      "--force": "force operation",
      "-r": "recursive",
      "--recursive": "recursive",
      "-a": "all files/show all",
      "--all": "all files/show all",
      "-l": "long format/list",
      "--long": "long format",
      "-h": "human readable",
      "--help": "show help",
      "-d": "directory mode",
      "--directory": "directory mode",
      "-n": "dry run/number",
      "--dry-run": "dry run",
      "-i": "interactive mode",
      "--interactive": "interactive mode",
      "-p": "preserve/port",
      "--preserve": "preserve attributes",
      "-t": "timestamp/tag",
      "--tag": "tag version",
      "-b": "branch/background",
      "--branch": "specify branch",
      "-m": "message/move",
      "--message": "commit message",
      "-u": "upstream/user",
      "--upstream": "set upstream",
      "-o": "output file",
      "--output": "output file",
      "-c": "command/count",
      "--command": "execute command",
      "-s": "silent/size",
      "--silent": "silent mode",
      "-w": "width/watch",
      "--width": "set width",
      "-x": "executable/extract",
      "--extract": "extract files",
      "-z": "compress",
      "--compress": "enable compression",
      "-dev": "development dependencies",
      "--save-dev": "save as dev dependency",
      "--global": "global installation",
      "-g": "global installation",
      "--production": "production mode",
      "--no-cache": "skip cache",
      "--quiet": "minimal output",
      "-q": "quiet mode",
    };

    return flagDescriptions[flag] || "custom flag";
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Lexical Analysis
        </h2>
        <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>🧠</span>
          <span>{parsedCommands.length} commands analyzed</span>
        </div>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {parsedCommands.map((cmd) => (
          <div
            key={cmd.id}
            className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-700/50 p-6"
          >
            {/* Header with command structure title */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  Command Structure
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getConfidenceColor(
                    cmd.confidence
                  )}`}
                >
                  {getConfidenceLabel(cmd.confidence)} (
                  {Math.round(cmd.confidence * 100)}%)
                </span>
              </div>
              <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium inline-block">
                Full Command
              </div>
            </div>

            {/* Command breakdown in structured layout */}
            <div className="flex items-start gap-6">
              {/* Main command/action */}
              {cmd.components.action && (
                <div className="flex-none">
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2">
                    1
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 min-w-[120px]">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                      {cmd.components.target
                        ? cmd.components.target
                        : cmd.components.action}{" "}
                      (
                      {getCommandType(
                        cmd.components.action,
                        cmd.components.target
                      )}
                      )
                    </div>
                    <div className="text-sm font-mono text-neutral-800 dark:text-neutral-200">
                      {cmd.components.action}
                    </div>
                    {cmd.components.target && (
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        via {cmd.components.target}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Connector */}
              <div className="flex items-center pt-4">
                <span className="text-2xl text-neutral-400">&</span>
              </div>

              {/* Parameters and flags */}
              <div className="flex-1">
                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2">
                  2
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">
                    Parameters & Flags
                  </div>
                  <div className="space-y-2">
                    {/* Parameters */}
                    {cmd.components.parameters &&
                      cmd.components.parameters.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {cmd.components.parameters.map(
                            (param, paramIndex) => (
                              <span
                                key={paramIndex}
                                className="bg-white dark:bg-neutral-700 px-2 py-1 rounded text-sm font-mono text-neutral-800 dark:text-neutral-200 border"
                              >
                                {param}
                              </span>
                            )
                          )}
                        </div>
                      )}

                    {/* Flags */}
                    {cmd.components.flags &&
                      cmd.components.flags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {cmd.components.flags.map((flag, flagIndex) => (
                            <div
                              key={flagIndex}
                              className="flex items-center space-x-2"
                            >
                              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-mono">
                                {flag}
                              </span>
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                {getFlagDescription(flag)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                    {(!cmd.components.parameters ||
                      cmd.components.parameters.length === 0) &&
                      (!cmd.components.flags ||
                        cmd.components.flags.length === 0) && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                          No parameters or flags
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated regex accordion at bottom */}
            <div className="mt-4 pt-4 border-t border-yellow-300 dark:border-yellow-700">
              {/* Accordion Header */}
              <button
                onClick={() => toggleRegexExpansion(cmd.id)}
                className="w-full flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Generated Regular Expression
                  </span>
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                    {new RegExp(cmd.regex).test(cmd.originalCommand)
                      ? "✅ Valid"
                      : "❌ Invalid"}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {expandedRegex.has(cmd.id) ? "Hide" : "Show"} Regex
                  </span>
                  <svg
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                      expandedRegex.has(cmd.id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Accordion Content */}
              {expandedRegex.has(cmd.id) && (
                <div className="mt-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border-l-4 border-purple-400">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                        Regular Expression Pattern:
                      </div>
                      <code className="text-sm font-mono text-neutral-800 dark:text-neutral-200 break-all bg-white dark:bg-neutral-800 px-2 py-1 rounded border">
                        {cmd.regex}
                      </code>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <span
                          className={`font-medium ${
                            new RegExp(cmd.regex).test(cmd.originalCommand)
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {new RegExp(cmd.regex).test(cmd.originalCommand)
                            ? "✅ Pattern matches original command"
                            : "❌ Pattern validation failed"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(cmd.regex);
                        }}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium hover:underline"
                      >
                        📋 Copy Regex
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {parsedCommands.length === 0 && (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <div className="text-4xl mb-2">🤖</div>
          <p>No commands to analyze yet.</p>
          <p className="text-sm">
            Enter some commands above and click "Analyze Commands".
          </p>
        </div>
      )}
    </div>
  );
};
