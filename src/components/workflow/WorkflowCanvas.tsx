import React, { useState, useRef } from 'react';
import { Plus, Search, Undo, Redo, Play, Save } from 'lucide-react';
import { NodePanel } from './NodePanel';
import { WorkflowNode } from './WorkflowNode';
import { NodeConnection } from './NodeConnection';
import { ConfigPanel } from './ConfigPanel';
import { useWorkflowStore } from '../../lib/store/useWorkflowStore';
import { WorkflowToolbar } from './WorkflowToolbar';
import { NodeSearch } from './NodeSearch';

export const WorkflowCanvas: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('nodeType', nodeType);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDragging) {
      setDragOffset({
        x: e.clientX - canvasRef.current!.getBoundingClientRect().left,
        y: e.clientY - canvasRef.current!.getBoundingClientRect().top,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    // Add node to workflow at drop position
    setIsDragging(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Left Sidebar - Node Types */}
      <div className="w-64 border-r border-gray-800 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            <span>Search nodes...</span>
          </button>
        </div>
        <NodePanel onDragStart={handleDragStart} />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <WorkflowToolbar />
        
        <div
          ref={canvasRef}
          className="flex-1 relative bg-gray-900 overflow-auto"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Grid overlay for visual guidance */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full opacity-10 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
          </div>

          {/* Nodes and Connections */}
          <div className="relative w-full h-full">
            {/* Example nodes - replace with dynamic content */}
            <WorkflowNode
              id="trigger1"
              type="trigger"
              position={{ x: 100, y: 100 }}
              onSelect={handleNodeSelect}
              selected={selectedNode === 'trigger1'}
            />
            <WorkflowNode
              id="action1"
              type="action"
              position={{ x: 300, y: 200 }}
              onSelect={handleNodeSelect}
              selected={selectedNode === 'action1'}
            />
            <NodeConnection
              start={{ x: 100, y: 100 }}
              end={{ x: 300, y: 200 }}
              active={true}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Configuration */}
      {selectedNode && (
        <ConfigPanel
          nodeId={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Node Search Modal */}
      {showSearch && (
        <NodeSearch onClose={() => setShowSearch(false)} />
      )}
    </div>
  );
};