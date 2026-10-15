import { Question, WordwallPair, PersonalAnalytics } from '../types';
import { INITIAL_QUESTIONS, INITIAL_WORDWALL_PAIRS } from '../data/seedData';

const QUESTIONS_KEY = 'cerdas_cermat_offline_questions_v1';
const WORDWALL_KEY = 'cerdas_cermat_offline_wordwall_v1';
const HISTORY_KEY = 'cerdas_cermat_offline_history_v1';

export function getOfflineQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading offline questions:', e);
  }
  return INITIAL_QUESTIONS;
}

export function saveOfflineQuestions(questions: Question[]) {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed saving offline questions:', e);
  }
}

export function getOfflineWordwallPairs(): WordwallPair[] {
  try {
    const raw = localStorage.getItem(WORDWALL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading offline wordwall:', e);
  }
  return INITIAL_WORDWALL_PAIRS;
}

export function saveOfflineWordwallPairs(pairs: WordwallPair[]) {
  try {
    localStorage.setItem(WORDWALL_KEY, JSON.stringify(pairs));
  } catch (e) {
    console.error('Failed saving offline wordwall:', e);
  }
}

export function savePracticeSession(analytics: PersonalAnalytics) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list: PersonalAnalytics[] = raw ? JSON.parse(raw) : [];
    list.unshift(analytics);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20)));
  } catch (e) {
    console.error('Failed saving practice session:', e);
  }
}

export function getPracticeHistory(): PersonalAnalytics[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading history:', e);
  }
  return [];
}
