// Background script for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  // Enable the side panel on all sites by default
  chrome.sidePanel.setOptions({
    enabled: true
  });
});

// Handle action button click to open side panel
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Handle alarm events for the alarm clock widget
chrome.alarms.onAlarm.addListener((alarm) => {
  // Send message to side panel about alarm
  chrome.runtime.sendMessage({
    type: 'ALARM_TRIGGERED',
    alarmName: alarm.name
  });
});