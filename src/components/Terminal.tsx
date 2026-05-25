'use client';

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { commands, unknownCommand, welcomeMessage, type CommandResponse } from '@/lib/terminal-commands';

interface TerminalLine {
  id: number;
  text: string;
  type: CommandResponse['type'];
  isInput?: boolean;
}

export interface TerminalRef {
  executeCommand: (cmd: string) => void;
}

interface TerminalProps {
  onExit?: () => void;
}

const Terminal = forwardRef<TerminalRef, TerminalProps>(function Terminal({ onExit }, ref) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lineId, setLineId] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [corruptionActive, setCorruptionActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<TerminalLine[]>([]);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const typeText = useCallback(async (text: string, type: CommandResponse['type'] = 'normal') => {
    setIsTyping(true);
    const chars = text.split('');
    const chunkSize = 30;
    let currentText = '';

    for (let i = 0; i < chars.length; i += chunkSize) {
      currentText += chars.slice(i, i + chunkSize).join('');
      setLines(prev => {
        const newLines = [...prev];
        const lastLine = newLines[newLines.length - 1];
        if (lastLine && !lastLine.isInput) {
          lastLine.text = currentText;
        }
        return newLines;
      });

      await new Promise(resolve => setTimeout(resolve, 1));
    }

    setIsTyping(false);
  }, []);

  const executeCommand = useCallback(async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    const inputId = linesRef.current.length;
    setLineId(prev => prev + 1);
    setLines(prev => [...prev, { id: inputId, text: `> ${cmd}`, type: 'normal', isInput: true }]);

    if (trimmedCmd === 'clear') {
      setLines([]);
      return;
    }

    const response = commands[trimmedCmd] || unknownCommand(trimmedCmd);

    if (trimmedCmd === 'corrupt') {
      setCorruptionActive(true);
      setTimeout(() => setCorruptionActive(false), 3000);
    }

    if (trimmedCmd === 'exit') {
      onExit?.();
    }

    const respId = linesRef.current.length;
    setLineId(prev => prev + 1);
    setLines(prev => [...prev, { id: respId, text: '', type: response.type }]);

    await typeText(response.text, response.type);
  }, [typeText, onExit]);

  useImperativeHandle(ref, () => ({
    executeCommand
  }), [executeCommand]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    executeCommand(input);
    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  }, [input, isTyping, executeCommand]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  }, [history, historyIndex]);

  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      setLines([{ id: 0, text: '', type: 'normal' }]);
      await typeText(welcomeMessage, 'normal');
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const getLineColor = (type: CommandResponse['type']) => {
    switch (type) {
      case 'error': return 'text-foreground-red';
      case 'warning': return 'text-foreground-amber';
      case 'success': return 'text-foreground-cyan';
      case 'corrupt': return 'text-foreground-red glitch-text';
      case 'self-ref': return 'text-foreground-cyan';
      default: return 'text-foreground';
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto border-2 border-foreground/30 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm ${corruptionActive ? 'corrupt' : ''}`}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-foreground/10 border-b border-foreground/20">
        <span className="text-xs text-foreground/60 font-mono">null@pointer: ~</span>
        <span className="text-xs text-foreground/40 font-mono">bash — 80x24</span>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        onClick={handleTerminalClick}
        className="h-[500px] overflow-y-auto p-4 terminal-scroll font-mono text-sm leading-relaxed"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap mb-1 transition-opacity duration-150 ${getLineColor(line.type)} ${line.isInput ? 'text-foreground-dim' : ''}`}
          >
            {line.text}
            {!line.isInput && line.text === '' && isTyping && (
              <span className="cursor-blink">█</span>
            )}
          </div>
        ))}

        {/* Input line */}
        {!isTyping && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-foreground-dim">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm caret-foreground"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <span className="cursor-blink text-foreground">█</span>
          </form>
        )}
      </div>
    </div>
  );
});

export default Terminal;
