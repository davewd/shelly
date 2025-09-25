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

interface OutputFormat {
  name: string;
  icon: React.ReactNode;
  description: string;
  formatter: (commands: ParsedCommand[]) => string;
}

interface OutputSectionProps {
  parsedCommands: ParsedCommand[];
  isVisible: boolean;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  parsedCommands,
  isVisible,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isVisible) return null;

  const outputFormats: OutputFormat[] = [
    {
      name: "VSCode",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
        </svg>
      ),
      description: "Visual Studio Code format",
      formatter: (commands) => {
        const regexArray = commands
          .map((cmd) => `"${cmd.regex}"`)
          .join(",\n    ");
        return `// VSCode settings.json format
{
  "search.useRegexp": true,
  "search.regexPatterns": [
    ${regexArray}
  ]
}`;
      },
    },
    {
      name: "Cursor",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      description: "Cursor AI format",
      formatter: (commands) => {
        const patterns = commands
          .map(
            (cmd) =>
              `  - pattern: "${cmd.regex}"\n    description: "${cmd.originalCommand}"`
          )
          .join("\n");
        return `# Cursor AI patterns configuration
patterns:
${patterns}`;
      },
    },
    {
      name: "Codex",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657 1.414 1.414L2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" />
        </svg>
      ),
      description: "GitHub Codex format",
      formatter: (commands) => {
        return `// GitHub Codex regex patterns
const patterns = [
${commands
  .map((cmd) => `  /${cmd.regex}/g, // ${cmd.originalCommand}`)
  .join("\n")}
];`;
      },
    },
    {
      name: "JSON",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3h2v2H5v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2M12 15a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m-4-3a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1Z" />
        </svg>
      ),
      description: "Structured JSON format",
      formatter: (commands) => {
        const jsonData = {
          generated: new Date().toISOString(),
          totalCommands: commands.length,
          patterns: commands.map((cmd) => ({
            original: cmd.originalCommand,
            regex: cmd.regex,
            confidence: cmd.confidence,
            components: cmd.components,
          })),
        };
        return JSON.stringify(jsonData, null, 2);
      },
    },
    {
      name: "Plain Text",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
        </svg>
      ),
      description: "Simple text format",
      formatter: (commands) => {
        return commands.map((cmd) => cmd.regex).join("\n");
      },
    },
  ];

  const copyToClipboard = async (format: OutputFormat) => {
    try {
      const content = format.formatter(parsedCommands);
      await navigator.clipboard.writeText(content);
      setCopiedFormat(format.name);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const getHighConfidenceCount = () => {
    return parsedCommands.filter((cmd) => cmd.confidence >= 0.8).length;
  };

  const getAverageConfidence = () => {
    if (parsedCommands.length === 0) return 0;
    const sum = parsedCommands.reduce((acc, cmd) => acc + cmd.confidence, 0);
    return sum / parsedCommands.length;
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          📤 Step 4: Export Formats
        </h2>
        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span>📊</span>
          <span>{parsedCommands.length} patterns</span>
          <span>•</span>
          <span>{getHighConfidenceCount()} high confidence</span>
          <span>•</span>
          <span>{Math.round(getAverageConfidence() * 100)}% avg</span>
        </div>
      </div>

      {parsedCommands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {outputFormats.map((format) => (
            <div
              key={format.name}
              className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-primary-600 dark:text-primary-400">
                  {format.icon}
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {format.name}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {format.description}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <pre className="text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded font-mono overflow-hidden text-ellipsis whitespace-nowrap text-neutral-700 dark:text-neutral-300">
                  {format.formatter(parsedCommands).split("\n")[0]}...
                </pre>
              </div>

              <button
                onClick={() => copyToClipboard(format)}
                className={`w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  copiedFormat === format.name
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-primary-600 hover:bg-primary-700 text-white"
                }`}
              >
                {copiedFormat === format.name ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy {format.name}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-2">No patterns to export</h3>
          <p className="text-sm">
            Analyze some commands first to see export options here.
          </p>
        </div>
      )}
    </div>
  );
};
