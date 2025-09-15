import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Calculator as CalculatorIcon } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isScientific, setIsScientific] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      case '=': return secondValue;
      case 'sin': return Math.sin(secondValue * Math.PI / 180);
      case 'cos': return Math.cos(secondValue * Math.PI / 180);
      case 'tan': return Math.tan(secondValue * Math.PI / 180);
      case 'log': return Math.log10(secondValue);
      case 'ln': return Math.log(secondValue);
      case '√': return Math.sqrt(secondValue);
      case 'x²': return secondValue * secondValue;
      default: return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performScientificOperation = (op: string) => {
    const inputValue = parseFloat(display);
    const result = calculate(0, inputValue, op);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalculatorIcon className="h-4 w-4" />
            Calculator
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs">Scientific</span>
            <Switch
              checked={isScientific}
              onCheckedChange={setIsScientific}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="p-3 bg-muted rounded text-right font-mono text-lg">
          {display}
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          <Button variant="outline" onClick={clear} className="text-xs">
            C
          </Button>
          <Button variant="outline" onClick={() => inputOperation('÷')} className="text-xs">
            ÷
          </Button>
          <Button variant="outline" onClick={() => inputOperation('×')} className="text-xs">
            ×
          </Button>
          <Button variant="outline" onClick={() => setDisplay(display.slice(0, -1) || '0')} className="text-xs">
            ⌫
          </Button>

          <Button variant="outline" onClick={() => inputNumber('7')} className="text-xs">
            7
          </Button>
          <Button variant="outline" onClick={() => inputNumber('8')} className="text-xs">
            8
          </Button>
          <Button variant="outline" onClick={() => inputNumber('9')} className="text-xs">
            9
          </Button>
          <Button variant="outline" onClick={() => inputOperation('-')} className="text-xs">
            -
          </Button>

          <Button variant="outline" onClick={() => inputNumber('4')} className="text-xs">
            4
          </Button>
          <Button variant="outline" onClick={() => inputNumber('5')} className="text-xs">
            5
          </Button>
          <Button variant="outline" onClick={() => inputNumber('6')} className="text-xs">
            6
          </Button>
          <Button variant="outline" onClick={() => inputOperation('+')} className="text-xs">
            +
          </Button>

          <Button variant="outline" onClick={() => inputNumber('1')} className="text-xs">
            1
          </Button>
          <Button variant="outline" onClick={() => inputNumber('2')} className="text-xs">
            2
          </Button>
          <Button variant="outline" onClick={() => inputNumber('3')} className="text-xs">
            3
          </Button>
          <Button variant="default" onClick={performCalculation} className="text-xs row-span-2">
            =
          </Button>

          <Button variant="outline" onClick={() => inputNumber('0')} className="text-xs col-span-2">
            0
          </Button>
          <Button variant="outline" onClick={() => inputNumber('.')} className="text-xs">
            .
          </Button>
        </div>

        {isScientific && (
          <div className="grid grid-cols-4 gap-1 mt-2">
            <Button variant="secondary" onClick={() => performScientificOperation('sin')} className="text-xs">
              sin
            </Button>
            <Button variant="secondary" onClick={() => performScientificOperation('cos')} className="text-xs">
              cos
            </Button>
            <Button variant="secondary" onClick={() => performScientificOperation('tan')} className="text-xs">
              tan
            </Button>
            <Button variant="secondary" onClick={() => performScientificOperation('log')} className="text-xs">
              log
            </Button>
            
            <Button variant="secondary" onClick={() => performScientificOperation('ln')} className="text-xs">
              ln
            </Button>
            <Button variant="secondary" onClick={() => performScientificOperation('√')} className="text-xs">
              √
            </Button>
            <Button variant="secondary" onClick={() => performScientificOperation('x²')} className="text-xs">
              x²
            </Button>
            <Button variant="secondary" onClick={() => inputNumber(String(Math.PI))} className="text-xs">
              π
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};