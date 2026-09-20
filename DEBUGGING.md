# Debugging Journal

## Bug 1 — Products list crashed

### Symptom
The product list crashed when products was null.

### Tool
React DevTools / browser console.

### What it showed
The products value was null when `.map()` was called.

### Fix
Changed the state back to:

useState<Product[]>([])

---

## Bug 2 — Wrong product prop

### Symptom
TypeScript showed an error on ProductCard.

### Tool
TypeScript / VS Code.

### What it showed
ProductCard expected PublicProduct but received a string.

### Fix
Passed the complete product object.

---

## Bug 3 — API request failed

### Symptom
Products did not load.

### Tool
Browser DevTools Network tab.

### What it showed
The API request returned an error.

### Fix
Changed the incorrect URL to the correct API endpoint.

