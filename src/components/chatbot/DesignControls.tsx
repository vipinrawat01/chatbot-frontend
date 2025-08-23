
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import ColorPicker from './ColorPicker';
import BrandingOptions from './BrandingOptions';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';

interface DesignControlsProps {
  onColorChange: (color: string, opacity: number) => void;
  onUserBubbleColorChange: (color: string, opacity: number) => void;
  onAgentBubbleColorChange: (color: string, opacity: number) => void;
  onChatBackgroundColorChange: (color: string, opacity: number) => void;
  onUserTextColorChange: (color: string) => void;
  onAgentTextColorChange: (color: string) => void;
  onThemeChange: (theme: string) => void;
  onCornerRadiusChange: (radius: number) => void;
  onBubbleRadiusChange: (radius: number) => void;
  onBubbleStyleChange: (style: string) => void;
  onEffectChange: (effect: string) => void;
  onPositionChange: (position: string) => void;
  onGradientToggle: (type: string, enabled: boolean) => void;
  onBrandingChange: (branding: { enabled: boolean; text: string; link: string }) => void;
  onSizeChange: (dimension: 'width' | 'height', value: number) => void;
  onBackgroundImageChange: (imageUrl: string | null) => void;
  onVoiceToggle: (enabled: boolean) => void;
  onVoiceButtonColorChange: (color: string, opacity: number) => void;
  currentValues: {
    cornerRadius: number;
    bubbleRadius: number;
    bubbleStyle: string;
    effect: string;
    position: string;
    primaryColor: string;
    userBubbleColor: string;
    agentBubbleColor: string;
    chatBackgroundColor: string;
    userTextColor: string;
    agentTextColor: string;
    gradients: {
      header: boolean;
      userBubble: boolean;
      agentBubble: boolean;
      launcher: boolean;
    };
    width?: number;
    height?: number;
    backgroundImage?: string | null;
    voiceEnabled?: boolean;
    voiceButtonColor?: string;
    voiceButtonOpacity?: number;
  };
}

