import { useState } from "react";
import { InputSection } from "./components/InputSection";
import { ParserSection } from "./components/ParserSection";
import { OutputSection } from "./components/OutputSection";
import { LexicalParser } from "./lexicalParser";
import "./App.css";

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

function App() {
  const [commands, setCommands] = useState<string>("");
  const [parsedCommands, setParsedCommands] = useState<ParsedCommand[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [isInputCollapsed, setIsInputCollapsed] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!commands.trim()) return;

    setIsAnalyzing(true);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const commandLines = commands
      .split("\n")
      .filter((line) => line.trim().length > 0);
    const results = LexicalParser.parseCommands(commandLines);

    setParsedCommands(results);
    setHasAnalyzed(true);
    setIsInputCollapsed(true); // Collapse input after analysis
    setIsAnalyzing(false);
  };

  const handleCommandsChange = (newCommands: string) => {
    setCommands(newCommands);
    // Reset analysis state when commands change
    if (hasAnalyzed) {
      setHasAnalyzed(false);
      setParsedCommands([]);
      setIsInputCollapsed(false); // Expand input when editing
    }
  };

  const handleEditCommands = () => {
    // Clear analysis and expand input section
    setHasAnalyzed(false);
    setParsedCommands([]);
    setIsInputCollapsed(false);
  };

  const handleCopyPrompt = async (
    promptType: "extract_chat" | "format_chat_commands"
  ) => {
    try {
      // Import the prompt content dynamically
      const promptModule = await import(`./assets/${promptType}.prompt.md?raw`);
      const promptContent = promptModule.default;

      // Copy to clipboard
      await navigator.clipboard.writeText(promptContent);

      // You could add a toast notification here
      console.log(`${promptType} prompt copied to clipboard!`);
    } catch (error) {
      console.error("Failed to copy prompt:", error);

      // Fallback content if file reading fails
      const fallbackPrompts = {
        extract_chat: `Please extract all terminal commands from this conversation transcript. 

Look for any commands that were executed in terminal sessions, code blocks, or mentioned as being run. Format the output as a simple list with one command per line.

Focus on commands like:
- git commands (add, commit, push, etc.)
- npm/yarn commands (install, build, start, etc.)  
- docker commands (build, run, ps, etc.)
- file operations (ls, mkdir, cp, mv, etc.)
- python/node execution commands

Please provide just the raw commands without explanations.`,

        format_chat_commands: `I have a list of terminal commands extracted from conversation logs. Please format and clean them up for analysis.

Remove any:
- Duplicate commands
- Comments or explanations
- Incomplete or truncated commands
- Commands that are just examples

Format the output as:
- One command per line
- Preserve all flags and parameters
- Keep file paths and arguments intact
- Sort by command type if possible

The goal is to have clean, executable commands that can be analyzed for patterns.`,
      };

      try {
        await navigator.clipboard.writeText(fallbackPrompts[promptType]);
        console.log(`${promptType} fallback prompt copied to clipboard!`);
      } catch (clipboardError) {
        console.error("Failed to copy fallback prompt:", clipboardError);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-4xl font-bold">
                🐚
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Shelly
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Command-to-Regex Lexical Parser for the Vibez!!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
              <a href="https://www.buymeacoffee.com/davewd">
                <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=davewd&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
              </a>
              <iframe
                src="https://github.com/sponsors/davewd/button"
                title="Sponsor davewd"
                height="32"
                width="114"
                style={{ border: "0", borderRadius: "6px" }}
              ></iframe>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Transform Commands into Regular Expressions
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              Improve your Vibe Coding productivity by analyzing terminal
              commands and creating auto-approve/deny lists for your settings.
            </p>

            {/* Numbered workflow steps */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50 p-6 text-left">
              <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4 text-center">
                🚀 How to Use Shelly
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <p className="text-amber-800 dark:text-amber-200">
                    <strong>Use the Prompts</strong> to extract data from your
                    Vibe Coding conversations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <p className="text-amber-800 dark:text-amber-200">
                    <strong>Copy and paste</strong> the commands you are seeing
                    into 'Command Input'
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <p className="text-amber-800 dark:text-amber-200">
                    <strong>Analyze the commands</strong> to identify whether
                    they should be added to auto approve/deny lists
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <p className="text-amber-800 dark:text-amber-200">
                    <strong>Copy the output</strong> so it can be added to your
                    settings file to improve your Vibe Coding productivity
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Extraction Utilities */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  📋 Step 1: Copy Extraction Prompts
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Copy these prompts to your chat window to extract commands
                  from conversations
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">�</span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Chat Prompts
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCopyPrompt("extract_chat")}
                className="inline-flex items-center px-4 py-3 bg-white dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
              >
                <span className="mr-3 text-xl">💬</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    Extract from Conversation
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Copy prompt → Paste in chat
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleCopyPrompt("format_chat_commands")}
                className="inline-flex items-center px-4 py-3 bg-white dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
              >
                <span className="mr-3 text-xl">📋</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    Format Chat Commands
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Copy prompt → Paste in chat
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                  💡
                </span>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Next:</strong> After running the prompts in your chat,
                  copy the extracted commands and paste them into the Command
                  Input section below.
                </p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <InputSection
            commands={commands}
            onChange={handleCommandsChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            isCollapsed={isInputCollapsed}
            onExpand={handleEditCommands}
            commandCount={parsedCommands.length}
            lineCount={
              commands.split("\n").filter((line) => line.trim()).length
            }
          />

          {/* Parser Results Section */}
          <ParserSection
            parsedCommands={parsedCommands}
            isVisible={hasAnalyzed}
          />

          {/* Output/Export Section */}
          <OutputSection
            parsedCommands={parsedCommands}
            isVisible={hasAnalyzed && parsedCommands.length > 0}
          />
        </div>{" "}
        <div className="text-center max-w-3xl mx-auto"></div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              © 2025 Shelly. Built with React, TypeScript, and Tailwind CSS.
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a
                href="#"
                className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
