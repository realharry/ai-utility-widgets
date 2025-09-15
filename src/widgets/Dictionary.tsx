import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Loader2 } from 'lucide-react';

interface Definition {
  definition: string;
  partOfSpeech: string;
  example?: string;
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  meanings: Definition[];
}

export const Dictionary: React.FC = () => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchWord = async () => {
    if (!word.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }

      const data = await response.json();
      const entry = data[0];
      
      const meanings: Definition[] = [];
      entry.meanings.forEach((meaning: any) => {
        meaning.definitions.forEach((def: any) => {
          meanings.push({
            definition: def.definition,
            partOfSpeech: meaning.partOfSpeech,
            example: def.example
          });
        });
      });

      setResult({
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
        meanings: meanings.slice(0, 3) // Limit to 3 definitions for space
      });
    } catch (err) {
      setError('Word not found or network error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchWord();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Dictionary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Enter word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-sm"
          />
          <Button
            onClick={searchWord}
            disabled={loading || !word.trim()}
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Search className="h-3 w-3" />
            )}
          </Button>
        </div>

        {error && (
          <div className="text-xs text-red-500 text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <div className="border-b pb-2">
              <div className="font-semibold text-sm">{result.word}</div>
              {result.phonetic && (
                <div className="text-xs text-muted-foreground">{result.phonetic}</div>
              )}
            </div>
            
            <div className="space-y-2">
              {result.meanings.map((meaning, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-xs font-medium text-primary">
                    {meaning.partOfSpeech}
                  </div>
                  <div className="text-xs">
                    {meaning.definition}
                  </div>
                  {meaning.example && (
                    <div className="text-xs text-muted-foreground italic">
                      "{meaning.example}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="text-xs text-muted-foreground text-center">
            Enter a word to see its definition
          </div>
        )}
      </CardContent>
    </Card>
  );
};