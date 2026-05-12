import { MessageBroker } from './messageBroker';
import { getSupabaseClient, refreshStoredSession } from './supabaseClient';

const REFRESH_ALARM = 'session-refresh';

chrome.runtime.onInstalled.addListener(() => {
  console.log('NYC Renting Assistant extension installed.');
  chrome.alarms.create(REFRESH_ALARM, { periodInMinutes: 50 });
});

// Re-register alarm on SW restart (alarms survive SW death but the listener does not)
chrome.alarms.get(REFRESH_ALARM, (alarm) => {
  if (!alarm) chrome.alarms.create(REFRESH_ALARM, { periodInMinutes: 50 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === REFRESH_ALARM) {
    refreshStoredSession().catch(console.error);
  }
});

// Warm up the Supabase client and restore session on SW start
getSupabaseClient().catch(console.error);

MessageBroker.init();
