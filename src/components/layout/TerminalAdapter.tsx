import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalAdapterProps {
  id: string;
  output: string[];
  isRunning: boolean;
  onData?: (data: string) => void;
  height?: number;
}

export const TerminalAdapter: React.FC<TerminalAdapterProps> = ({
  id,
  output,
  isRunning,
  onData,
  height = 300
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize XTerm
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0a0a0a',
        foreground: '#cccccc',
        cursor: '#ffffff',
        selectionBackground: '#264f78',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
      rows: Math.floor(height / 20) || 15
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle user input in terminal
    if (onData) {
      term.onData(data => onData(data));
    }

    // Initial output clear/fill
    term.clear();
    output.forEach(line => {
       // XTerm uses \r\n for new lines
       term.writeln(line.replace(/\n/g, '\r\n'));
    });

    // Cleanup
    return () => {
      term.dispose();
      xtermRef.current = null;
    };
  }, [id]); // Re-init if session ID changes

  // Update output when it changes
  useEffect(() => {
    if (xtermRef.current && output.length > 0) {
      // Only write the LAST line to avoid flickering and performance issues
      // Alternatively, we can clear and re-write, but that's expensive.
      // For now, let's try writing the last line added.
      const lastLine = output[output.length - 1];
      if (lastLine) {
        xtermRef.current.writeln(lastLine.replace(/\n/g, '\r\n'));
      }
    }
  }, [output.length]);

  return (
    <div 
      ref={terminalRef} 
      className="xterm-container h-full w-full overflow-hidden" 
      style={{ backgroundColor: '#0a0a0a' }}
    />
  );
};
