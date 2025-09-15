import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, MessageCircle, Settings } from 'lucide-react';

// Import all widgets
import { Calculator } from '@/widgets/Calculator';
import { Clock } from '@/widgets/Clock';
import { Dictionary } from '@/widgets/Dictionary';
import { Weather } from '@/widgets/Weather';
import { CurrencyConverter } from '@/widgets/CurrencyConverter';
import { UnitConverter } from '@/widgets/UnitConverter';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const SidePanel: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLlmSettings] = useState<{ apiKey?: string; model?: string }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load LLM settings from Chrome storage
    chrome.storage.sync.get(['llmApiKey', 'llmModel'], (result) => {
      setLlmSettings({
        apiKey: result.llmApiKey,
        model: result.llmModel || 'gpt-3.5-turbo'
      });
    });
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Simulate LLM response since we don't have actual API integration
      const response = await simulateLLMResponse(currentMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please check your API configuration in the options page.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateLLMResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple response generation based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('calculator') || lowerMessage.includes('math') || lowerMessage.includes('calculate')) {
      return "I can see you're asking about calculations! You can use the calculator widget above to perform basic arithmetic or switch to scientific mode for advanced operations like trigonometric functions, logarithms, and more.";
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('clock') || lowerMessage.includes('alarm')) {
      return "For time-related queries, check out the clock widget! It shows the current time, lets you set alarms, and includes a stopwatch feature for timing activities.";
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
      return "The weather widget can help you check current conditions! Enter any city name to get weather information including temperature, humidity, and wind speed.";
    }
    
    if (lowerMessage.includes('currency') || lowerMessage.includes('exchange') || lowerMessage.includes('convert money')) {
      return "Use the currency converter widget to exchange rates between different currencies. It supports major world currencies like USD, EUR, GBP, JPY, and more!";
    }
    
    if (lowerMessage.includes('convert') || lowerMessage.includes('units') || lowerMessage.includes('measurement')) {
      return "The unit converter widget can help you convert between metric and imperial units for length, weight, temperature, and volume. Very handy for international conversions!";
    }
    
    if (lowerMessage.includes('dictionary') || lowerMessage.includes('definition') || lowerMessage.includes('meaning')) {
      return "Looking up word meanings? Use the dictionary widget to search for definitions, pronunciations, and examples of English words from a comprehensive online dictionary.";
    }

    // Generic helpful responses
    const responses = [
      "I'm here to help! These utility widgets can assist with calculations, time management, weather checking, currency conversion, unit conversion, and word definitions.",
      "Feel free to use any of the widgets above for quick calculations, checking time and weather, converting currencies or units, and looking up word definitions.",
      "These widgets are designed to be helpful tools for everyday tasks. Is there a specific widget you'd like help with?",
      "I can help you understand how to use any of these utility widgets. What would you like to know more about?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-full h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">AI Utility Widgets</h1>
        <Button variant="outline" size="sm" onClick={openOptions}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Widgets Grid - 3x2 layout */}
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0 mb-4">
        <div className="h-full">
          <Calculator />
        </div>
        <div className="h-full">
          <Clock />
        </div>
        <div className="h-full">
          <Dictionary />
        </div>
        <div className="h-full">
          <Weather />
        </div>
        <div className="h-full">
          <CurrencyConverter />
        </div>
        <div className="h-full">
          <UnitConverter />
        </div>
      </div>

      {/* Chat Section */}
      <Card className="flex-shrink-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
          
          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="max-h-32 overflow-y-auto mb-3 space-y-2">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`text-xs p-2 rounded ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="text-xs p-2 rounded bg-muted mr-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Chat Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about the widgets..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !currentMessage.trim()}
              size="sm"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};