
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface BrandingOptionsProps {
  onBrandingChange?: (branding: { enabled: boolean; text: string; link: string }) => void;
}

const BrandingOptions = ({ onBrandingChange }: BrandingOptionsProps) => {
  const [brandingEnabled, setBrandingEnabled] = useState(true);
  const [brandingText, setBrandingText] = useState('Powered by Your Company');
  const [brandingLink, setBrandingLink] = useState('https://yourcompany.com');

  const handleBrandingToggle = (enabled: boolean) => {
    setBrandingEnabled(enabled);
    onBrandingChange?.({
      enabled,
      text: brandingText,
      link: brandingLink
    });
  };

  const handleTextChange = (text: string) => {
    setBrandingText(text);
    onBrandingChange?.({
      enabled: brandingEnabled,
      text,
      link: brandingLink
    });
  };

  const handleLinkChange = (link: string) => {
    setBrandingLink(link);
    onBrandingChange?.({
      enabled: brandingEnabled,
      text: brandingText,
      link
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Branding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Show Company Branding</Label>
            <p className="text-sm text-slate-600">Display your company name below the chat input</p>
          </div>
          <Switch 
            checked={brandingEnabled}
            onCheckedChange={handleBrandingToggle}
          />
        </div>
        
        {brandingEnabled && (
          <div className="space-y-4 pl-4 border-l-2 border-green-200">
            <div className="space-y-2">
              <Label>Branding Text</Label>
              <Input 
                placeholder="Powered by Your Company"
                value={brandingText}
                onChange={(e) => handleTextChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Company Link (Optional)</Label>
              <Input 
                placeholder="https://yourcompany.com"
                value={brandingLink}
                onChange={(e) => handleLinkChange(e.target.value)}
              />
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">Preview:</p>
              <div className="text-xs text-slate-500 text-center">
                {brandingLink ? (
                  <a href={brandingLink} className="hover:underline">
                    {brandingText}
                  </a>
                ) : (
                  brandingText
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandingOptions;
