import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, ArrowUpDown, Loader2 } from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExchangeRates();
  }, []);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency && rates[fromCurrency] && rates[toCurrency]) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const loadExchangeRates = async () => {
    setLoading(true);
    try {
      // Since we don't have a real API key for exchange rates, simulate data
      const simulatedRates: ExchangeRates = {
        USD: 1.0,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        AUD: 1.35,
        CAD: 1.25,
        CHF: 0.92,
        CNY: 6.45,
        INR: 74.5,
      };

      // Simulate API delay
      setTimeout(() => {
        setRates(simulatedRates);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load exchange rates');
      setLoading(false);
    }
  };

  const convertCurrency = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setResult(null);
      return;
    }

    // Convert from source currency to USD, then to target currency
    const usdAmount = amountNum / rates[fromCurrency];
    const convertedAmount = usdAmount * rates[toCurrency];
    setResult(convertedAmount);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find(c => c.code === code)?.symbol || code;
  };

  const formatAmount = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Currency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-sm"
          />
          
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code} className="text-xs">
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapCurrencies}
            className="p-2"
          >
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-2">
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code} className="text-xs">
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="p-3 bg-muted rounded text-center">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : result !== null ? (
              <div className="space-y-1">
                <div className="text-lg font-semibold">
                  {getCurrencySymbol(toCurrency)} {formatAmount(result, toCurrency)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {amount} {fromCurrency} = {formatAmount(result, toCurrency)} {toCurrency}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Enter amount to convert
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        {rates[fromCurrency] && rates[toCurrency] && (
          <div className="text-xs text-center text-muted-foreground">
            1 {fromCurrency} = {formatAmount(rates[toCurrency] / rates[fromCurrency], toCurrency)} {toCurrency}
          </div>
        )}
      </CardContent>
    </Card>
  );
};