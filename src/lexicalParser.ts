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

interface AnalysisSettings {
    allowWhitespaceInPaths: boolean;
    useFixedPaths: boolean;
}

export class LexicalParser {
    private static commandPatterns = [
        // Git commands
        {
            pattern: /^git\s+(add|commit|push|pull|checkout|branch|merge|clone|status|log)\s*(.*)/,
            type: 'git',
            generateRegex: (matches: RegExpMatchArray, settings: AnalysisSettings) => {
                const action = matches[1];
                const args = matches[2]?.trim();
                if (!args) return `^git\\s+${action}`;

                if (settings.useFixedPaths) {
                    return `^git\\s+${action}\\s+${args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
                }

                let processedArgs = args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                if (settings.allowWhitespaceInPaths) {
                    // Allow flexible whitespace in file paths
                    processedArgs = processedArgs.replace(/\\\s+/g, '\\s+');
                }
                return `^git\\s+${action}\\s+${processedArgs}`;
            }
        },
        // npm/yarn commands
        {
            pattern: /^(npm|yarn|pnpm)\s+(install|add|remove|build|start|test|run)\s*(.*)/,
            type: 'package-manager',
            generateRegex: (matches: RegExpMatchArray, settings: AnalysisSettings) => {
                const manager = matches[1];
                const action = matches[2];
                const args = matches[3]?.trim();
                if (!args) return `^${manager}\\s+${action}`;

                if (settings.useFixedPaths) {
                    return `^${manager}\\s+${action}\\s+${args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
                }

                let processedArgs = args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                if (settings.allowWhitespaceInPaths) {
                    processedArgs = processedArgs.replace(/\\\s+/g, '\\s+');
                }
                return `^${manager}\\s+${action}\\s+${processedArgs}`;
            }
        },
        // Docker commands
        {
            pattern: /^docker\s+(build|run|pull|push|ps|images|stop|start|exec)\s*(.*)/,
            type: 'docker',
            generateRegex: (matches: RegExpMatchArray, settings: AnalysisSettings) => {
                const action = matches[1];
                const args = matches[2]?.trim();
                if (!args) return `^docker\\s+${action}`;

                if (settings.useFixedPaths) {
                    return `^docker\\s+${action}\\s+${args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
                }

                let processedArgs = args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                if (settings.allowWhitespaceInPaths) {
                    processedArgs = processedArgs.replace(/\\\s+/g, '\\s+');
                }
                return `^docker\\s+${action}\\s+${processedArgs}`;
            }
        },
        // File operations
        {
            pattern: /^(ls|dir|cat|touch|mkdir|rm|cp|mv|chmod|chown)\s*(.*)/,
            type: 'file-ops',
            generateRegex: (matches: RegExpMatchArray, settings: AnalysisSettings) => {
                const command = matches[1];
                const args = matches[2]?.trim();
                if (!args) return `^${command}`;

                if (settings.useFixedPaths) {
                    return `^${command}\\s+${args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
                }

                let processedArgs = args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                if (settings.allowWhitespaceInPaths) {
                    // For file operations, be more flexible with paths that might contain spaces
                    processedArgs = processedArgs.replace(/\\\s+/g, '\\s+');
                    // Also allow for quoted paths
                    processedArgs = processedArgs.replace(/\\"/g, '["\'"]?').replace(/\\'/g, '["\'"]?');
                }
                return `^${command}\\s+${processedArgs}`;
            }
        },
        // Generic command pattern
        {
            pattern: /^(\w+)\s*(.*)/,
            type: 'generic',
            generateRegex: (matches: RegExpMatchArray, settings: AnalysisSettings) => {
                const command = matches[1];
                const args = matches[2]?.trim();
                if (!args) return `^${command}`;

                if (settings.useFixedPaths) {
                    return `^${command}\\s+${args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
                }

                let processedArgs = args.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                if (settings.allowWhitespaceInPaths) {
                    processedArgs = processedArgs.replace(/\\\s+/g, '\\s+');
                }
                return `^${command}\\s+${processedArgs}`;
            }
        }
    ];

    static parseCommands(commands: string[], settings: AnalysisSettings = { allowWhitespaceInPaths: false, useFixedPaths: false }): ParsedCommand[] {
        return commands
            .filter(cmd => cmd.trim().length > 0)
            .map((command, index) => {
                const trimmedCommand = command.trim();

                for (const pattern of this.commandPatterns) {
                    const match = trimmedCommand.match(pattern.pattern);
                    if (match) {
                        const components = this.extractComponents(match, pattern.type);
                        const regex = pattern.generateRegex(match, settings);

                        return {
                            id: `cmd_${index}_${Date.now()}`,
                            originalCommand: trimmedCommand,
                            components,
                            regex,
                            confidence: this.calculateConfidence(match, pattern.type)
                        };
                    }
                }

                // Fallback for unmatched commands
                const fallbackRegex = settings.useFixedPaths
                    ? `^${trimmedCommand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`
                    : `^${trimmedCommand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`;

                return {
                    id: `cmd_${index}_${Date.now()}`,
                    originalCommand: trimmedCommand,
                    components: { action: trimmedCommand.split(' ')[0] },
                    regex: fallbackRegex,
                    confidence: 0.3
                };
            });
    }

    private static extractComponents(match: RegExpMatchArray, type: string) {
        switch (type) {
            case 'git':
            case 'docker':
                return {
                    action: match[1],
                    parameters: match[2] ? match[2].split(' ').filter(p => p && !p.startsWith('-')) : [],
                    flags: match[2] ? match[2].split(' ').filter(p => p.startsWith('-')) : []
                };
            case 'package-manager':
                return {
                    action: match[2],
                    target: match[1], // npm, yarn, pnpm
                    parameters: match[3] ? match[3].split(' ').filter(p => p && !p.startsWith('-')) : [],
                    flags: match[3] ? match[3].split(' ').filter(p => p.startsWith('-')) : []
                };
            case 'file-ops':
                return {
                    action: match[1],
                    parameters: match[2] ? match[2].split(' ').filter(p => p.length > 0) : []
                };
            default:
                return {
                    action: match[1],
                    parameters: match[2] ? match[2].split(' ').filter(p => p.length > 0) : []
                };
        }
    }

    private static calculateConfidence(match: RegExpMatchArray, type: string): number {
        const baseConfidence: Record<string, number> = {
            'git': 0.95,
            'docker': 0.9,
            'package-manager': 0.9,
            'file-ops': 0.8,
            'generic': 0.6
        };

        let confidence = baseConfidence[type] || 0.5;

        // Reduce confidence for very short matches
        if (match[0].length < 5) confidence *= 0.7;

        // Increase confidence for commands with parameters
        if (match[2] && match[2].trim().length > 0) confidence *= 1.1;

        return Math.min(1, confidence);
    }
}