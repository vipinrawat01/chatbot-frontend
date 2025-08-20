
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  title: string;
  onColorChange?: (color: string, opacity: number) => void;
  defaultColor?: string;
  currentColor?: string;
}

const ColorPicker = ({ title, onColorChange, defaultColor = '#10B981', currentColor }: ColorPickerProps) => {
  // Convert Tailwind class to hex color for the input
  const tailwindToHex = (tailwindClass: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-black': '#000000',
      'bg-white': '#FFFFFF',
      'bg-green-500': '#10B981',
      'bg-blue-500': '#3B82F6',
      'bg-purple-500': '#8B5CF6',
      'bg-orange-500': '#F97316',
      'bg-red-500': '#EF4444',
      'bg-pink-500': '#EC4899',
      'bg-indigo-500': '#6366F1',
      'bg-teal-500': '#14B8A6',
      'bg-gray-500': '#6B7280',
      'bg-slate-500': '#64748B'
    };
    return colorMap[tailwindClass] || '#10B981';
  };

  // Convert hex to Tailwind class or custom style
  const hexToTailwind = (hexColor: string) => {
    const colorMap: { [key: string]: string } = {
      '#000000': 'bg-black',
      '#FFFFFF': 'bg-white',
      '#10B981': 'bg-green-500',
      '#3B82F6': 'bg-blue-500',
      '#8B5CF6': 'bg-purple-500',
      '#F97316': 'bg-orange-500',
      '#EF4444': 'bg-red-500',
      '#EC4899': 'bg-pink-500',
      '#6366F1': 'bg-indigo-500',
      '#14B8A6': 'bg-teal-500',
      '#6B7280': 'bg-gray-500',
      '#64748B': 'bg-slate-500'
    };
    
    // If it's a known color, return the Tailwind class
    if (colorMap[hexColor]) {
      return colorMap[hexColor];
    }
    
    // For custom colors, return the hex color directly for backend processing
    return hexColor;
  };

  // Get initial hex color
  const getInitialHexColor = () => {
    if (currentColor) {
      return tailwindToHex(currentColor);
    }
    if (defaultColor) {
      return tailwindToHex(defaultColor);
    }
    return '#10B981';
  };

  const [hexColor, setHexColor] = useState(getInitialHexColor());
  const [tailwindClass, setTailwindClass] = useState(currentColor || defaultColor);

  // Update state when currentColor prop changes
  useEffect(() => {
    if (currentColor && currentColor !== tailwindClass) {
      const newHexColor = tailwindToHex(currentColor);
      setHexColor(newHexColor);
      setTailwindClass(currentColor);
    }
  }, [currentColor]);

  const handleColorChange = (newHexColor: string) => {
    setHexColor(newHexColor);
    const newTailwindClass = hexToTailwind(newHexColor);
    setTailwindClass(newTailwindClass);
    
    // Call the callback directly when color changes
    onColorChange?.(newTailwindClass, 100); // Always use 100% opacity
  };

  // Preset colors for quick selection
  const presetColors = [
    { name: 'Black', hex: '#000000', tailwind: 'bg-black' },
    { name: 'White', hex: '#FFFFFF', tailwind: 'bg-white' },
    { name: 'Green', hex: '#10B981', tailwind: 'bg-green-500' },
    { name: 'Blue', hex: '#3B82F6', tailwind: 'bg-blue-500' },
    { name: 'Purple', hex: '#8B5CF6', tailwind: 'bg-purple-500' },
    { name: 'Orange', hex: '#F97316', tailwind: 'bg-orange-500' },
    { name: 'Red', hex: '#EF4444', tailwind: 'bg-red-500' },
    { name: 'Pink', hex: '#EC4899', tailwind: 'bg-pink-500' },
    { name: 'Indigo', hex: '#6366F1', tailwind: 'bg-indigo-500' },
    { name: 'Teal', hex: '#14B8A6', tailwind: 'bg-teal-500' },
    { name: 'Gray', hex: '#6B7280', tailwind: 'bg-gray-500' },
    { name: 'Slate', hex: '#64748B', tailwind: 'bg-slate-500' }
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{title}</Label>
      
      {/* Color Input */}
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg border-2 border-slate-300 shadow-sm cursor-pointer"
          style={{ backgroundColor: hexColor }}
          onClick={() => document.getElementById(`color-input-${title}`)?.click()}
        />
        <Input
          id={`color-input-${title}`}
          type="color"
          value={hexColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-20 h-10 p-1 border rounded cursor-pointer"
        />
        <span className="text-sm text-slate-600 font-mono">{hexColor}</span>
      </div>

      {/* Preset Colors */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Quick Colors</Label>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((color) => (
            <div
              key={`${title}-preset-${color.name}`}
              className={`w-8 h-8 rounded-lg cursor-pointer border-2 transition-all shadow-sm ${
                hexColor === color.hex
                  ? 'border-slate-700 ring-2 ring-slate-300 scale-110' 
                  : 'border-transparent hover:border-slate-400 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorChange(color.hex)}
            title={`${title}: ${color.name}`}
          />
        ))}
      </div>
      </div>
    </div>
  );
};

export default ColorPicker;
