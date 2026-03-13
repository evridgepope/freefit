# FreeFit System Architecture

## Overview

FreeFit uses a hybrid client-server architecture where the app works primarily offline with periodic cloud connectivity for AI features and backups.

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       User's iPhone                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │              FreeFit PWA (React)                       │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  UI Layer (Components & Pages)                   │ │ │
│  │  │  - ExercisesPage, MachinesPage, RoutinesPage     │ │ │
│  │  │  - NutritionPage (Log, Summary, History)         │ │ │
│  │  │  - ImageMuscleDiagram                            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                          ↕                             │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Data Layer                                      │ │ │
│  │  │  - IndexedDB (food logs, routines, food items)  │ │ │
│  │  │  - LocalStorage (preferences, UI state)         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  API Service Layer                               │ │ │
│  │  │  - sendBackup()                                  │ │ │
│  │  │  - analyzeMealPhoto()                            │ │ │
│  │  │  - analyzeNutritionLabel()                       │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │ WiFi
                           │ (Same Network or Internet)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Raspberry Pi (Home)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │           Express Server (Node.js)                     │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  API Endpoints                                   │ │ │
│  │  │  ┌─────────────────────────────────────────────┐│ │ │
│  │  │  │  POST /api/backup                           ││ │ │
│  │  │  │  → Save to backups/backup_YYYY-MM-DD.json   ││ │ │
│  │  │  └─────────────────────────────────────────────┘│ │ │
│  │  │                                                   │ │ │
│  │  │  ┌─────────────────────────────────────────────┐│ │ │
│  │  │  │  POST /api/analyze-meal                     ││ │ │
│  │  │  │  → Forward image to Claude API              ││ │ │
│  │  │  │  → Parse and return food list               ││ │ │
│  │  │  └─────────────────────────────────────────────┘│ │ │
│  │  │                                                   │ │ │
│  │  │  ┌─────────────────────────────────────────────┐│ │ │
│  │  │  │  POST /api/analyze-nutrition-label          ││ │ │
│  │  │  │  → Forward image to Claude API              ││ │ │
│  │  │  │  → Parse and return nutrition facts         ││ │ │
│  │  │  └─────────────────────────────────────────────┘│ │ │
│  │  │                                                   │ │ │
│  │  │  ┌─────────────────────────────────────────────┐│ │ │
│  │  │  │  GET /api/health                            ││ │ │
│  │  │  │  GET /api/backups                           ││ │ │
│  │  │  └─────────────────────────────────────────────┘│ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                          ↕                             │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Middleware                                      │ │ │
│  │  │  - CORS, Helmet (security)                      │ │ │
│  │  │  - Rate limiting (10 req/min for AI)            │ │ │
│  │  │  - JSON parser (50MB limit)                     │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                          ↕                             │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  File System                                     │ │ │
│  │  │  - backups/ (JSON files)                        │ │ │
│  │  │  - dist/ (PWA static files)                     │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS
                           │ (Secure API calls)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│              Anthropic Claude API (Cloud)                   │
│                                                              │
│  - Claude 3.5 Sonnet model                                  │
│  - Vision capabilities for image analysis                   │
│  - Returns structured JSON responses                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### Pattern 1: Offline First (Default)

```
User Action (Log Food, Create Routine, etc.)
    ↓
Update UI immediately
    ↓
Write to IndexedDB/LocalStorage
    ↓
Done! (No network needed)
```

**Benefits:**
- Instant response
- Works without internet
- No server dependency

### Pattern 2: Daily Backup

```
App Opens
    ↓
Check last backup date in LocalStorage
    ↓
Is it past midnight? ───No───→ Continue
    ↓ Yes
Collect all data (food logs, routines, etc.)
    ↓
POST /api/backup
    ↓
Save timestamp on success
    ↓
Continue (app still works if backup fails)
```

**Timing:**
- Triggered: First app open after midnight
- Frequency: Once per 24 hours
- Retry: On next open if failed

### Pattern 3: Meal Photo Recognition

```
User taps camera button
    ↓
Take photo / Select from gallery
    ↓
Compress image to <1MB (client-side)
    ↓
Show loading spinner
    ↓
POST /api/analyze-meal with base64 image
    ↓
Server forwards to Claude API
    ↓
Claude analyzes image → returns food list
    ↓
Server parses and validates JSON
    ↓
Client receives foods array
    ↓
Show preview modal with identified foods
    ↓
User adjusts servings
    ↓
Save to IndexedDB
    ↓
Update UI
```

