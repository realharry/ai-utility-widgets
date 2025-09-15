import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Save, Eye, EyeOff, Calculator, Clock, BookOpen, Cloud, DollarSign, Ruler } from 'lucide-react';

const LLM_MODELS = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
];

const LLM_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'custom', label: 'Custom API' },
];

const AVAILABLE_WIDGETS = [
  { id: 'calculator', name: 'Calculator', icon: Calculator, description: 'Basic and scientific calculator' },
  { id: 'clock', name: 'Clock', icon: Clock, description: 'Time display, alarm, and stopwatch' },
  { id: 'dictionary', name: 'Dictionary', icon: BookOpen, description: 'English word definitions and lookup' },
  { id: 'weather', name: 'Weather', icon: Cloud, description: 'Local weather information' },
  { id: 'currency', name: 'Currency Converter', icon: DollarSign, description: 'Convert between currencies' },
  { id: 'units', name: 'Unit Converter', icon: Ruler, description: 'Convert metric and imperial units' },
];

export const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [provider, setProvider] = useState('openai');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['calculator', 'clock']);

  useEffect(() => {
    // Load saved settings with error handling
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get([
        'llmApiKey',
        'llmModel',
        'llmProvider',
        'llmCustomEndpoint',
        'selectedWidgets'
      ], (result) => {
        if (result.llmApiKey) setApiKey(result.llmApiKey);
        if (result.llmModel) setModel(result.llmModel);
        if (result.llmProvider) setProvider(result.llmProvider);
        if (result.llmCustomEndpoint) setCustomEndpoint(result.llmCustomEndpoint);
        if (result.selectedWidgets) setSelectedWidgets(result.selectedWidgets);
      });
    }
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        await chrome.storage.sync.set({
          llmApiKey: apiKey,
          llmModel: model,
          llmProvider: provider,
          llmCustomEndpoint: customEndpoint,
          selectedWidgets: selectedWidgets,
        });
        setSaveMessage('Settings saved successfully!');
      } else {
        setSaveMessage('Chrome extension storage not available. Settings cannot be saved in this context.');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const clearSettings = async () => {
    if (confirm('Are you sure you want to clear all settings?')) {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        await chrome.storage.sync.clear();
      }
      setApiKey('');
      setModel('gpt-3.5-turbo');
      setProvider('openai');
      setCustomEndpoint('');
      setSelectedWidgets(['calculator', 'clock']);
      setSaveMessage('Settings cleared successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleWidgetToggle = (widgetId: string, checked: boolean) => {
    if (checked && selectedWidgets.length < 2) {
      setSelectedWidgets([...selectedWidgets, widgetId]);
    } else if (!checked) {
      setSelectedWidgets(selectedWidgets.filter(id => id !== widgetId));
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">AI Utility Widgets - Options</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>LLM Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure your AI language model settings for the chat assistant in the side panel.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">AI Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LLM_PROVIDERS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored securely in Chrome's sync storage and never shared.
              </p>
            </div>

            {provider === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customEndpoint">Custom API Endpoint</Label>
                <Input
                  id="customEndpoint"
                  placeholder="https://api.example.com/v1/chat/completions"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full URL for your custom OpenAI-compatible API endpoint.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={saveSettings} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button variant="outline" onClick={clearSettings}>
                Clear Settings
              </Button>
            </div>

            {saveMessage && (
              <div className={`text-sm p-3 rounded ${
                saveMessage.includes('Error') 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {saveMessage}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Widget Selection</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select exactly 2 widgets to display in the side panel. This helps reduce clutter and improve usability.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {AVAILABLE_WIDGETS.map((widget) => {
                const Icon = widget.icon;
                const isSelected = selectedWidgets.includes(widget.id);
                const canSelect = selectedWidgets.length < 2 || isSelected;
                
                return (
                  <div
                    key={widget.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : canSelect 
                          ? 'border-muted hover:border-primary/50' 
                          : 'border-muted bg-muted/30 opacity-60'
                    }`}
                  >
                    <Checkbox
                      id={widget.id}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked as boolean)}
                      disabled={!canSelect}
                    />
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label
                        htmlFor={widget.id}
                        className={`font-medium ${!canSelect ? 'text-muted-foreground' : ''}`}
                      >
                        {widget.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {widget.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-blue-50 p-3 rounded text-sm">
              <strong>Selected:</strong> {selectedWidgets.length}/2 widgets
              {selectedWidgets.length === 2 && (
                <span className="text-green-600 ml-2">✓ Ready to save!</span>
              )}
              {selectedWidgets.length < 2 && (
                <span className="text-orange-600 ml-2">Select {2 - selectedWidgets.length} more widget{2 - selectedWidgets.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Get API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">OpenAI (GPT models)</h4>
              <p className="text-sm text-muted-foreground">
                1. Visit <a href="https://platform.openai.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">platform.openai.com</a><br/>
                2. Sign up or log in to your account<br/>
                3. Navigate to API Keys section<br/>
                4. Create a new API key and copy it here
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold">Anthropic (Claude models)</h4>
              <p className="text-sm text-muted-foreground">
                1. Visit <a href="https://console.anthropic.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">console.anthropic.com</a><br/>
                2. Sign up or log in to your account<br/>
                3. Go to API Keys section<br/>
                4. Generate a new API key and copy it here
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded text-sm">
              <strong>Note:</strong> API usage may incur costs based on your provider's pricing. 
              Please review the pricing details on your chosen provider's website.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Your API keys are stored locally in Chrome's secure storage</p>
              <p>• No data is sent to servers other than your chosen AI provider</p>
              <p>• Chat messages are not logged or stored permanently</p>
              <p>• You can clear all settings at any time using the button above</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};