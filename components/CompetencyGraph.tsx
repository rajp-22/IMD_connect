'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  Users,
  FileCheck2,
  Library,
  ArrowRight,
  Info,
  X,
} from 'lucide-react';
import { ICompetency } from '@/lib/types';

interface CompetencyNode {
  id: string;
  name: string;
  x: number;
  y: number;
  category: string;
  relatedCourses: string[];
  requiredSkills: string[];
  trainers: string[];
  assessments: string[];
  resources: string[];
}

const NODES: CompetencyNode[] = [
  {
    id: 'c1',
    name: 'Meteorology',
    x: 320,
    y: 50,
    category: 'Core Science',
    relatedCourses: ['Weather Forecasting Fundamentals', 'Weather Observation & Surface Instrumentation'],
    requiredSkills: ['Thermodynamics', 'Hydrostatic Balance', 'Atmospheric Layers'],
    trainers: ['Dr. Rajesh Sharma', 'Dr. Sunita Rao'],
    assessments: ['Final Assessment: Weather Forecasting Fundamentals', 'Surface Observation Protocols'],
    resources: ['Atmospheric Layers Reference Guide.pdf', 'Hydrostatic Equations Handbook.pdf'],
  },
  {
    id: 'c2',
    name: 'Weather Forecasting',
    x: 140,
    y: 150,
    category: 'Operational',
    relatedCourses: ['Weather Forecasting Fundamentals'],
    requiredSkills: ['Synoptic Plotting', 'Trough Lines', 'Severe Weather Bulletins'],
    trainers: ['Dr. Rajesh Sharma'],
    assessments: ['Final Assessment: Weather Forecasting Fundamentals'],
    resources: ['Forecasting Notes.pdf', 'Synoptic Protocols.pptx'],
  },
  {
    id: 'c3',
    name: 'Satellite Meteorology',
    x: 500,
    y: 150,
    category: 'Remote Sensing',
    relatedCourses: ['Satellite Meteorology'],
    requiredSkills: ['INSAT-3DR Radiance', 'Dvorak Intensity', 'RGB Compositing'],
    trainers: ['Dr. Ananya Sen'],
    assessments: ['Evaluation Exam: Satellite Meteorology & INSAT Payloads'],
    resources: ['Satellite Basics.pdf', 'Image Interpretation.pptx'],
  },
  {
    id: 'c4',
    name: 'Python',
    x: 140,
    y: 280,
    category: 'Programming',
    relatedCourses: ['Python for Meteorological Data Analysis'],
    requiredSkills: ['NumPy Arrays', 'Xarray Slicing', 'MetPy Thermodynamic Plots'],
    trainers: ['Dr. Vikram Verma'],
    assessments: ['Certification Quiz: Python & Scientific NetCDF Workflows'],
    resources: ['Scientific Python Stack Guide.pdf', 'NetCDF Scripts.py'],
  },
  {
    id: 'c5',
    name: 'Radar Meteorology',
    x: 500,
    y: 280,
    category: 'Remote Sensing',
    relatedCourses: ['Weather Observation & Surface Instrumentation'],
    requiredSkills: ['Doppler Reflectivity', 'Dual-Pol Hydrometeor Classification', 'Nowcasting'],
    trainers: ['Dr. Sunita Rao'],
    assessments: ['Practical Assessment: Surface Observation Protocols'],
    resources: ['DWR Echo Analysis Handbook.pdf'],
  },
  {
    id: 'c6',
    name: 'Data Analysis',
    x: 320,
    y: 380,
    category: 'Analytics',
    relatedCourses: ['Python for Meteorological Data Analysis', 'Climate Data Analysis & Extreme Weather Modeling'],
    requiredSkills: ['Time-Series Climatology', 'GEV Extreme Value Distributions', 'Anomaly Detection'],
    trainers: ['Dr. Vikram Verma', 'Dr. Rajesh Sharma'],
    assessments: ['Evaluation Exam: Extreme Value Climatology'],
    resources: ['GEV Climatology Methods.pdf', 'ERA5 Reanalysis Datasets'],
  },
];

const EDGES = [
  { from: 'c1', to: 'c2' },
  { from: 'c1', to: 'c3' },
  { from: 'c2', to: 'c4' },
  { from: 'c3', to: 'c5' },
  { from: 'c4', to: 'c6' },
  { from: 'c5', to: 'c6' },
];

export default function CompetencyGraph() {
  const [selectedNode, setSelectedNode] = useState<CompetencyNode | null>(NODES[0]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-900" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Interactive Meteorological Knowledge & Competency Graph
            </h3>
            <p className="text-xs text-slate-500">
              Click any competency node to inspect connected curriculum, required skills, and trainers.
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-mono font-semibold">
          Feature 19
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* SVG Graph Canvas */}
        <div className="lg:col-span-7 p-4 flex items-center justify-center bg-radial from-slate-50 to-slate-100/70 relative">
          <svg viewBox="0 0 640 450" className="w-full max-w-[580px] h-auto">
            {/* Connection Edges */}
            {EDGES.map((edge, i) => {
              const fromNode = NODES.find((n) => n.id === edge.from)!;
              const toNode = NODES.find((n) => n.id === edge.to)!;
              const isConnectedToSelected =
                selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

              return (
                <line
                  key={i}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isConnectedToSelected ? '#1E3A8A' : '#CBD5E1'}
                  strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                  strokeDasharray={isConnectedToSelected ? 'none' : '4,4'}
                  className="transition-colors duration-200"
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 32 : 26}
                    fill={isSelected ? '#1E3A8A' : '#FFFFFF'}
                    stroke={isSelected ? '#F59E0B' : '#0F172A'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-all duration-200 shadow-md group-hover:scale-105"
                  />
                  <text
                    x={node.x}
                    y={node.y + 45}
                    textAnchor="middle"
                    fill={isSelected ? '#1E3A8A' : '#334155'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : '600'}
                    className="select-none"
                  >
                    {node.name}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 3}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#1E3A8A'}
                    fontSize="10"
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {node.category.substring(0, 3).toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="lg:col-span-5 p-5 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedNode.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Node: {selectedNode.id}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mt-1">{selectedNode.name}</h4>
              </div>

              {/* Related Courses */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                  <span>Related Courses</span>
                </div>
                <div className="space-y-1">
                  {selectedNode.relatedCourses.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-50 hover:bg-blue-50/50 rounded-md border border-slate-200 text-xs font-medium text-slate-800 flex items-center justify-between"
                    >
                      <span className="truncate">{c}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Required Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.requiredSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certified Trainers */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  <span>Certified IMD Trainers</span>
                </div>
                <div className="text-xs text-slate-600">
                  {selectedNode.trainers.join(', ')}
                </div>
              </div>

              {/* Assessments & Resources */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-rose-700" />
                  <span>Standard Assessments</span>
                </div>
                <div className="text-xs text-slate-600">
                  {selectedNode.assessments.join(', ')}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Select a node in the graph to view details.
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Graph nodes dynamically illustrate competency prerequisites and cross-discipline learning pathways.
          </div>
        </div>
      </div>
    </div>
  );
}
