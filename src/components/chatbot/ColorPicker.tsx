
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ColorPickerProps {
  title: string;
  onColorChange?: (color: string, opacity: number) => void;
  defaultOpacity?: number;
  defaultColor?: string;
}

const ColorPicker = ({ title, onColorChange, defaultOpacity = 100, defaultColor = 'bg-green-500' }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [opacity, setOpacity] = useState(defaultOpacity);

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

  // Trigger callback when color or opacity changes
  useEffect(() => {
    onColorChange?.(selectedColor, opacity);
  }, [selectedColor, opacity, onColorChange]);

  const handleColorSelect = (color: any) => {
    setSelectedColor(color.value);
  };

  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0];
    setOpacity(newOpacity);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{title}</Label>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <div
            key={`${title}-${color.name}`}
            className={`w-10 h-10 rounded-lg ${color.value} cursor-pointer border-2 transition-all shadow-sm ${
              selectedColor === color.value 
                ? 'border-slate-700 ring-2 ring-slate-300' 
                : 'border-transparent hover:border-slate-400'
            }`}
            onClick={() => handleColorSelect(color)}
            title={`${title}: ${color.name}`}
          />
        ))}
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-slate-600">Opacity: {opacity}%</Label>
        <Slider 
          value={[opacity]} 
          onValueChange={handleOpacityChange}
          max={100} 
          min={10}
          step={5} 
          className="w-full" 
        />
      </div>
    </div>
  );
};

export default ColorPicker;
