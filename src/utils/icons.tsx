import React from 'react';
import { 
  FileCode, FileIcon, FileJson, FileType, FileText, 
  Image as ImageIcon, Coffee, Braces, Layers, Folder, FolderOpen 
} from 'lucide-react';

export const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx':
    case 'ts': return <FileCode size={14} className="text-blue-400" />;
    case 'jsx':
    case 'js': return <FileCode size={14} className="text-yellow-400" />;
    case 'css': return <Layers size={14} className="text-blue-500" />;
    case 'scss': return <Layers size={14} className="text-pink-400" />;
    case 'html': return <FileType size={14} className="text-orange-500" />;
    case 'json': return <FileJson size={14} className="text-yellow-600" />;
    case 'md': return <FileText size={14} className="text-blue-300" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg': return <ImageIcon size={14} className="text-purple-400" />;
    case 'env': return <Braces size={14} className="text-gray-400" />;
    default: return <FileIcon size={14} className="text-gray-400" />;
  }
};

export const getFolderIcon = (isOpen: boolean) => {
  return isOpen 
    ? <FolderOpen size={14} className="text-blue-400/80" /> 
    : <Folder size={14} className="text-blue-400/80" />;
};
