import React from "react";

interface InputSectionProps {
  commands: string;
  onChange: (commands: string) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  commands,
  onChange,
  onAnalyze,
  isAnalyzing = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Command Input
        </h2>
        <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>⌨️</span>
          <span>One command per line</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={commands}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter your commands here, one per line:

git add .
git commit -m "Initial commit"
npm install
docker build -t myapp .
ls -la
mkdir src/components`}
            className="w-full h-64 px-4 py-3 text-sm font-mono bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
          />
          <div className="absolute bottom-3 right-3 text-xs text-neutral-400 dark:text-neutral-500">
            {commands.split("\n").filter((line) => line.trim()).length} commands
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            💡 Tip: Use Tab for indentation, supports Git, Docker, npm, and file
            operations
          </div>

          <button
            onClick={onAnalyze}
            disabled={!commands.trim() || isAnalyzing}
            className="inline-flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <span className="mr-2">🔍</span>
                Analyze Commands
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