const DesignControls = ({
  onColorChange,
  onUserBubbleColorChange,
  onAgentBubbleColorChange,
  onChatBackgroundColorChange,
  onUserTextColorChange,
  onAgentTextColorChange,
  onThemeChange,
  onCornerRadiusChange,
  onBubbleRadiusChange,
  onBubbleStyleChange,
  onEffectChange,
  onPositionChange,
  onGradientToggle,
  onBrandingChange,
  onSizeChange,
  onBackgroundImageChange,
  onVoiceToggle,
  onVoiceButtonColorChange,
  currentValues
}: DesignControlsProps) => {
  const [cornerRadius, setCornerRadius] = useState(currentValues?.cornerRadius || 24);
  const [bubbleRadius, setBubbleRadius] = useState(currentValues?.bubbleRadius || 24);
  const [bubbleStyle, setBubbleStyle] = useState(currentValues?.bubbleStyle || 'rounded');
  const [selectedEffect, setSelectedEffect] = useState(currentValues?.effect || 'glass');
  const [selectedPosition, setSelectedPosition] = useState<'bottom-right' | 'bottom-left'>(currentValues?.position || 'bottom-right');
  const [selectedColor, setSelectedColor] = useState('primaryColor');
  const [selectedOpacity, setSelectedOpacity] = useState(100);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(currentValues.backgroundImage || null);

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

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImagePreview(result);
        onBackgroundImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundImage = () => {
    setBackgroundImageFile(null);
    setBackgroundImagePreview(null);
    onBackgroundImageChange(null);
  };

  return (
    <div className="space-y-6">
      {/* Size Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Size & Dimensions
          </CardTitle>
          <CardDescription>Customize the chatbot dimensions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chatbot-width">Width (px)</Label>
              <Input
                id="chatbot-width"
                type="number"
                min="280"
                max="800"
                step="10"
                value={currentValues.width || 320}
                onChange={(e) => onSizeChange('width', parseInt(e.target.value) || 320)}
                placeholder="320"
              />
              <p className="text-xs text-slate-500">Min: 280px, Max: 800px</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatbot-height">Height (px)</Label>
              <Input
                id="chatbot-height"
                type="number"
                min="300"
                max="600"
                step="10"
                value={currentValues.height || 384}
                onChange={(e) => onSizeChange('height', parseInt(e.target.value) || 384)}
                placeholder="384"
              />
              <p className="text-xs text-slate-500">Min: 300px, Max: 600px</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="space-y-3">
              {backgroundImagePreview ? (
                <div className="relative">
                  <img 
                    src={backgroundImagePreview} 
                    alt="Background preview" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={removeBackgroundImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="hidden"
                    id="background-image-upload"
                  />
                  <label htmlFor="background-image-upload" className="cursor-pointer">
                    <svg className="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-slate-600">Click to upload background image</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Scheme
          </CardTitle>
          <CardDescription>Customize the chatbot's color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Automatic Gradients - Moved above colors */}
          <div className="space-y-4">
            <h4 className="font-medium">Automatic Gradients</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Header Gradient</Label>
                <Switch 
                  defaultChecked={currentValues?.gradients?.header ?? true}
                  onCheckedChange={(checked) => onGradientToggle?.('header', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Launcher Gradient</Label>
                <Switch 
                  defaultChecked={currentValues?.gradients?.launcher ?? true}
                  onCheckedChange={(checked) => onGradientToggle?.('launcher', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">User Bubble Gradient</Label>
                <Switch 
                  defaultChecked={currentValues?.gradients?.userBubble ?? false}
                  onCheckedChange={(checked) => onGradientToggle?.('userBubble', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Agent Bubble Gradient</Label>
                <Switch 
                  defaultChecked={currentValues?.gradients?.agentBubble ?? false}
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
              currentColor={currentValues?.primaryColor}
            />
            <ColorPicker
              title="User Bubble Color"
              onColorChange={onUserBubbleColorChange}
              currentColor={currentValues?.userBubbleColor}
            />
          </div>
                     <div className="grid grid-cols-2 gap-6">
             <ColorPicker
               title="Agent Bubble Color"
               onColorChange={onAgentBubbleColorChange}
               currentColor={currentValues?.agentBubbleColor}
             />
             <ColorPicker
               title="Chat Background Color"
               onColorChange={onChatBackgroundColorChange}
               currentColor={currentValues?.chatBackgroundColor}
             />
           </div>
           
           {/* Text Colors */}
           <div className="space-y-4">
             <h4 className="font-medium">Text Colors</h4>
             <div className="grid grid-cols-2 gap-6">
               <ColorPicker
                 title="User Text Color"
                 onColorChange={onUserTextColorChange}
                 currentColor={currentValues?.userTextColor}
               />
               <ColorPicker
                 title="Agent Text Color"
                 onColorChange={onAgentTextColorChange}
                 currentColor={currentValues?.agentTextColor}
               />
             </div>
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

      {/* Voice Message Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Message Settings</CardTitle>
          <CardDescription>Customize the voice message button appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Voice Messages</Label>
            <Switch 
              defaultChecked={currentValues?.voiceEnabled ?? false}
              onCheckedChange={(checked) => onVoiceToggle?.(checked)}
            />
          </div>
          {currentValues?.voiceEnabled && (
            <div className="grid grid-cols-2 gap-6">
              <ColorPicker
                title="Voice Button Color"
                onColorChange={(color, opacity) => onVoiceButtonColorChange(color, opacity)}
                currentColor={currentValues?.voiceButtonColor}
              />
              <div className="space-y-3">
                <Label>Voice Button Opacity</Label>
                <Slider 
                  value={[currentValues?.voiceButtonOpacity || 100]} 
                  onValueChange={(value) => onVoiceButtonColorChange(currentValues?.voiceButtonColor || '', value[0])}
                  max={100} 
                  step={10} 
                  className="w-full" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignControls;
