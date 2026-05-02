# RTL (Right-to-Left) & Hebrew Language Support

This app includes built-in support for right-to-left (RTL) languages like Hebrew. The RTL system automatically detects the user's language preference and adjusts the entire UI accordingly.

## Features

✅ Automatic Hebrew text detection
✅ Browser language detection
✅ Language preference persistence
✅ RTL-aware CSS styling
✅ Proper date & number formatting
✅ Language switching capabilities
✅ Responsive RTL layouts

---

## How It Works

### 1. Automatic Detection

The app automatically detects Hebrew text and adjusts the UI:

```javascript
import { isHebrewText, getTextDirection } from './utils/rtl'

const text = "שלום עולם"
isHebrewText(text) // returns true
getTextDirection(text) // returns 'rtl'
```

### 2. Language Preference

The app remembers the user's language choice:

```javascript
import { setLanguagePreference, getLanguagePreference } from './utils/rtl'

// Set preference
setLanguagePreference('he') // Hebrew
setLanguagePreference('en') // English

// Get preference
const lang = getLanguagePreference() // 'he' or 'en'
```

### 3. Browser Language Detection

Automatically detects browser language:

```javascript
import { getBrowserLanguage } from './utils/rtl'

getBrowserLanguage() // 'he', 'en', etc.
```

---

## Using RTL in Components

### Basic Usage

```jsx
import { formatText, getLanguagePreference } from '../utils/rtl'

export default function MyComponent() {
  const language = getLanguagePreference()
  const styles = formatText("some text", language)

  return (
    <div style={styles}>
      {/* This div will be RTL if language is 'he' */}
      Hello World
    </div>
  )
}
```

### CSS Classes

The app provides RTL-aware CSS classes:

```jsx
import { getRTLClass } from '../utils/rtl'

export default function TextBlock({ content }) {
  return (
    <p className={getRTLClass(content)}>
      {content}
    </p>
  )
}
```

### Date Formatting

Properly formatted dates for each language:

```javascript
import { formatDateForLanguage } from '../utils/rtl'

const date = new Date('2024-04-30')

formatDateForLanguage(date, 'en')  // "April 30, 2024"
formatDateForLanguage(date, 'he')  // "30 באפריל 2024"
```

### Number Formatting

Proper number formatting with language-specific separators:

```javascript
import { formatNumberForLanguage } from '../utils/rtl'

formatNumberForLanguage(1234.56, 'en')  // "1,234.56"
formatNumberForLanguage(1234.56, 'he')  // "1,234.56"
```

---

## Creating a Language Switcher

To add a language switcher to your navbar:

```jsx
import { LANGUAGES, setLanguagePreference, getLanguagePreference } from '../utils/rtl'

export default function LanguageSwitcher() {
  const currentLanguage = getLanguagePreference()

  return (
    <div className="language-selector">
      {Object.entries(LANGUAGES).map(([code, { name }]) => (
        <button
          key={code}
          className={`language-option ${currentLanguage === code ? 'active' : ''}`}
          onClick={() => setLanguagePreference(code)}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
```

---

## CSS Styling for RTL

The app includes comprehensive RTL CSS in `src/rtl.css`. Some examples:

```css
/* Direction handling */
body[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

body[dir="ltr"] {
  direction: ltr;
  text-align: left;
}

/* Component RTL adjustments */
[dir="rtl"] .navbar {
  flex-direction: row-reverse;
}

[dir="rtl"] .card {
  text-align: right;
}
```

---

## Global Language Labels

The app includes language definitions:

```javascript
import { LANGUAGES } from './utils/rtl'

LANGUAGES.en // { name: 'English', dir: 'ltr' }
LANGUAGES.he // { name: 'עברית', dir: 'rtl' }
```

---

## Implementation Checklist

When using RTL in your components:

- [ ] Import RTL utilities from `./utils/rtl`
- [ ] Use `getLanguagePreference()` to get current language
- [ ] Apply `[dir="rtl"]` or `[dir="ltr"]` to parent elements
- [ ] Use CSS selectors like `[dir="rtl"] .component` for RTL-specific styles
- [ ] Test with both English and Hebrew content
- [ ] Ensure forms and inputs work correctly in both directions
- [ ] Test responsive layouts on mobile in both RTL and LTR

---

## Add More Languages

To add support for more languages (Arabic, Urdu, etc.):

### 1. Update `src/utils/rtl.js`:

```javascript
export const LANGUAGES = {
  en: { name: 'English', dir: 'ltr' },
  he: { name: 'עברית', dir: 'rtl' },
  ar: { name: 'العربية', dir: 'rtl' },  // Add Arabic
  ur: { name: 'اردو', dir: 'rtl' },     // Add Urdu
}
```

### 2. Update `src/utils/rtl.js` detection:

```javascript
export const isHebrewText = (text) => {
  const hebrewRegex = /[֐-׿]/g
  return hebrewRegex.test(text)
}

export const isArabicText = (text) => {
  const arabicRegex = /[؀-ۿ]/g
  return arabicRegex.test(text)
}

export const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage
  const langCode = lang.toLowerCase().split('-')[0]
  return ['he', 'ar', 'ur'].includes(langCode) ? langCode : 'en'
}
```

---

## Testing RTL

### Manual Testing

1. Open app in browser
2. Open DevTools Console
3. Run: `document.documentElement.dir = 'rtl'`
4. Verify all UI elements are properly aligned
5. Test form inputs and buttons
6. Test navigation and dropdowns

### Automated Testing

```javascript
import { isHebrewText, getTextDirection } from './utils/rtl'

describe('RTL Utilities', () => {
  it('detects Hebrew text', () => {
    expect(isHebrewText('שלום')).toBe(true)
    expect(isHebrewText('Hello')).toBe(false)
  })

  it('returns correct direction', () => {
    expect(getTextDirection('שלום')).toBe('rtl')
    expect(getTextDirection('Hello')).toBe('ltr')
  })
})
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Text not appearing in RTL | Check `[dir="rtl"]` attribute on parent |
| Buttons misaligned | Use flex-direction: row-reverse in RTL mode |
| Input boxes not right-aligned | Add `[dir="rtl"] input { text-align: right; }` |
| Icons appearing in wrong side | Use margin-left in LTR, margin-right in RTL |

---

## Performance

- RTL detection is performed once on app load
- Language preference is cached in localStorage
- Minimal CSS overhead (only attribute selectors)
- No JavaScript runtime overhead after initialization

---

Enjoy building multilingual apps! 🌍
