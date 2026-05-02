// RTL/Hebrew language support utility

// Detect if text contains Hebrew characters
export const isHebrewText = (text) => {
  const hebrewRegex = /[֐-׿]/g
  return hebrewRegex.test(text)
}

// Get text direction
export const getTextDirection = (text) => {
  return isHebrewText(text) ? 'rtl' : 'ltr'
}

// Detect user's language preference from browser
export const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage
  return lang.toLowerCase().startsWith('he') ? 'he' : 'en'
}

// Format text based on language
export const formatText = (text, language = 'en') => {
  const direction = language === 'he' ? 'rtl' : 'ltr'
  const align = language === 'he' ? 'right' : 'left'

  return {
    direction,
    align,
    textAlign: align,
  }
}

// Create RTL-aware CSS class
export const getRTLClass = (text) => {
  return isHebrewText(text) ? 'rtl-text' : 'ltr-text'
}

// Language labels
export const LANGUAGES = {
  en: { name: 'English', dir: 'ltr' },
  he: { name: 'עברית', dir: 'rtl' },
}

// Date formatting for RTL
export const formatDateForLanguage = (date, language = 'en') => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', options)
}

// Number formatting for RTL
export const formatNumberForLanguage = (number, language = 'en') => {
  return new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US').format(number)
}

// Store language preference
export const setLanguagePreference = (language) => {
  localStorage.setItem('preferredLanguage', language)
  document.documentElement.lang = language
  document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr'
}

// Get language preference
export const getLanguagePreference = () => {
  return localStorage.getItem('preferredLanguage') || getBrowserLanguage()
}

// Initialize RTL support on app load
export const initializeRTLSupport = () => {
  const language = getLanguagePreference()
  setLanguagePreference(language)
}

export default {
  isHebrewText,
  getTextDirection,
  getBrowserLanguage,
  formatText,
  getRTLClass,
  LANGUAGES,
  formatDateForLanguage,
  formatNumberForLanguage,
  setLanguagePreference,
  getLanguagePreference,
  initializeRTLSupport,
}
