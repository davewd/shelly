import React from "react";

interface InputSectionProps {
  commands: string;
  onChange: (commands: string) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
  commandCount?: number;
  lineCount?: number;
}

export const InputSection: React.FC<InputSectionProps> = ({
  commands,
  onChange,
  onAnalyze,
  isAnalyzing = false,
  isCollapsed = false,
  onExpand,
  commandCount = 0,
  lineCount = 0,
}) => {
  // Example command sets
  const exampleSets = [
    {
      name: "Git Workflow",
      icon: "🌿",
      commands: [
        "git status",
        "git add .",
        "git commit -m 'Update features'",
        "git push origin main",
        "git pull upstream develop"
      ]
    },
    {
      name: "Docker Setup",
      icon: "🐳", 
      commands: [
        "docker build -t webapp .",
        "docker run -p 3000:3000 webapp",
        "docker ps -a",
        "docker stop container_name",
        "docker-compose up -d"
      ]
    },
    {
      name: "Node Development",
      icon: "📦",
      commands: [
        "npm install express",
        "npm run build",
        "npm test --coverage",
        "npm start",
        "yarn add typescript"
      ]
    },
    {
      name: "File Operations",
      icon: "📁",
      commands: [
        "mkdir -p src/components",
        "ls -la /home/user",
        "cp -r source/ destination/",
        "rm -rf temp_folder",
        "chmod +x script.sh"
      ]
    },
    {
      name: "System Monitor",
      icon: "⚡",
      commands: [
        "ps aux | grep node",
        "top -p process_id",
        "df -h",
        "free -m",
        "netstat -tulpn"
      ]
    },
    {
      name: "Python Projects", 
      icon: "🐍",
      commands: [
        "python -m venv myenv",
        "./venv/bin/python main.py",
        "pip install -r requirements.txt", 
        "python manage.py migrate",
        "pytest tests/ -v"
      ]
    }
  ];

  const loadExample = (commands: string[]) => {
    onChange(commands.join('\n'));
  };

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

  // If collapsed, show summary view
  if (isCollapsed) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Command Input
              </h2>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                ✓ Analyzed
              </div>
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Identified{" "}
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {commandCount} commands
              </span>{" "}
              on{" "}
              <span className="font-medium text-secondary-600 dark:text-secondary-400">
                {lineCount} rows
              </span>
            </div>
          </div>
          <button
            onClick={onExpand}
            className="inline-flex items-center px-3 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
          >
            <span className="mr-2">✏️</span>
            Edit Commands
          </button>
        </div>
      </div>
    );
  }

  // Expanded view (original form)
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          📝 Step 2: Command Input
        </h2>
        <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>⌨️</span>
          <span>One command per line</span>
        </div>
      </div>

      {/* Example Buttons */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Quick Examples
          </h3>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Click to auto-populate
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {exampleSets.map((example) => (
            <button
              key={example.name}
              onClick={() => loadExample(example.commands)}
              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-800/30 dark:hover:to-secondary-800/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-lg border border-primary-200 dark:border-primary-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
            >
              <span className="mr-2">{example.icon}</span>
              {example.name}
            </button>
          ))}
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