**Offline behavior:**
- Camera button disabled if server offline
- Show "AI features require connection" message

### Pattern 4: Nutrition Label OCR

```
User in "Add Food Item" form
    ↓
Taps camera button (nutrition label)
    ↓
Take photo of label
    ↓
Compress image
    ↓
Show loading spinner
    ↓
POST /api/analyze-nutrition-label
    ↓
Server forwards to Claude API
    ↓
Claude extracts nutrition facts
    ↓
Server validates and returns data
    ↓
Client auto-fills form fields (except name)
    ↓
User reviews and edits
    ↓
Saves to IndexedDB
```

**Error handling:**
- If OCR fails → "Could not read label"
- User can enter manually

## Component Hierarchy

```
App.jsx
├── State Management (useState, useEffect)
│   ├── Current tab
│   ├── Selected data (routine, exercise, etc.)
│   └── Backup logic
│
├── BottomNav.jsx
│   └── Navigation tabs (Exercises, Machines, Routines, Nutrition)
│
├── ExercisesPage.jsx
│   ├── SplitLayout
│   │   ├── ExerciseList (60%)
│   │   │   ├── Search/filter controls
│   │   │   └── Exercise entries (expandable)
│   │   └── ImageMuscleDiagram (40%)
│
├── MachinesPage.jsx
│   ├── SplitLayout
│   │   ├── MachineList (60%)
│   │   │   └── Machine entries (expandable for variants)
│   │   └── ImageMuscleDiagram (40%) [no highlighting]
│
├── RoutinesPage.jsx
│   ├── SplitLayout
│   │   ├── RoutineList / RoutineDetail (60%)
│   │   │   ├── Routine selector
│   │   │   ├── Day headers (collapsible)
│   │   │   └── Exercise entries per day
│   │   └── ImageMuscleDiagram (40%)
│   │       ├── Volume gradient (overview)
│   │       └── Day highlights (day view)
│
└── NutritionPage.jsx
    ├── Secondary tabs (Log | Summary | History)
    │
    ├── NutritionLog (default)
    │   ├── Food entry list
    │   ├── Add button → Food library
    │   └── Camera button → analyzeMealPhoto()
    │
    ├── NutritionSummary
    │   ├── Progress bars (Calories, Protein, Carbs, Fats)
    │   └── Daily targets (editable)
    │
    └── NutritionHistory
        └── Previous days list → NutritionLog (read-only)
```

## Storage Strategy

### IndexedDB (Large/Complex Data)

**Stores:**
```javascript
// Food Entries (queryable by date)
FoodEntryStore {
  id, foodItemId, servings, timestamp, date,
  totalCalories, totalProtein, totalFat, totalCarbs
}

// Food Items (searchable library)
FoodItemStore {
  id, name, servingSize, servingUnits,
  caloriesPerServing, proteinPerServing, fatPerServing, carbsPerServing,
  isCustom, createdAt
}

// Routines (nested structure)
RoutineStore {
  id, name, numDays, days: [
    { dayNumber, exercises: [
      { exerciseId, machineId, sets: [{ reps/duration }] }
    ]}
  ],
  createdAt, updatedAt
}
```

### LocalStorage (Simple/Small Data)

**Stores:**
```javascript
// User preferences
localStorage.setItem('selectedMachines', JSON.stringify([...]))

// Nutrition targets
localStorage.setItem('nutritionTargets', JSON.stringify({
  caloriesTarget, proteinTarget, carbsTarget, fatsTarget
}))

// Backup timestamp
localStorage.setItem('lastBackupDate', '2026-01-26')

// UI state
localStorage.setItem('currentTab', 'nutrition')
localStorage.setItem('muscleDiagramView', 'front')
```

## Network Topology

### Local Network (Development)

```
[iPhone: 192.168.1.50] ─WiFi─> [Pi: 192.168.1.100:3000]
                                         │
                                         └─Internet─> [Claude API]
```

### External Access (Optional)

```
[iPhone: Cellular]
    │
    └─Internet─> [Router: public-ip:3000]
                       │
                       └─Port Forward─> [Pi: 192.168.1.100:3000]
                                               │
                                               └─Internet─> [Claude API]
```

### With HTTPS/Nginx (Recommended)

```
[iPhone] ─HTTPS─> [Router:443]
                       │
                       └─Port 443─> [Pi: nginx:443]
                                         │
                                         └─Proxy─> [localhost:3000]
                                                         │
                                                         └─HTTPS─> [Claude API]
```

## Security Layers

