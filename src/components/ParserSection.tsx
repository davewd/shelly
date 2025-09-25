import React from 'react';

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
  isVisible
}) => {
  if (!isVisible) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
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

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {parsedCommands.map((cmd, index) => (
          <div
            key={cmd.id}
            className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Command #{index + 1}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getConfidenceColor(cmd.confidence)}`}>
                    {getConfidenceLabel(cmd.confidence)} ({Math.round(cmd.confidence * 100)}%)
                  </span>
                </div>
                <code className="text-sm font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-800 dark:text-neutral-200">
                  {cmd.originalCommand}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              {/* Components */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Components
                </h4>
                <div className="space-y-1">
                  {cmd.components.action && (
                    <div className="text-xs">
                      <span className="font-medium text-primary-600">Action:</span> {cmd.components.action}
                    </div>
                  )}
                  {cmd.components.target && (
                    <div className="text-xs">
                      <span className="font-medium text-secondary-600">Target:</span> {cmd.components.target}
                    </div>
                  )}
                  {cmd.components.parameters && cmd.components.parameters.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-green-600">Params:</span> {cmd.components.parameters.join(', ')}
                    </div>
                  )}
                  {cmd.components.flags && cmd.components.flags.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-orange-600">Flags:</span> {cmd.components.flags.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Regex Preview */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Generated Regex
                </h4>
                <code className="text-xs font-mono bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded block break-all text-neutral-800 dark:text-neutral-200">
                  {cmd.regex}
                </code>
              </div>
            </div>

            {/* Test the regex */}
            <div className="text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-600 pt-2">
              <span className="font-medium">Test:</span> {new RegExp(cmd.regex).test(cmd.originalCommand) ? '✅ Matches' : '❌ No match'}
            </div>
          </div>
        ))}
      </div>

      {parsedCommands.length === 0 && (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <div className="text-4xl mb-2">🤖</div>
          <p>No commands to analyze yet.</p>
          <p className="text-sm">Enter some commands above and click "Analyze Commands".</p>
        </div>
      )}
    </div>
  );
};