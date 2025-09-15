import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ruler, ArrowUpDown } from 'lucide-react';

interface ConversionUnit {
  name: string;
  toMetric: number; // Factor to convert to base metric unit
  symbol: string;
}

interface UnitCategory {
  name: string;
  baseUnit: string;
  units: ConversionUnit[];
}

const UNIT_CATEGORIES: UnitCategory[] = [
  {
    name: 'Length',
    baseUnit: 'meter',
    units: [
      { name: 'Millimeter', toMetric: 0.001, symbol: 'mm' },
      { name: 'Centimeter', toMetric: 0.01, symbol: 'cm' },
      { name: 'Meter', toMetric: 1, symbol: 'm' },
      { name: 'Kilometer', toMetric: 1000, symbol: 'km' },
      { name: 'Inch', toMetric: 0.0254, symbol: 'in' },
      { name: 'Foot', toMetric: 0.3048, symbol: 'ft' },
      { name: 'Yard', toMetric: 0.9144, symbol: 'yd' },
      { name: 'Mile', toMetric: 1609.34, symbol: 'mi' },
    ]
  },
  {
    name: 'Weight',
    baseUnit: 'gram',
    units: [
      { name: 'Milligram', toMetric: 0.001, symbol: 'mg' },
      { name: 'Gram', toMetric: 1, symbol: 'g' },
      { name: 'Kilogram', toMetric: 1000, symbol: 'kg' },
      { name: 'Ounce', toMetric: 28.3495, symbol: 'oz' },
      { name: 'Pound', toMetric: 453.592, symbol: 'lb' },
      { name: 'Stone', toMetric: 6350.29, symbol: 'st' },
    ]
  },
  {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { name: 'Celsius', toMetric: 1, symbol: '°C' },
      { name: 'Fahrenheit', toMetric: 1, symbol: '°F' },
      { name: 'Kelvin', toMetric: 1, symbol: 'K' },
    ]
  },
  {
    name: 'Volume',
    baseUnit: 'liter',
    units: [
      { name: 'Milliliter', toMetric: 0.001, symbol: 'ml' },
      { name: 'Liter', toMetric: 1, symbol: 'l' },
      { name: 'Fluid Ounce', toMetric: 0.0295735, symbol: 'fl oz' },
      { name: 'Cup', toMetric: 0.236588, symbol: 'cup' },
      { name: 'Pint', toMetric: 0.473176, symbol: 'pt' },
      { name: 'Quart', toMetric: 0.946353, symbol: 'qt' },
      { name: 'Gallon', toMetric: 3.78541, symbol: 'gal' },
    ]
  }
];

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState('Length');
  const [amount, setAmount] = useState('1');
  const [fromUnit, setFromUnit] = useState('Meter');
  const [toUnit, setToUnit] = useState('Foot');
  const [result, setResult] = useState<number | null>(null);

  const currentCategory = UNIT_CATEGORIES.find(cat => cat.name === category);

  useEffect(() => {
    // Reset units when category changes
    if (currentCategory) {
      setFromUnit(currentCategory.units[0].name);
      setToUnit(currentCategory.units[currentCategory.units.length > 1 ? 1 : 0].name);
    }
  }, [category, currentCategory]);

  useEffect(() => {
    convertUnits();
  }, [amount, fromUnit, toUnit, category]);

  const convertUnits = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || !currentCategory) {
      setResult(null);
      return;
    }

    const fromUnitData = currentCategory.units.find(u => u.name === fromUnit);
    const toUnitData = currentCategory.units.find(u => u.name === toUnit);

    if (!fromUnitData || !toUnitData) {
      setResult(null);
      return;
    }

    let convertedValue: number;

    if (category === 'Temperature') {
      convertedValue = convertTemperature(amountNum, fromUnit, toUnit);
    } else {
      // Convert to base unit, then to target unit
      const baseValue = amountNum * fromUnitData.toMetric;
      convertedValue = baseValue / toUnitData.toMetric;
    }

    setResult(convertedValue);
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;

    // Convert to Celsius first
    switch (from) {
      case 'Celsius':
        celsius = value;
        break;
      case 'Fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'Kelvin':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'Celsius':
        return celsius;
      case 'Fahrenheit':
        return celsius * 9/5 + 32;
      case 'Kelvin':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getUnitSymbol = (unitName: string) => {
    return currentCategory?.units.find(u => u.name === unitName)?.symbol || '';
  };

  const formatResult = (value: number) => {
    if (value >= 1e6 || value <= 1e-6) {
      return value.toExponential(4);
    }
    return value.toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Unit Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNIT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.name} value={cat.name} className="text-xs">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-sm"
          />
          
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentCategory?.units.map((unit) => (
                <SelectItem key={unit.name} value={unit.name} className="text-xs">
                  {unit.name} ({unit.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapUnits}
            className="p-2"
          >
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentCategory?.units.map((unit) => (
                <SelectItem key={unit.name} value={unit.name} className="text-xs">
                  {unit.name} ({unit.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="p-3 bg-muted rounded text-center">
            {result !== null ? (
              <div className="space-y-1">
                <div className="text-lg font-semibold">
                  {formatResult(result)} {getUnitSymbol(toUnit)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {amount} {getUnitSymbol(fromUnit)} = {formatResult(result)} {getUnitSymbol(toUnit)}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Enter amount to convert
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};