### 1. API Key Protection
- ✅ Stored in `.env` on Pi only
- ✅ Never in frontend code
- ✅ Not logged or exposed
- ✅ Git ignored

### 2. Network Security
- ✅ HTTPS (with nginx)
- ✅ Firewall (ufw)
- ✅ Rate limiting (10 req/min AI)
- ✅ Helmet.js headers

### 3. Input Validation
- ✅ Base64 format check
- ✅ Image size limits (50MB)
- ✅ JSON structure validation
- ✅ CORS configuration

### 4. Error Handling
- ✅ No sensitive data in errors
- ✅ Generic error messages to client
- ✅ Detailed logs on server only
- ✅ Graceful degradation

## Performance Considerations

### Client-Side
- **Image compression**: Reduce to <1MB before upload
- **Lazy loading**: Load muscle diagram assets on demand
- **Debouncing**: Search/filter inputs (300ms)
- **Virtual scrolling**: Long lists (100+ items)
- **Caching**: Cache API responses where appropriate

### Server-Side
- **Rate limiting**: Prevent API abuse
- **Request size**: 50MB limit for images
- **Async operations**: Non-blocking I/O
- **PM2 clustering**: Use multiple cores (optional)

### Network
- **Local first**: Use Pi on local network when home
- **Compression**: Gzip responses
- **Minimal payloads**: Only send necessary data

## Scalability

### Current Design (Single User)
- ✅ All data in browser
- ✅ One Pi, one user
- ✅ No authentication needed
- ✅ Simple backup system

### Future Multi-User (Out of Scope)
- Add user authentication
- Database instead of JSON files
- Separate user data stores
- Cloud hosting alternative

## Error Recovery

### Backup Failure
```
Backup fails
    ↓
Log error (don't block app)
    ↓
Update lastBackupDate = null
    ↓
Retry on next app open
```

### AI Request Failure
```
Request times out or fails
    ↓
Show error to user
    ↓
Offer retry button
    ↓
Or allow manual entry
```

### Server Offline
```
Health check fails
    ↓
Disable AI features in UI
    ↓
Show "Offline" indicator
    ↓
All core features still work
```

## Deployment Architecture

### Development
```
[Laptop]
  ├── npm run dev (React dev server on :5173)
  └── cd server && npm start (Express on :3000)
```

### Production
```
[Raspberry Pi]
  ├── PM2: server.js (Express on :3000)
  │   ├── Serves built PWA from dist/
  │   └── Provides API endpoints
  └── Optional: nginx (HTTPS proxy on :443)
```

## Dependencies

### Frontend (React)
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "idb": "^8.0.0"
}
```

### Backend (Express)
```json
{
  "express": "^4.18.2",
  "@anthropic-ai/sdk": "^0.30.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0"
}
```

### Infrastructure
- **Node.js**: 18+ (LTS)
- **PM2**: Process management
- **nginx**: Optional reverse proxy
- **certbot**: Optional SSL certificates

## Monitoring & Logs

### Server Logs (PM2)
```bash
pm2 logs freefit-server          # All logs
pm2 logs freefit-server --err    # Errors only
pm2 monit                        # Real-time monitoring
```

### Log Events
- ✅ Server start
- ✅ Backup saved
- ✅ AI request start/complete
- ❌ Errors with stack trace
- ⚠️ Rate limit warnings

### Metrics to Track
- Backup success rate
- AI request count per day
- Average response time
- Error rate
- Disk usage (backups/)

## Cost Analysis

### One-Time Costs
- Raspberry Pi 4 (4GB): $55
- MicroSD card (32GB): $10
- Power supply: $10
- Case: $10
- **Total: $85**

### Monthly Costs
- Claude API: $0.27 (90 images @ $3/1000)
- Electricity: $0.50 (24/7 @ 3W)
- Internet: $0 (already have)
- **Total: $0.77/month**

### Compare to Alternatives
- Cloud hosting: $5-20/month
- Database hosting: $5-10/month
- Image storage: $1-5/month
- **Traditional SaaS: $11-35/month**

**Savings: ~$10-34/month or $120-408/year!** 💰

## Future Enhancements

### Phase 6 (PWA)
- Service worker (offline cache)
- Manifest.json
- App icons
- "Add to Home Screen"

### Phase 7 (Optional)
- 3D muscle diagram
- Workout logging
- Progress charts
- Apple Health sync

### Infrastructure
- Automatic backups to cloud
- Multiple backup destinations
- Restore from backup UI
- Backup encryption
