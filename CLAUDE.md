# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FreeFit is a Progressive Web App (PWA) for personal gym routine and nutrition tracking. The app will run on iPhone as an installable PWA, be hosted on a Raspberry Pi, and use Claude AI (Anthropic) for photo-based food recognition and nutrition label OCR.

**Key Technologies:**
- **Frontend**: React PWA (installable, offline-capable)
- **Backend**: Express server on Raspberry Pi
- **Storage**: Browser LocalStorage/IndexedDB (primary), JSON backups on Pi (daily)
- **AI**: Claude API proxied through Pi for meal photo recognition and nutrition label OCR

## Architecture

### Client-Side Storage Strategy
- **IndexedDB**: Food entries, routines, food item library (large/queryable data)
- **LocalStorage**: User preferences, daily nutrition targets, last backup timestamp, UI state

### Data Flow
1. All data lives primarily in the browser (offline-first)
2. Daily backup to Raspberry Pi (triggered on first app open after midnight)
3. AI features proxy through Pi to keep API key secure: PWA → Pi → Claude API → Pi → PWA

### Core Features
**Four primary tabs** (bottom navigation):
1. **Exercises**: Browse/filter exercise database with muscle diagram
2. **Machines**: Manage available gym equipment
3. **Routines**: Create multi-day workout routines with volume tracking
4. **Nutrition**: Food logging with AI photo recognition (3 sub-tabs: Log, Summary, History)

### Split-Screen Layout (Exercises, Machines, Routines tabs)
- **Left 60%**: Scrollable lists
- **Right 40%**: Persistent muscle diagram
- Muscle diagram highlights muscles worked with gradient based on volume
- Tapping muscle groups filters exercises

