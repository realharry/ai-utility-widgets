import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock as ClockIcon, Play, Pause, Square, AlarmClock } from 'lucide-react';

export const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mode, setMode] = useState<'clock' | 'alarm' | 'stopwatch'>('clock');
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  useEffect(() => {
    // Check for alarm
    if (isAlarmSet && alarmTime) {
      const [hours, minutes] = alarmTime.split(':').map(Number);
      const now = new Date();
      if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === 0) {
        alert('Alarm! Time is up!');
        setIsAlarmSet(false);
      }
    }
  }, [currentTime, isAlarmSet, alarmTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const setAlarm = () => {
    if (alarmTime) {
      setIsAlarmSet(true);
      // Create Chrome alarm if available
      if (typeof chrome !== 'undefined' && chrome.alarms && chrome.alarms.create) {
        chrome.alarms.create('widget-alarm', {
          when: Date.now() + 1000 // For demo, set 1 second from now
        });
      }
    }
  };

  const clearAlarm = () => {
    setIsAlarmSet(false);
    setAlarmTime('');
    if (typeof chrome !== 'undefined' && chrome.alarms && chrome.alarms.clear) {
      chrome.alarms.clear('widget-alarm');
    }
  };

  const startStopwatch = () => {
    setIsStopwatchRunning(true);
  };

  const pauseStopwatch = () => {
    setIsStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    setStopwatchTime(0);
    setIsStopwatchRunning(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          Clock
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant={mode === 'clock' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('clock')}
            className="text-xs"
          >
            Time
          </Button>
          <Button
            variant={mode === 'alarm' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('alarm')}
            className="text-xs"
          >
            Alarm
          </Button>
          <Button
            variant={mode === 'stopwatch' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('stopwatch')}
            className="text-xs"
          >
            Timer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mode === 'clock' && (
          <div className="text-center space-y-2">
            <div className="text-lg font-mono">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        )}

        {mode === 'alarm' && (
          <div className="space-y-3">
            <div className="text-center text-sm">
              Current: {formatTime(currentTime)}
            </div>
            <div className="space-y-2">
              <Input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                className="text-center"
              />
              <div className="flex gap-2">
                <Button
                  onClick={setAlarm}
                  disabled={!alarmTime || isAlarmSet}
                  size="sm"
                  className="flex-1 text-xs"
                >
                  <AlarmClock className="h-3 w-3 mr-1" />
                  Set
                </Button>
                <Button
                  onClick={clearAlarm}
                  disabled={!isAlarmSet}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  Clear
                </Button>
              </div>
              {isAlarmSet && (
                <div className="text-xs text-center text-green-600">
                  Alarm set for {alarmTime}
                </div>
              )}
            </div>
          </div>
        )}

        {mode === 'stopwatch' && (
          <div className="space-y-3">
            <div className="text-center text-xl font-mono">
              {formatStopwatch(stopwatchTime)}
            </div>
            <div className="flex gap-2">
              {!isStopwatchRunning ? (
                <Button
                  onClick={startStopwatch}
                  size="sm"
                  className="flex-1 text-xs"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={pauseStopwatch}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </Button>
              )}
              <Button
                onClick={resetStopwatch}
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
              >
                <Square className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};