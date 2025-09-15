// Background script for the Chrome extension
chrome.runtime.onInstalled.addListener(async () => {
  // Set the action to open side panel by default
  await chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true
  });
  
  // Enable the side panel globally
  chrome.sidePanel.setOptions({
    enabled: true
  });
});

// Handle alarm events for the alarm clock widget
chrome.alarms.onAlarm.addListener((alarm) => {
  // Send message to side panel about alarm
  chrome.runtime.sendMessage({
    type: 'ALARM_TRIGGERED',
    alarmName: alarm.name
  });
});