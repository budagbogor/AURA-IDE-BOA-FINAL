/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileCode, 
  Search, 
  MessageSquare, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  X, 
  Terminal, 
  Play,
  Cpu,
  Sparkles,
  Send,
  User,
  Bot,
  FolderOpen,
  Save,
  Github,
  Download,
  ExternalLink
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ai } from './services/geminiService';
import { FREE_MODELS, generateOpenRouterContent, fetchFreeModels, type OpenRouterModel } from './services/openRouterService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileItem {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'App.tsx', content: '// Welcome to Aura IDE\nexport default function App() {\n  return <div>Hello World</div>;\n}', language: 'typescript' },
    { id: '2', name: 'index.css', content: 'body { background: #1e1e1e; }', language: 'css' },
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [sidebarTab, setSidebarTab] = useState<'files' | 'search' | 'ai' | 'github' | 'settings'>('files');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Welcome to **Aura AI IDE**. I am your coding assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Aura Terminal v1.0.0', 'Ready for input...']);
  const [githubConnected, setGithubConnected] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [openRouterModel, setOpenRouterModel] = useState('auto-free');
  const [dynamicFreeModels, setDynamicFreeModels] = useState<OpenRouterModel[]>(FREE_MODELS);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (aiProvider === 'openrouter') {
      refreshModels();
    }
  }, [aiProvider]);

  const refreshModels = async () => {
    setIsFetchingModels(true);
    try {
      const models = await fetchFreeModels();
      // Keep "Smart Auto-Select" at the top
      setDynamicFreeModels([FREE_MODELS[0], ...models.filter(m => m.id !== 'auto-free')]);
    } catch (error) {
      console.error('Failed to refresh models:', error);
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: value } : f));
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      let content = '';
      const prompt = `You are an expert AI coding assistant. 
            Current File: ${activeFile.name} (${activeFile.language})
            Content:
            ${activeFile.content}
            
            User Request:
            ${chatInput}`;

      if (aiProvider === 'gemini') {
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        });
        content = response.text || 'Sorry, I couldn\'t generate a response.';
      } else {
        const apiKey = process.env.OPENROUTER_API_KEY || '';
        if (!apiKey) throw new Error('OpenRouter API Key is missing in secrets.');
        content = await generateOpenRouterContent(openRouterModel, prompt, apiKey);
      }

      const assistantMsg: ChatMessage = { role: 'assistant', content: content };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error('AI Error:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || 'Failed to connect to AI service.'}` }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const createNewFile = () => {
    const newFile: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: `new-file-${files.length + 1}.ts`,
      content: '',
      language: 'typescript'
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const openFolder = async () => {
    try {
      // @ts-ignore - File System Access API
      const dirHandle = await window.showDirectoryPicker();
      const newFiles: FileItem[] = [];
      
      async function scan(handle: any) {
        for await (const entry of handle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            const content = await file.text();
            const ext = file.name.split('.').pop();
            newFiles.push({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              content: content,
              language: ext === 'ts' || ext === 'tsx' ? 'typescript' : ext === 'js' || ext === 'jsx' ? 'javascript' : ext || 'plaintext'
            });
          }
        }
      }
      
      await scan(dirHandle);
      if (newFiles.length > 0) {
        setFiles(newFiles);
        setActiveFileId(newFiles[0].id);
        setTerminalOutput(prev => [...prev, `Opened folder: ${dirHandle.name}`, `Loaded ${newFiles.length} files.`]);
      }
    } catch (err) {
      console.error('Error opening folder:', err);
      setTerminalOutput(prev => [...prev, 'Error: Could not open local folder. (Browser may block this in iframes)']);
    }
  };

  const exportProject = async () => {
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'aura-project.zip');
    setTerminalOutput(prev => [...prev, 'Project exported as aura-project.zip']);
  };

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] text-[#cccccc] select-none">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 border-r border-white/5">
        <div 
          onClick={() => setSidebarTab('files')}
          className={cn("p-2 cursor-pointer transition-colors", sidebarTab === 'files' ? "text-white" : "text-[#858585] hover:text-white")}
        >
          <FileCode size={24} />
        </div>
        <div 
          onClick={() => setSidebarTab('search')}
          className={cn("p-2 cursor-pointer transition-colors", sidebarTab === 'search' ? "text-white" : "text-[#858585] hover:text-white")}
        >
          <Search size={24} />
        </div>
        <div 
          onClick={() => setSidebarTab('ai')}
          className={cn("p-2 cursor-pointer transition-colors", sidebarTab === 'ai' ? "text-white" : "text-[#858585] hover:text-white")}
        >
          <Sparkles size={24} />
        </div>
        <div 
          onClick={() => setSidebarTab('github')}
          className={cn("p-2 cursor-pointer transition-colors", sidebarTab === 'github' ? "text-white" : "text-[#858585] hover:text-white")}
        >
          <Github size={24} />
        </div>
        <div 
          onClick={() => setSidebarTab('settings')}
          className={cn("mt-auto p-2 cursor-pointer transition-colors", sidebarTab === 'settings' ? "text-white" : "text-[#858585] hover:text-white")}
        >
          <Settings size={24} />
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="w-64 bg-[#252526] flex flex-col border-r border-white/5">
        <div className="p-3 text-[11px] uppercase tracking-wider font-bold text-[#bbbbbb] flex justify-between items-center">
          {sidebarTab === 'files' && 'Explorer'}
          {sidebarTab === 'search' && 'Search'}
          {sidebarTab === 'ai' && 'Aura AI Chat'}
          {sidebarTab === 'github' && 'GitHub Integration'}
          {sidebarTab === 'settings' && 'Settings'}
          {sidebarTab === 'files' && (
            <div className="flex gap-2">
              <Plus size={14} className="cursor-pointer hover:text-white" onClick={createNewFile} />
              <FolderOpen size={14} className="cursor-pointer hover:text-white" onClick={openFolder} />
              <Download size={14} className="cursor-pointer hover:text-white" onClick={exportProject} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {sidebarTab === 'files' && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1 px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer group">
                <ChevronDown size={16} />
                <span className="text-[13px] font-bold">AURA-PROJECT</span>
              </div>
              <div className="pl-4">
                {files.map(file => (
                  <div 
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 cursor-pointer text-[13px]",
                      activeFileId === file.id ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
                    )}
                  >
                    <FileCode size={14} className="text-blue-400" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sidebarTab === 'settings' && (
            <div className="p-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase font-bold text-[#858585]">Editor</span>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs">Font Size</label>
                    <input 
                      type="number" 
                      value={editorFontSize}
                      onChange={(e) => setEditorFontSize(Number(e.target.value))}
                      className="bg-[#3c3c3c] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase font-bold text-[#858585]">AI Provider</span>
                <select 
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as 'gemini' | 'openrouter')}
                  className="bg-[#3c3c3c] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openrouter">OpenRouter (Free Models)</option>
                </select>
              </div>

              {aiProvider === 'gemini' ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase font-bold text-[#858585]">Gemini Model</span>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-[#3c3c3c] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase font-bold text-[#858585]">OpenRouter Model</span>
                    <button 
                      onClick={refreshModels}
                      disabled={isFetchingModels}
                      className="text-[10px] text-blue-400 hover:text-blue-300 disabled:opacity-50"
                    >
                      {isFetchingModels ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                  <select 
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    className="bg-[#3c3c3c] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {dynamicFreeModels.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#858585] italic">
                    {openRouterModel === 'auto-free' 
                      ? "Automatically picks the best available free model with low traffic." 
                      : "Using specific free model."}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase font-bold text-[#858585]">Environment</span>
                <div className="flex flex-col gap-1">
                  <div className="p-2 bg-white/5 rounded text-[10px] font-mono break-all">
                    GEMINI_API_KEY: {process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}
                  </div>
                  <div className="p-2 bg-white/5 rounded text-[10px] font-mono break-all">
                    OPENROUTER_API_KEY: {process.env.OPENROUTER_API_KEY ? '✅ Configured' : '❌ Missing'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {sidebarTab === 'ai' && (
            <div className="flex flex-col h-full p-4 gap-4">
              <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
                {chatMessages.length === 0 && (
                  <div className="text-center mt-10 text-[#858585]">
                    <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Ask Aura AI to help you code.</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex flex-col gap-1", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className="flex items-center gap-2 text-[10px] text-[#858585] uppercase tracking-tighter">
                      {msg.role === 'user' ? <><User size={10} /> You</> : <><Bot size={10} /> Aura AI</>}
                    </div>
                    <div className={cn(
                      "p-3 rounded-lg text-sm max-w-full overflow-hidden",
                      msg.role === 'user' ? "bg-blue-600/20 text-blue-100" : "bg-white/5 text-[#cccccc]"
                    )}>
                      <div className="markdown-body">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex items-center gap-2 text-[#858585] text-xs animate-pulse">
                    <Sparkles size={12} /> Aura is thinking...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="relative">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="Ask anything..."
                  className="w-full bg-[#3c3c3c] border border-white/10 rounded p-2 text-sm focus:outline-none focus:border-blue-500 resize-none h-20"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isAiLoading}
                  className="absolute bottom-2 right-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {sidebarTab === 'github' && (
            <div className="p-4 flex flex-col h-full gap-6">
              {!githubConnected ? (
                <div className="flex flex-col gap-4 text-center">
                  <Github size={48} className="mx-auto opacity-20" />
                  <p className="text-sm text-[#858585]">Connect your GitHub account to clone repositories and push changes.</p>
                  <button 
                    onClick={() => setGithubConnected(true)}
                    className="bg-[#24292e] hover:bg-[#2c3137] text-white py-2 px-4 rounded flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <Github size={16} />
                    Connect GitHub
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <img src="https://github.com/identicons/aura.png" className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">Aura Developer</span>
                      <span className="text-xs text-[#858585]">@aura-dev</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase font-bold text-[#858585]">Clone Repository</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="username/repo"
                        className="flex-1 bg-[#3c3c3c] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                      />
                      <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs">Clone</button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <span className="text-[11px] uppercase font-bold text-[#858585]">Your Repositories</span>
                    <div className="flex flex-col gap-1">
                      {['aura-ide', 'react-gemini-app', 'portfolio-v2'].map(repo => (
                        <div key={repo} className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer group">
                          <span className="text-xs">{repo}</span>
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="h-9 bg-[#252526] flex items-center overflow-x-auto border-b border-white/5">
          {files.map(file => (
            <div 
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={cn(
                "h-full flex items-center gap-2 px-3 cursor-pointer text-[13px] border-r border-white/5 min-w-[120px] transition-colors",
                activeFileId === file.id ? "bg-[#1e1e1e] text-white border-t-2 border-t-blue-500" : "bg-[#2d2d2d] text-[#969696] hover:bg-[#1e1e1e]"
              )}
            >
              <FileCode size={14} className="text-blue-400" />
              <span className="truncate flex-1">{file.name}</span>
              <X size={12} className="hover:bg-white/10 rounded p-0.5" onClick={(e) => {
                e.stopPropagation();
                if (files.length > 1) {
                  setFiles(files.filter(f => f.id !== file.id));
                  if (activeFileId === file.id) setActiveFileId(files[0].id);
                }
              }} />
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            theme="vs-dark"
            language={activeFile.language}
            value={activeFile.content}
            onChange={handleEditorChange}
            options={{
              fontSize: editorFontSize,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 10 },
              fontFamily: 'JetBrains Mono, monospace'
            }}
          />
        </div>

        {/* Bottom Panel (Terminal) */}
        <div className="h-48 bg-[#1e1e1e] border-t border-white/10 flex flex-col">
          <div className="flex items-center gap-4 px-4 py-1 text-[11px] uppercase font-bold text-[#858585] border-b border-white/5">
            <span className="text-white border-b border-white cursor-pointer">Terminal</span>
            <span className="cursor-pointer hover:text-white">Output</span>
            <span className="cursor-pointer hover:text-white">Debug Console</span>
            <div className="ml-auto flex items-center gap-2">
              <Play size={12} className="text-green-500 cursor-pointer" />
              <X size={12} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex-1 p-2 font-mono text-xs overflow-y-auto bg-black/20">
            {terminalOutput.map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-[#cccccc]">{line}</span>
              </div>
            ))}
            <div className="flex gap-2">
              <span className="text-green-500">➜</span>
              <input 
                type="text" 
                className="flex-1 bg-transparent outline-none text-[#cccccc]" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value;
                    setTerminalOutput([...terminalOutput, val]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-6 bg-[#007acc] text-white flex items-center px-3 text-[12px] gap-4 z-50">
        <div className="flex items-center gap-1 hover:bg-white/10 px-1 cursor-pointer">
          <ChevronRight size={14} />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-white/10 px-1 cursor-pointer">
          <X size={14} />
          <span>0</span>
          <Terminal size={14} />
          <span>0</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hover:bg-white/10 px-1 cursor-pointer">Spaces: 2</div>
          <div className="hover:bg-white/10 px-1 cursor-pointer">UTF-8</div>
          <div className="hover:bg-white/10 px-1 cursor-pointer">{activeFile.language}</div>
          <div className="flex items-center gap-1 hover:bg-white/10 px-1 cursor-pointer">
            <Cpu size={14} />
            <span>Aura AI Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
