# Backend Extraction Prompt Updates

## Date: 2026-03-17

## Changes Made to `extract-plays.js`

Updated the AI prompt to better handle football playbook pages with:
- Concept-based plays (STICK, CROSS, GLANCE, SPACING, SMASH, etc.)
- Receiver numbering system (#1, #2, #3, 2-back/RB)
- Formation labels (2x2, 3x1, stacked, etc.)

## Key Improvements:

1. **Position Finding**: Clearer instructions for mapping position labels (FB, A, A-back, etc.)
2. **Route vs Blocking Detection**: Better distinction between routes (arrows with paths) and blocking (lines into defenders)
3. **Concept Extraction**: Instructions to read concept from page header
4. **Common Route Names**: Added standard football route names
5. **Blocking Descriptions**: Added common blocking terms (Kick out, Lead, Seal, Reach, etc.)

## Expected Output Format:

```json
[
  {"col1": "Formation", "col2": "Route or ''", "col3": "Concept", "col4": "Blocking or ''"}
]
```

## Notes:
- col1: Formation name (exclude year like "2026")
- col2: Route name if running a route, empty string if blocking
- col3: Concept from page header
- col4: Blocking description if blocking, empty string if running a route

## Testing:
- Vite dev server runs on localhost:3001
- Netlify functions need Netlify CLI or deployment to test
- Nodist issue prevents running `netlify dev` locally - use deployment or fix nodist

## API Key:
- MOONSHOT_API_KEY is in .env file
- Ensure environment variable is set in Netlify deployment