### Nutrition Tab Layout
- Full-width (no muscle diagram)
- Secondary tabs: Log (today's entries), Summary (progress bars), History (past days)

## Data Models

Key entities defined in `freefit-spec.md:477-581`:
- **Machine**: Equipment with variants and compatible exercises
- **Exercise**: Dynamic/static, compound/isolation, with primary/secondary muscles
- **Routine**: Multi-day structure with exercises, sets, reps/duration
- **Food Item**: Serving size, macros (calories, protein, fat, carbs)
- **Food Entry**: Log of consumed food with timestamp and calculated totals
- **Daily Nutrition Targets**: User's calorie and macro goals

## Muscle Groups Hierarchy

The app uses a hierarchical muscle group system (see `freefit-spec.md:78-118`):
- **Chest**: Pectoralis Major (Upper/Lower), Pectoralis Minor
- **Back**: Lats, Traps (Upper/Middle/Lower), Rhomboids, Erector Spinae
- **Shoulders**: Anterior/Lateral/Posterior Deltoid
- **Arms**: Biceps, Triceps, Forearm Flexors/Extensors
- **Legs**: Quads, Hamstrings, Glutes, Calves, Hip Adductors/Abductors
- **Core**: Rectus Abdominis, Obliques, Transverse Abdominis

**Volume Calculation Rule**: Total sets per muscle group, counting only dynamic exercises and only primary muscles worked (not secondary).

## AI Integration

### Endpoints on Raspberry Pi
```
POST /api/analyze-meal
- Body: { image: base64_encoded_image }
- Returns: { foods: [{ name, servingSize, foodItemId }] }

POST /api/analyze-nutrition-label
- Body: { image: base64_encoded_image }
- Returns: { servingSize, servingUnits, calories, protein, fat, carbs }
- OR: { error: "Could not read label" }

POST /api/backup
- Body: { timestamp, foodEntries, foodItems, routines, etc. }
- Saves to: /backups/backup_YYYY-MM-DD.json
```

### AI Usage Patterns
1. **Meal photo**: Identify foods → match to library → estimate portions → create entries
2. **Nutrition label**: OCR extraction → auto-fill food item form

## Prepopulated Data Requirements

### Exercises (50-100 items)
Cover all major muscle groups with mix of:
- Barbell: Bench Press, Squat, Deadlift, Overhead Press, Row, Curl
- Dumbbell: Press, Row, Fly, Lateral Raise, Goblet Squat
- Cable: Fly, Row, Tricep Pushdown, Face Pull
- Bodyweight: Push-up, Pull-up, Dip, Plank, Sit-up, Lunge
- Machines: Leg Press, Leg Extension/Curl, Chest Press, Lat Pulldown

### Machines (20-30 items)
- Barbell, Dumbbells, Benches (flat/adjustable)
- Power Rack, Pull-up Bar, Dip Station
- Cable Machines (single/dual/crossover)
- Leg machines, Chest machines, Back machines, Smith Machine

### Food Database (optional starting set: 20-50 items)
Users will primarily add via photo recognition, but can prepopulate common items:
- Proteins: chicken, beef, fish, eggs, tofu
- Carbs: rice, pasta, bread, oats
- Fats: oils, nuts, avocado
- Vegetables and fruits

## Development Phases

**Phase 1**: React setup, navigation tabs, basic layouts, LocalStorage/IndexedDB
**Phase 2**: Exercise/machine databases, filtering, 2D muscle diagram, highlighting logic
**Phase 3**: Routine CRUD, day/exercise structure, volume calculations
**Phase 4**: Nutrition manual entry, daily log, summary with progress bars, history
**Phase 5**: Raspberry Pi server, Claude API proxy, meal recognition, label OCR
**Phase 6**: PWA features (service worker, manifest, icons), backup system, polish
**Phase 7** (optional): 3D muscle diagram with rotation controls

## UI/UX Guidelines

### Design Aesthetic
- Clean, modern, minimal iOS-style
- Primary color: iOS blue (#007AFF)
- System font, generous spacing
- 60-80px row heights for comfortable tap targets (44x44pt minimum)

### Progress Bar Colors (Nutrition Summary)
- < 80%: Red
- 80-95%: Yellow
- 95-105%: Green
- > 105%: Orange

### Muscle Diagram States
- Default: Neutral gray outline
- Single exercise: Uniform highlight for muscles worked
- Routine overview: Gradient from darkest (highest volume) to lightest
- Selected day: Uniform highlight for muscles worked that day

## PWA Requirements

### manifest.json
```json
{
  "name": "Gym & Nutrition Tracker",
  "short_name": "Gym Tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#007AFF",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker Strategy
- Cache static assets (cache-first)
- Network-first for API calls
- Queue backup requests when offline, send when back online
- All core features work offline except AI photo recognition

## Important Implementation Notes

### Security
- API key NEVER exposed in client code (stored on Pi only)
- Sanitize all user inputs
- Rate limit AI API calls (e.g., max 10/minute)

### Performance
- Compress photos before sending to AI (max 1MB)
- Lazy load muscle diagram assets
- Debounce search/filter inputs
- Use virtual scrolling for lists with 100+ items

### Backup System
- Triggered on first app open after midnight (local time)
- Retry on next open if Pi offline
- Backs up: food logs, food items, custom exercises/machines, routines, nutrition targets
- Does NOT back up: session state, UI preferences, cached images, in-progress edits

## Reference Documentation

The complete specification is in `freefit-spec.md` (1096 lines). Key sections:
- Lines 9-30: Technical stack
- Lines 33-127: Navigation structure and layouts
- Lines 477-581: Data models with full schemas
- Lines 643-723: AI integration details and prompts
- Lines 893-946: Development workflow phases
- Lines 1032-1069: Testing checklist

## Success Criteria (MVP Complete)

1. Equipment selection from prepopulated list
2. Multi-day workout routines with exercises, sets, reps
3. Muscle diagram highlights muscles worked accurately
4. Volume per muscle group calculates correctly
5. Manual food logging with macros
6. Meal photo → AI suggestions → log entries
7. Nutrition label photo → AI extraction → food item creation
8. Daily summary with progress toward targets
9. History shows previous days' nutrition logs
10. Daily backup to Raspberry Pi
11. PWA installs to iPhone and works offline (except AI)
