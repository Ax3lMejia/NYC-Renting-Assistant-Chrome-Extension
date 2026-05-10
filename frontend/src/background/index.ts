import { MessageBroker } from './messageBroker';
import { getSupabaseClient } from './supabaseClient';

chrome.runtime.onInstalled.addListener(() => {
  console.log('NYC Renting Assistant extension installed.');
});

// Warm up the Supabase client and restore session on SW start
getSupabaseClient().catch(console.error);

MessageBroker.init();
