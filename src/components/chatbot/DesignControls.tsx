
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import ColorPicker from './ColorPicker';
import BrandingOptions from './BrandingOptions';

interface DesignControlsProps {
  onColorChange?: (color: string, opacity?: number) => void;
  onUserBubbleColorChange?: (color: string, opacity?: number) => void;
  onAgentBubbleColorChange?: (color: string, opacity?: number) => void;
  onChatBackgroundColorChange?: (color: string, opacity?: number) => void;
  onThemeChange?: (theme: string) => void;
  onCornerRadiusChange?: (radius: number) => void;
  onBubbleRadiusChange?: (radius: number) => void;
  onBubbleStyleChange?: (style: string) => void;
  onEffectChange?: (effect: string) => void;
  onPositionChange?: (position: 'bottom-right' | 'bottom-left') => void;
  onGradientToggle?: (type: string, enabled: boolean) => void;
  onBrandingChange?: (branding: { enabled: boolean; text: string; link: string }) => void;
}

const DesignControls = ({ 
  onColorChange, 
  onUserBubbleColorChange,
  onAgentBubbleColorChange,
  onChatBackgroundColorChange,
  onThemeChange, 
  onCornerRadiusChange,
  onBubbleRadiusChange,
  onBubbleStyleChange,
  onEffectChange,
  onPositionChange,
  onGradientToggle,
  onBrandingChange
}: DesignControlsProps) => {
  const [cornerRadius, setCornerRadius] = useState(24);
  const [bubbleRadius, setBubbleRadius] = useState(24);
  const [bubbleStyle, setBubbleStyle] = useState('rounded');
  const [selectedEffect, setSelectedEffect] = useState('glass');
  const [selectedPosition, setSelectedPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');

  const colors = [
    { name: 'Green', value: 'bg-green-500', hex: '#10B981' },
    { name: 'Blue', value: 'bg-blue-500', hex: '#3B82F6' },
    { name: 'Purple', value: 'bg-purple-500', hex: '#8B5CF6' },
    { name: 'Orange', value: 'bg-orange-500', hex: '#F97316' },
    { name: 'Red', value: 'bg-red-500', hex: '#EF4444' },
    { name: 'Pink', value: 'bg-pink-500', hex: '#EC4899' },
    { name: 'Indigo', value: 'bg-indigo-500', hex: '#6366F1' },
    { name: 'Teal', value: 'bg-teal-500', hex: '#14B8A6' }
  ];

  const handleCornerRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setCornerRadius(newRadius);
    onCornerRadiusChange?.(newRadius);
  };

  const handleBubbleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setBubbleRadius(newRadius);
    onBubbleRadiusChange?.(newRadius);
  };

  const handleBubbleStyleChange = (style: string) => {
    setBubbleStyle(style);
    onBubbleStyleChange?.(style);
  };

  const handleEffectChange = (effect: string) => {
    setSelectedEffect(effect);
    onEffectChange?.(effect);
  };

  const handlePositionChange = (position: 'bottom-right' | 'bottom-left') => {
    setSelectedPosition(position);
    onPositionChange?.(position);
  };

  return (
    <div className="space-y-6">
      {/* Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle>Colors & Theme</CardTitle>
          <CardDescription>Customize colors for different elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Automatic Gradients - Moved above colors */}
          <div className="space-y-4">
            <h4 className="font-medium">Automatic Gradients</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Header Gradient</Label>
                <Switch 
                  defaultChecked 
                  onCheckedChange={(checked) => onGradientToggle?.('header', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Launcher Gradient</Label>
                <Switch 
                  defaultChecked 
                  onCheckedChange={(checked) => onGradientToggle?.('launcher', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">User Bubble Gradient</Label>
                <Switch 
                  onCheckedChange={(checked) => onGradientToggle?.('userBubble', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Agent Bubble Gradient</Label>
                <Switch 
                  onCheckedChange={(checked) => onGradientToggle?.('agentBubble', checked)}
                />
              </div>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-6">
            <ColorPicker
              title="Header & Launcher Color"
              onColorChange={onColorChange}
              defaultOpacity={100}
            />
            <ColorPicker
              title="User Bubble Color"
              onColorChange={onUserBubbleColorChange}
              defaultOpacity={90}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <ColorPicker
              title="Agent Bubble Color"
              onColorChange={onAgentBubbleColorChange}
              defaultOpacity={85}
            />
            <ColorPicker
              title="Chat Background Color"
              onColorChange={onChatBackgroundColorChange}
              defaultOpacity={80}
            />
          </div>
        </CardContent>
      </Card>

      {/* Position & Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Position & Layout</CardTitle>
          <CardDescription>Choose where your chatbot appears on the website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPosition === 'bottom-right' 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-slate-100 border-transparent hover:border-green-500'
              }`}
              onClick={() => handlePositionChange('bottom-right')}
            >
              <div className="flex justify-end mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
              <h4 className="font-medium">Bottom Right</h4>
              <p className="text-sm text-slate-600">Standard position</p>
            </div>
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPosition === 'bottom-left' 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-slate-100 border-transparent hover:border-green-500'
              }`}
              onClick={() => handlePositionChange('bottom-left')}
            >
              <div className="flex justify-start mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
              <h4 className="font-medium">Bottom Left</h4>
              <p className="text-sm text-slate-600">Alternative position</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Effects */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Effects</CardTitle>
          <CardDescription>Choose the overall appearance style</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-all backdrop-blur-xl ${
                selectedEffect === 'black-dark-open' 
                  ? 'bg-black/30 border-gray-600/40 text-white' 
                  : 'bg-black/10 border-gray-600/20 text-slate-600 hover:bg-black/20'
              }`}
              onClick={() => handleEffectChange('black-dark-open')}
            >
              <h4 className="font-medium">Black Dark Open</h4>
              <p className="text-sm opacity-60">Dark theme with transparency</p>
            </div>

            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-all backdrop-blur-xl ${
                selectedEffect === 'glass' 
                  ? 'bg-white/20 border-white/40 text-slate-800' 
                  : 'bg-white/10 border-white/20 text-slate-600 hover:bg-white/15'
              }`}
              onClick={() => handleEffectChange('glass')}
            >
              <h4 className="font-medium">Clear Glass</h4>
              <p className="text-sm opacity-60">Transparent blur effect</p>
            </div>

            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-all backdrop-blur-xl ${
                selectedEffect === 'glass-tinted' 
                  ? 'bg-green-500/20 border-green-400/40 text-slate-800' 
                  : 'bg-green-500/10 border-green-400/20 text-slate-600 hover:bg-green-500/15'
              }`}
              onClick={() => handleEffectChange('glass-tinted')}
            >
              <h4 className="font-medium">Tinted Glass</h4>
              <p className="text-sm opacity-60">Glass with color tint</p>
            </div>
            
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedEffect === 'bubbles' 
                  ? 'bg-gradient-to-br from-blue-400/30 to-purple-600/30 backdrop-blur-lg border-blue-500 text-white' 
                  : 'bg-gradient-to-br from-blue-400/10 to-purple-600/10 backdrop-blur-md border-transparent hover:border-blue-500/50'
              }`}
              onClick={() => handleEffectChange('bubbles')}
            >
              <h4 className="font-medium">Ocean Bubbles</h4>
              <p className="text-sm opacity-60">Blue-purple gradient</p>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedEffect === 'liquid' 
                  ? 'bg-gradient-to-br from-cyan-400/20 via-blue-500/25 to-purple-600/20 backdrop-blur-2xl border-cyan-400/50 text-slate-800' 
                  : 'bg-gradient-to-br from-cyan-400/10 via-blue-500/15 to-purple-600/10 backdrop-blur-xl border-cyan-400/20 text-slate-600'
              }`}
              onClick={() => handleEffectChange('liquid')}
            >
              <h4 className="font-medium">Liquid Crystal</h4>
              <p className="text-sm opacity-60">Multi-layered glass</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shape & Style */}
      <Card>
        <CardHeader>
          <CardTitle>Shape & Style</CardTitle>
          <CardDescription>Adjust the visual style of your chatbot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Window Corner Radius: {cornerRadius}px</Label>
              <Slider 
                value={[cornerRadius]} 
                onValueChange={handleCornerRadiusChange}
                max={50} 
                step={1} 
                className="w-full" 
              />
            </div>
            <div className="space-y-3">
              <Label>Bubble Corner Radius: {bubbleRadius}px</Label>
              <Slider 
                value={[bubbleRadius]} 
                onValueChange={handleBubbleRadiusChange}
                max={30} 
                step={1} 
                className="w-full" 
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label>Bubble Text Style</Label>
            <Select value={bubbleStyle} onValueChange={handleBubbleStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Rounded (No Tail)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Rounded (No Tail)</SelectItem>
                <SelectItem value="tail">With Tail</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Company Branding */}
      <BrandingOptions onBrandingChange={onBrandingChange} />

      {/* Message Animations */}
      <Card>
        <CardHeader>
          <CardTitle>Message Animations</CardTitle>
          <CardDescription>Animation settings are automatically applied</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Widget Open</Label>
              <Select defaultValue="scale">
                <SelectTrigger>
                  <SelectValue placeholder="Scale Up Fast" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scale">Scale Up Fast</SelectItem>
                  <SelectItem value="fade">Fade In</SelectItem>
                  <SelectItem value="slide">Slide Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message Entrance</Label>
              <Select defaultValue="fade">
                <SelectTrigger>
                  <SelectValue placeholder="Fade In" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade In</SelectItem>
                  <SelectItem value="slide">Slide In</SelectItem>
                  <SelectItem value="bounce">Bounce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Typing Indicator</Label>
              <Select defaultValue="dots">
                <SelectTrigger>
                  <SelectValue placeholder="Dots" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dots">Bouncing Dots</SelectItem>
                  <SelectItem value="wave">Wave</SelectItem>
                  <SelectItem value="pulse">Pulse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignControls;
