import React, { useState, useEffect } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PaintBucket, Pipette, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ColorFormat = 'rgb' | 'hsl' | 'hsv' | 'hex';

interface ColorSelectorProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  defaultFormat?: ColorFormat;
  showAlpha?: boolean;
  label?: string;
  disabled?: boolean;
}

// Helper functions for color conversion
const hexToRgb = (hex: string): [number, number, number] => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return [r, g, b];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map(x => Math.max(0, Math.min(255, Math.round(x)))
    .toString(16)
    .padStart(2, '0'))
    .join('');
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
};

const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
  h /= 360;
  s /= 100;
  v /= 100;

  let r, g, b;
  
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0;
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  value,
  onChange,
  className,
  defaultFormat = 'rgb',
  showAlpha = false,
  label,
  disabled = false
}) => {
  const [format, setFormat] = useState<ColorFormat>(defaultFormat);
  const [rgb, setRgb] = useState<[number, number, number]>([0, 0, 0]);
  const [hex, setHex] = useState<string>('#000000');
  const [hsl, setHsl] = useState<[number, number, number]>([0, 0, 0]);
  const [hsv, setHsv] = useState<[number, number, number]>([0, 0, 0]);
  
  // Initialize color values
  useEffect(() => {
    if (value.startsWith('#')) {
      setHex(value);
      const rgbValues = hexToRgb(value);
      setRgb(rgbValues);
      setHsl(rgbToHsl(...rgbValues));
      setHsv(rgbToHsv(...rgbValues));
    } else if (value.startsWith('rgb')) {
      // Parse RGB string
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const rgbValues: [number, number, number] = [
          parseInt(match[1]), 
          parseInt(match[2]), 
          parseInt(match[3])
        ];
        setRgb(rgbValues);
        setHex(rgbToHex(...rgbValues));
        setHsl(rgbToHsl(...rgbValues));
        setHsv(rgbToHsv(...rgbValues));
      }
    }
  }, [value]);
  
  // Update all color values when RGB changes
  const updateFromRgb = (r: number, g: number, b: number) => {
    const rgbValues: [number, number, number] = [r, g, b];
    setRgb(rgbValues);
    setHex(rgbToHex(...rgbValues));
    setHsl(rgbToHsl(...rgbValues));
    setHsv(rgbToHsv(...rgbValues));
    
    // Emit color based on the selected format
    switch (format) {
      case 'rgb': onChange(`rgb(${r}, ${g}, ${b})`); break;
      case 'hex': onChange(rgbToHex(r, g, b)); break;
      case 'hsl': 
        const [h, s, l] = rgbToHsl(r, g, b);
        onChange(`hsl(${h}, ${s}%, ${l}%)`);
        break;
      case 'hsv':
        const [hv, sv, v] = rgbToHsv(r, g, b);
        onChange(`hsv(${hv}, ${sv}%, ${v}%)`);
        break;
    }
  };
  
  // Copy color to clipboard
  const copyToClipboard = () => {
    let colorString = '';
    switch (format) {
      case 'rgb': colorString = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`; break;
      case 'hex': colorString = hex; break;
      case 'hsl': colorString = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`; break;
      case 'hsv': colorString = `hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)`; break;
    }
    
    navigator.clipboard.writeText(colorString)
      .catch(err => console.error('Failed to copy: ', err));
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "h-8 w-14 border-input flex justify-center items-center",
            className
          )}
          disabled={disabled}
        >
          <div
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` }}
          />
          {label && <span className="ml-2 text-xs">{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <Tabs defaultValue={format} onValueChange={(v) => setFormat(v as ColorFormat)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="rgb">RGB</TabsTrigger>
              <TabsTrigger value="hex">HEX</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
              <TabsTrigger value="hsv">HSV</TabsTrigger>
            </TabsList>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={copyToClipboard}
              title="Copy color value"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Color preview */}
          <div 
            className="h-24 mb-4 rounded-md flex flex-col justify-end p-2"
            style={{ backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` }}
          >
            <div className="bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded-sm text-xs backdrop-blur-sm">
              {format === 'rgb' && `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}
              {format === 'hex' && hex}
              {format === 'hsl' && `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`}
              {format === 'hsv' && `hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)`}
            </div>
          </div>
          
          {/* RGB Controls */}
          <TabsContent value="rgb">
            <div className="space-y-2">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="r" className="text-red-500">R</Label>
                <Slider
                  id="r"
                  className="col-span-2"
                  min={0}
                  max={255}
                  step={1}
                  value={[rgb[0]]}
                  onValueChange={([val]) => updateFromRgb(val, rgb[1], rgb[2])}
                />
                <Input
                  type="number"
                  min={0}
                  max={255}
                  className="h-8"
                  value={rgb[0]}
                  onChange={(e) => updateFromRgb(
                    parseInt(e.target.value) || 0,
                    rgb[1],
                    rgb[2]
                  )}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="g" className="text-green-500">G</Label>
                <Slider
                  id="g"
                  className="col-span-2"
                  min={0}
                  max={255}
                  step={1}
                  value={[rgb[1]]}
                  onValueChange={([val]) => updateFromRgb(rgb[0], val, rgb[2])}
                />
                <Input
                  type="number"
                  min={0}
                  max={255}
                  className="h-8"
                  value={rgb[1]}
                  onChange={(e) => updateFromRgb(
                    rgb[0],
                    parseInt(e.target.value) || 0,
                    rgb[2]
                  )}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="b" className="text-blue-500">B</Label>
                <Slider
                  id="b"
                  className="col-span-2"
                  min={0}
                  max={255}
                  step={1}
                  value={[rgb[2]]}
                  onValueChange={([val]) => updateFromRgb(rgb[0], rgb[1], val)}
                />
                <Input
                  type="number"
                  min={0}
                  max={255}
                  className="h-8"
                  value={rgb[2]}
                  onChange={(e) => updateFromRgb(
                    rgb[0],
                    rgb[1],
                    parseInt(e.target.value) || 0
                  )}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* HEX Controls */}
          <TabsContent value="hex">
            <div className="space-y-2">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="hex">Hex</Label>
                <Input
                  id="hex"
                  className="col-span-3 h-8"
                  value={hex}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setHex(val);
                      if (val.length === 7) {
                        const rgbValues = hexToRgb(val);
                        updateFromRgb(...rgbValues);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* HSL Controls */}
          <TabsContent value="hsl">
            <div className="space-y-2">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="h">H</Label>
                <Slider
                  id="h"
                  className="col-span-2"
                  min={0}
                  max={360}
                  step={1}
                  value={[hsl[0]]}
                  onValueChange={([val]) => {
                    const rgbValues = hslToRgb(val, hsl[1], hsl[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
                <Input
                  type="number"
                  min={0}
                  max={360}
                  className="h-8"
                  value={hsl[0]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const rgbValues = hslToRgb(val, hsl[1], hsl[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="s">S</Label>
                <Slider
                  id="s"
                  className="col-span-2"
                  min={0}
                  max={100}
                  step={1}
                  value={[hsl[1]]}
                  onValueChange={([val]) => {
                    const rgbValues = hslToRgb(hsl[0], val, hsl[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="h-8"
                  value={hsl[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const rgbValues = hslToRgb(hsl[0], val, hsl[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="l">L</Label>
                <Slider
                  id="l"
                  className="col-span-2"
                  min={0}
                  max={100}
                  step={1}
                  value={[hsl[2]]}
                  onValueChange={([val]) => {
                    const rgbValues = hslToRgb(hsl[0], hsl[1], val);
                    updateFromRgb(...rgbValues);
                  }}
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="h-8"
                  value={hsl[2]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const rgbValues = hslToRgb(hsl[0], hsl[1], val);
                    updateFromRgb(...rgbValues);
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* HSV Controls */}
          <TabsContent value="hsv">
            <div className="space-y-2">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="hv">H</Label>
                <Slider
                  id="hv"
                  className="col-span-2"
                  min={0}
                  max={360}
                  step={1}
                  value={[hsv[0]]}
                  onValueChange={([val]) => {
                    const rgbValues = hsvToRgb(val, hsv[1], hsv[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
                <Input
                  type="number"
                  min={0}
                  max={360}
                  className="h-8"
                  value={hsv[0]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const rgbValues = hsvToRgb(val, hsv[1], hsv[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="sv">S</Label>
                <Slider
                  id="sv"
                  className="col-span-2"
                  min={0}
                  max={100}
                  step={1}
                  value={[hsv[1]]}
                  onValueChange={([val]) => {
                    const rgbValues = hsvToRgb(hsv[0], val, hsv[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="h-8"
                  value={hsv[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const rgbValues = hsvToRgb(hsv[0], val, hsv[2]);
                    updateFromRgb(...rgbValues);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="v">V</Label>
                <Slider
                  id="v"
                  className="col-span-2"
                  min={0}
                  max={100}
                  step={1}
                  value={[hsv[2]]}
                  onValueChange={([val]) => {
                    const rgbValues = hsvToRgb(hsv[0], hsv[1], val);
                    updateFromRgb(...rgbValues);
                  }}
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="h-8"
                  value={hsv[2]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const rgbValues = hsvToRgb(hsv[0], hsv[1], val);
                    updateFromRgb(...rgbValues);
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ColorSelector;