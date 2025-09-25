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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Transform Commands into Regular Expressions
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Enter your shell commands, scripts, or CLI instructions below.
              Shelly will analyze each command using advanced lexical parsing to
              generate precise regular expressions that you can use in your
              favorite code editors and tools.
            </p>
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
