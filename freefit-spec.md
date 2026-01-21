# Gym & Nutrition Tracker - FREEFIT - Complete Specification

## Project Overview

A Progressive Web App (PWA) for personal use to track gym routines and nutrition. The app will run on iPhone, be hosted on a Raspberry Pi, and use AI for photo-based food recognition.

---

## Technical Stack

**Frontend:**
- React (JavaScript framework)
- Progressive Web App (installable, offline-capable)
- Responsive design for iPhone

**Backend:**
- Simple web server on Raspberry Pi (nginx recommended)
- API endpoint for daily data backup
- API proxy for Claude AI requests (secure API key handling)

**Storage:**
- Primary: Browser LocalStorage/IndexedDB (client-side)
- Backup: JSON files on Raspberry Pi (once daily)

**AI Integration:**
- Claude API (Anthropic) for:
  - Meal photo recognition
  - Nutrition label OCR
- API calls proxied through Pi to keep key secure

---

## Navigation Structure

### Primary Tabs (Bottom Navigation)
1. **Exercises** - Browse and filter exercise database
2. **Machines** - Manage available equipment
3. **Routines** - Create and track workout routines
4. **Nutrition** - Log food and track macros

### Secondary Tabs (Nutrition Tab Only)
Located above primary tabs when Nutrition is active:
1. **Log** (default) - Today's food entries
2. **Summary** - Daily progress toward targets
3. **History** - Previous days' logs

---

## Core Layout Framework

### Exercises, Machines, Routines Tabs

**Split-screen layout:**
- **Left side (60%)**: Scrollable list
- **Right side (40%)**: Muscle diagram (persistent)

**Muscle Diagram Options:**

*Option A - 3D (Preferred):*
- Interactive 3D body model
- Swipe to rotate 360°
- Pinch to zoom
- No view toggle buttons needed

*Option B - 2D (Fallback):*
- Static front and back anatomical views
- Toggle buttons below diagram: "Front View" | "Rear View"
- Highlighted button shows current view

**Muscle Diagram Interaction:**
- **Hierarchical selection:**
  - Tap broad muscle group (e.g., "Legs") → zooms/highlights that region
  - Tap individual muscle (e.g., "Quadriceps") → filters/highlights that specific muscle
- **Color coding:**
  - Single exercise: uniform highlight for all muscles worked
  - Routine overview: gradient from darkest (highest volume) to lightest (lowest volume)
  - Selected day: uniform highlight for muscles worked that day

**Muscle Groups (Hierarchical):**
```
Chest
  - Pectoralis Major (Upper)
  - Pectoralis Major (Lower)
  - Pectoralis Minor

Back
  - Latissimus Dorsi
  - Trapezius (Upper)
  - Trapezius (Middle)
  - Trapezius (Lower)
  - Rhomboids
  - Erector Spinae

Shoulders
  - Anterior Deltoid
  - Lateral Deltoid
  - Posterior Deltoid

Arms
  - Biceps Brachii
  - Triceps Brachii
  - Forearm Flexors
  - Forearm Extensors

Legs
  - Quadriceps (Rectus Femoris, Vastus Lateralis, Vastus Medialis, Vastus Intermedius)
  - Hamstrings (Biceps Femoris, Semitendinosus, Semimembranosus)
  - Glutes (Gluteus Maximus, Gluteus Medius)
  - Calves (Gastrocnemius, Soleus)
  - Hip Adductors
  - Hip Abductors

Core
  - Rectus Abdominis
  - Obliques (External, Internal)
  - Transverse Abdominis
  - Lower Back (Erector Spinae)
```

### Nutrition Tab

**Full-width layout:**
- No muscle diagram
- Secondary tabs at top
- Content area fills screen

---

## Exercises Tab

### Layout
- Left: Exercise list
- Right: Muscle diagram

### Exercise List
Each entry displays:
- Exercise name
- Small icon indicating Dynamic/Static
- Small icon indicating Compound/Isolation

### Exercise Entry Details
When exercise is selected (tapped):
- Entry highlights in list
- Muscle diagram highlights all muscles worked
- Expands to show:
  - **Type**: Dynamic or Static
  - **Category**: Compound or Isolation
  - **Primary Muscles** (heavily worked): List with links to muscle on diagram
  - **Secondary Muscles** (lightly worked): List with links to muscle on diagram
  - **Compatible Equipment**: List of machines/equipment that can perform this exercise
  - **Instructions**: Brief text description of how to perform

### Filtering
- **By muscle group**: Tap muscle on diagram → filters to exercises working that muscle
  - Shows both primary and secondary muscle exercises
  - Tap muscle again → removes filter
- **By equipment**: Filter button (top-right of list) → select machines → shows compatible exercises
- **By type**: Toggle buttons for Dynamic/Static, Compound/Isolation

### Prepopulated Exercise Database
Include common exercises such as:
- Barbell: Bench Press, Squat, Deadlift, Overhead Press, Bent-Over Row, Bicep Curl
- Dumbbell: Dumbbell Press, Dumbbell Row, Dumbbell Fly, Lateral Raise, Goblet Squat
- Cable Machine: Cable Fly, Cable Row, Tricep Pushdown, Face Pull, Cable Curl
- Bodyweight: Push-up, Pull-up, Dip, Plank, Sit-up, Lunge, Squat
- Machines: Leg Press, Leg Extension, Leg Curl, Chest Press, Lat Pulldown, Cable Crossover

*(Aim for 50-100 common exercises prepopulated)*

---

## Machines Tab

### Layout
- Left: Machine list
- Right: Muscle diagram (no highlighting by default)

### Machine List Entry
Each entry shows:
- Machine name (expandable dropdown arrow if has variants)
- Info button (ℹ️) on right edge of entry

### Dropdown Behavior
- Parent machine (e.g., "Cable Machine") can be selected → includes all variants
- Variants listed below parent (indented):
  - "Single Cable Machine"
  - "Dual Cable Machine (adjustable height)"
  - "Cable Crossover Machine"
- Selecting parent or any variant highlights the row

### Info Button
Taps opens full-screen info page:
- **Top-left**: Back button (returns to machine list)
- **Content**:
  - Machine name (header)
  - Example photos (2-3 images showing different angles/variants)
  - "Exercises" section header
  - List of exercises compatible with this machine
    - Each exercise name is clickable → navigates to Exercises tab with that exercise selected and highlighted

### Add Custom Machine
- "+" button at bottom of machine list
- Opens form:
  - **Machine name**: Text input
  - **Variants** (optional): Add multiple variant names
  - Save button
- Custom machines:
  - Appear in list with other machines
  - Do NOT have prepopulated exercises
  - User must manually tag exercises as compatible (future feature or accept they won't show in info)

### Prepopulated Machine Database
Include common machines:
- Barbell
- Dumbbells (pair)
- Bench (flat)
- Bench (adjustable)
- Power Rack / Squat Rack
- Pull-up Bar
- Dip Station
- Cable Machine (single)
- Cable Machine (dual, adjustable)
- Cable Crossover Machine
- Leg Press Machine
- Leg Extension Machine
- Leg Curl Machine
- Chest Press Machine
- Lat Pulldown Machine
- Seated Row Machine
- Pec Deck / Fly Machine
- Smith Machine
- Preacher Curl Bench
- Roman Chair / Back Extension

---

## Routines Tab

### Initial View (No Routine Selected)
- Left: List of saved routines
- Right: Muscle diagram (no highlighting)
- "+" button at bottom of routine list

### Creating New Routine
Tap "+" button:
1. Modal prompts: "How many days in this routine?"
   - Number input (1-7 typical range)
   - Confirm button
2. Creates routine with:
   - Default name: "New Routine" (editable)
   - Day 1, Day 2, ... Day N (collapsible headers)
   - Empty exercise lists for each day

### Routine Selected (Overview)
- **Top-left**: Back button
- **Top-right**: Edit button, Delete button (🗑️)
- **Left side**: 
  - Routine name (editable inline)
  - Collapsible day headers: "Day 1", "Day 2", etc.
  - Days collapsed by default
- **Right side**:
  - Muscle diagram with gradient highlighting:
    - Darkest = muscle group with most volume across entire routine
    - Lightest = muscle group with least volume
    - No highlight = not worked in routine
  - Below diagram: **Volume per muscle group** (entire routine)
    - List format: "Chest: 24 sets", "Back: 18 sets", etc.
    - Sorted by volume (descending)

**Volume Calculation Rule:**
- Volume = Total number of sets per muscle group
- Only counts dynamic exercises
- Only counts primary muscle worked (not secondary)
- Static exercises (e.g., plank) do NOT contribute to volume

### Edit Button
- Allows changing number of days
- Modal: "How many days?" with current number prefilled
- If decreasing days: warns "Day X will be deleted. Continue?"
- If increasing days: adds empty Day N+1, N+2, etc.

### Delete Button
- Confirmation modal: "Delete this routine? This cannot be undone."
- Cancel / Delete buttons

### Day Selected (Expanded)
- **Top-left**: Back button (returns to routine overview)
- **Header above list**: "Day 1" (or selected day number)
- **Filter button** to right of header:
  - Toggle: "My Machines" / "All Exercises"
  - "My Machines" = only exercises compatible with machines selected in Machines tab
  - "All Exercises" = all exercises (including bodyweight)
  - Bodyweight exercises always included regardless of filter
- **Left side**: Exercise list for this day
  - Each entry shows:
    - Exercise name
    - Machine used (or "Bodyweight")
    - Number of sets
    - Dynamic: "X reps" per set (can vary per set)
    - Static: "X seconds" per set (can vary per set)
    - Settings button on right (edit/delete exercise from day)
  - "+" button at bottom of list (add exercise)
- **Right side**:
  - Muscle diagram: highlights all muscles worked on THIS DAY (uniform color)
  - Below diagram: **Volume per muscle group** (this day only)
    - List format: "Chest: 4 sets", "Back: 6 sets"

### Adding Exercise to Day
Tap "+" button:
1. Shows filtered exercise list (based on filter toggle state)
2. **Additional filter**: Tap muscle group on diagram → filters to exercises working that muscle
   - Tap muscle again → removes muscle filter
   - Can combine with equipment filter
3. Select exercise → opens exercise configuration:
   - **Machine/Equipment**: Dropdown of compatible machines (or "Bodyweight")
   - **Add sets**: 
     - Dynamic: Number of reps per set
     - Static: Duration (seconds) per set
   - Can add multiple sets with different reps/durations
   - "Add Set" button
   - "Save Exercise" button (adds to day)

### Editing Exercise in Day
Tap settings button on exercise entry:
- Edit sets (add, remove, change reps/duration)
- Change machine
- Delete exercise from day

---

## Nutrition Tab

### Log (Secondary Tab - Default)

**Layout:**
- Full-width scrollable list of today's food entries
- "+" button at bottom

**Food Entry Display:**
Each entry shows:
- Food name (e.g., "Brown Rice")
- Servings consumed (e.g., "1.5 servings")
- Total calories for consumed amount
- Total macros for consumed amount: "P: Xg | F: Xg | C: Xg"
- Timestamp (e.g., "8:30 AM")
- Settings button (⚙️) on right (edit/delete entry)

**Adding Entry (Tap "+" button):**
Switches to food item library view:
- **Top-left**: Back button
- **Top-right**: 
  - "+" button (create new food item)
  - Camera button (📷) (log meal from photo)
- **Content**: Scrollable list of all food items

**Food Item Library Display:**
Each item shows:
- Food name
- Serving size + units (e.g., "100g", "1 egg", "1 cup")
- Calories per serving
- Macros per serving: "P: Xg | F: Xg | C: Xg"
- Settings button on right (edit/delete food item)

**Selecting Food Item:**
- Modal prompts: "How many servings?"
  - Number input (decimal allowed, e.g., "1.5", "0.5")
  - Confirm button
- Creates entry in today's log with:
  - Automatic timestamp (current time)
  - Calculated totals (servings × per-serving values)

**Camera Button (Log Meal from Photo):**
1. Opens camera
2. Take photo of meal
3. AI analyzes photo:
   - **If foods recognized**:
     - Creates entries for each recognized food
     - Matches to existing food items in library
     - Estimates portion sizes (e.g., "1.5 servings of Brown Rice")
     - Shows preview of entries with estimated servings
     - User confirms or adjusts servings
     - Adds all entries to log with single timestamp
   - **If food not recognized**:
     - Prompts: "Create new food item?"
     - Opens new food item form with AI-suggested values (see below)

**"+" Button (Create New Food Item):**
Opens form:
- **Top-left**: Back button
- **Top-right**: Camera button (📷) (for nutrition label)
- **Form fields**:
  - Food name: Text input
  - Serving size: Number input
  - Serving units: Text input (e.g., "g", "oz", "cup", "egg", "slice")
  - Calories per serving: Number input
  - Protein (g) per serving: Number input
  - Fat (g) per serving: Number input
  - Carbs (g) per serving: Number input
- Save button

**Camera Button in New Food Item Form (Nutrition Label):**
1. Opens camera
2. Take photo of nutrition label
3. AI OCR extracts:
   - Serving size (number + units)
   - Calories
   - Protein (g)
   - Fat (g)
   - Carbs (g)
4. **If successful**: Auto-fills form fields (except food name)
5. **If fails**: Error message "Could not read nutrition label. Please enter manually."

**AI-Suggested Food Item:**
When creating from unrecognized meal photo:
- AI provides best-guess values for generic food (e.g., "Chicken Breast, grilled")
- Form opens with suggested values pre-filled
- User reviews and edits as needed
- Saves to food item library for future use

### Summary (Secondary Tab)

**Layout:**
- Progress bars (vertical stack, top to bottom):
  1. Calories
  2. Protein
  3. Carbs
  4. Fats
- Right of each bar: "X / Y (Z%)"
  - X = current value from today's log
  - Y = daily target
  - Z = percentage toward target
  - Example: "1,847 / 2,500 (74%)"
- Below progress bars: **Daily Targets** section
  - Editable input fields for each:
    - Calories target
    - Protein (g) target
    - Carbs (g) target
    - Fats (g) target
  - Save button

**Progress Bar Colors:**
- < 80%: Red
- 80-95%: Yellow
- 95-105%: Green
- > 105%: Orange

### History (Secondary Tab)

**Layout:**
- Scrollable list of previous days (newest to oldest)
- Does NOT include current day

**Each Day Entry:**
- Left: Date in MM/DD/YYYY format (e.g., "01/20/2026")
- Right: Daily totals
  - "Cal: X | P: Xg | F: Xg | C: Xg"
- Tappable row

**Selecting a Date:**
- Opens that day's log view (same as Log tab)
- **Top-left**: Back arrow (returns to History list)
- Shows all entries from that day
- Can:
  - Edit existing entries (tap settings button)
  - Delete entries
  - Add new entries with manual timestamp
    - When adding: prompts "What time?" before selecting food item
    - Time picker: HH:MM AM/PM

**Current Day Behavior:**
- New daily log automatically starts at midnight
- Previous day's log moves to History

---

## Data Models

### Machine
```javascript
{
  id: "machine_uuid",
  name: "Cable Machine",
  isCustom: false, // true for user-added machines
  variants: [
    { id: "variant_uuid", name: "Single Cable" },
    { id: "variant_uuid", name: "Dual Cable (adjustable height)" }
  ],
  examplePhotos: ["url1", "url2"], // empty for custom machines
  compatibleExercises: ["exercise_uuid1", "exercise_uuid2"] // empty for custom machines
}
```

### Exercise
```javascript
{
  id: "exercise_uuid",
  name: "Bench Press",
  type: "dynamic", // or "static"
  category: "compound", // or "isolation"
  primaryMuscles: ["pectoralis_major_lower", "pectoralis_major_upper"],
  secondaryMuscles: ["anterior_deltoid", "triceps_brachii"],
  compatibleMachines: ["machine_uuid1", "machine_uuid2"],
  instructions: "Lie on bench, lower bar to chest, press up..."
}
```

### Routine
```javascript
{
  id: "routine_uuid",
  name: "Push Pull Legs",
  numDays: 3,
  days: [
    {
      dayNumber: 1,
      exercises: [
        {
          exerciseId: "exercise_uuid",
          machineId: "machine_uuid", // or null for bodyweight
          sets: [
            { reps: 10 }, // for dynamic
            { reps: 8 },
            { reps: 8 }
          ]
          // OR for static:
          // sets: [
          //   { duration: 60 }, // seconds
          //   { duration: 45 }
          // ]
        }
      ]
    }
  ],
  createdAt: "2026-01-21T10:30:00Z",
  updatedAt: "2026-01-21T10:30:00Z"
}
```

### Food Item
```javascript
{
  id: "food_uuid",
  name: "Brown Rice",
  servingSize: 100,
  servingUnits: "g",
  caloriesPerServing: 112,
  proteinPerServing: 2.6,
  fatPerServing: 0.9,
  carbsPerServing: 23.5,
  isCustom: false, // true for user-created items
  createdAt: "2026-01-21T10:30:00Z"
}
```

### Food Entry (Log)
```javascript
{
  id: "entry_uuid",
  foodItemId: "food_uuid",
  servings: 1.5,
  timestamp: "2026-01-21T12:30:00Z",
  date: "2026-01-21", // for grouping by day
  // Calculated fields (for convenience):
  totalCalories: 168,
  totalProtein: 3.9,
  totalFat: 1.35,
  totalCarbs: 35.25
}
```

### Daily Nutrition Targets
```javascript
{
  userId: "user_uuid", // if multi-user in future
  caloriesTarget: 2500,
  proteinTarget: 180,
  carbsTarget: 250,
  fatsTarget: 80,
  updatedAt: "2026-01-21T10:30:00Z"
}
```

---

## Data Backup System

### Backup Schedule
- **Frequency**: Once per 24 hours
- **Trigger**: First app open after midnight (local time)
- **Retry logic**: If backup fails (Pi offline), retry on next app open

### Data Backed Up (to Raspberry Pi)
- All food log history (all entries, all dates)
- Food item library (prepopulated + custom items)
- Custom exercises
- Custom machines
- User-created routines
- Daily nutrition targets

### Data NOT Backed Up (local only)
- Current session state
- UI preferences
- Cached images
- In-progress edits

### Backup Implementation
**Client-side (PWA):**
```javascript
// Check last backup timestamp
if (lastBackup < yesterday) {
  const backupData = {
    timestamp: new Date().toISOString(),
    foodEntries: getAllFoodEntries(),
    foodItems: getAllFoodItems(),
    customExercises: getCustomExercises(),
    customMachines: getCustomMachines(),
    routines: getAllRoutines(),
    nutritionTargets: getNutritionTargets()
  };
  
  // Send to Pi
  fetch('http://pi-address:port/api/backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backupData)
  });
}
```

**Server-side (Raspberry Pi):**
- Simple Express/Node.js endpoint: `POST /api/backup`
- Receives JSON
- Saves to file: `/backups/backup_YYYY-MM-DD.json`
- Returns success/failure status

### Restore Capability (Future Enhancement)
- Settings menu option: "Restore from Backup"
- Lists available backup dates
- User selects date → overwrites local data
- Useful if phone is lost/reset

---

## AI Integration Details

### Claude API Usage

**Two use cases:**
1. **Meal photo recognition** (photo → food entries)
2. **Nutrition label OCR** (photo → nutrition facts)

**API Setup:**
- API key stored on Raspberry Pi (never in PWA code)
- PWA sends photos to Pi endpoint
- Pi forwards to Claude API with key
- Pi returns results to PWA

**Endpoints on Pi:**

```
POST /api/analyze-meal
- Body: { image: base64_encoded_image }
- Returns: { 
    foods: [
      { name: "Brown Rice", servingSize: 1.5, foodItemId: "uuid_or_null" }
    ]
  }

POST /api/analyze-nutrition-label
- Body: { image: base64_encoded_image }
- Returns: {
    servingSize: 100,
    servingUnits: "g",
    calories: 112,
    protein: 2.6,
    fat: 0.9,
    carbs: 23.5
  }
- OR: { error: "Could not read label" }
```

**Claude API Prompts:**

*For meal recognition:*
```
Analyze this photo of a meal. For each food item visible:
1. Identify the food
2. Estimate the portion size in common units (grams, ounces, pieces, etc.)
3. Return as JSON array

Example response:
[
  { "name": "Grilled Chicken Breast", "estimatedServing": 200, "units": "g" },
  { "name": "Brown Rice", "estimatedServing": 150, "units": "g" },
  { "name": "Steamed Broccoli", "estimatedServing": 100, "units": "g" }
]
```

*For nutrition label:*
```
Extract nutrition facts from this food label photo. Return as JSON.

Required fields:
- servingSize (number)
- servingUnits (string)
- calories (number)
- protein (number, in grams)
- fat (number, in grams)
- carbs (number, in grams)

If unable to read any field, return: { "error": "Could not read label" }
```

**Error Handling:**
- Network timeout → "Could not connect to server"
- API error → "Photo analysis failed. Please try again."
- Ambiguous results → Show AI's best guess with "Estimated. Please verify."

**Cost Estimation:**
- Claude Sonnet 4.5: ~$3 per 1,000 images
- Typical usage: 3 meals/day = 90 photos/month = ~$0.27/month
- Nutrition labels: infrequent, negligible cost

---

## UI/UX Guidelines

### Design Aesthetic
- **Style**: Clean, modern, minimal
- **Color scheme**: 
  - Primary: Blue (#007AFF - iOS blue)
  - Success: Green (#34C759)
  - Warning: Orange (#FF9500)
  - Error: Red (#FF3B30)
  - Background: White (#FFFFFF)
  - Secondary background: Light gray (#F2F2F7)
  - Text: Black (#000000) or dark gray (#3C3C43)
- **Typography**: System font (San Francisco on iOS)
- **Spacing**: Generous padding, clear visual hierarchy

### Buttons
- **Primary action**: Filled blue button with white text
- **Secondary action**: Outlined button or text button
- **Destructive action**: Red text or red outlined button

### Lists
- **Row height**: 60-80px (comfortable tap targets)
- **Dividers**: Thin gray lines between rows
- **Tap feedback**: Brief highlight/ripple effect

### Modals/Forms
- **Background**: Slight dim overlay behind modal
- **Modal**: Rounded corners, drop shadow
- **Input fields**: Clear labels, appropriate keyboards (numeric for numbers)
- **Validation**: Real-time feedback (e.g., "Serving size must be positive")

### Muscle Diagram
- **Default state**: Neutral gray body outline
- **Highlighted**: Gradient from red (high intensity/volume) to light pink (low intensity/volume)
- **Interactive**: Clear tap targets, visual feedback on tap

### Loading States
- **Photo analysis**: Spinner with "Analyzing photo..." text
- **Backup**: Small indicator, non-blocking
- **Data loading**: Skeleton screens or spinner

### Empty States
- **No routines**: "Create your first routine" with + button
- **No food entries today**: "Log your first meal" with + button
- **No machines selected**: "Add your available equipment" with + button

### Responsive Behavior
- **Portrait (default)**: Split-screen layout as specified
- **Landscape**: Consider full-width list with diagram as overlay/drawer (optional enhancement)

---

## Technical Implementation Notes

### Progressive Web App Features

**Required `manifest.json`:**
```json
{
  "name": "Gym & Nutrition Tracker",
  "short_name": "Gym Tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#007AFF",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker:**
- Cache static assets (HTML, CSS, JS, images)
- Cache prepopulated data (exercises, machines)
- Network-first for API calls
- Cache-first for static assets

**Offline Capability:**
- All core features work offline
- AI features gracefully degrade (show "Offline" message)
- Queue backup requests when offline, send when back online

### Local Storage Strategy

**Use IndexedDB for:**
- Food entries (can be large, need querying by date)
- Routines (complex nested structure)
- Food item library

**Use LocalStorage for:**
- User preferences
- Daily nutrition targets
- Last backup timestamp
- UI state

### Raspberry Pi Server Setup

**Requirements:**
- Node.js installed
- Nginx as reverse proxy (optional, for HTTPS)
- Port forwarding (optional, for external access)

**Simple server structure:**
```
/home/pi/gym-tracker-server/
  ├── server.js (Express server)
  ├── backups/ (JSON backup files)
  ├── public/ (PWA static files)
  └── .env (API keys)
```

**Basic `server.js`:**
```javascript
const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' })); // for base64 images
app.use(express.static('public')); // serve PWA

// Backup endpoint
app.post('/api/backup', (req, res) => {
  const timestamp = new Date().toISOString().split('T')[0];
  fs.writeFileSync(
    `./backups/backup_${timestamp}.json`,
    JSON.stringify(req.body, null, 2)
  );
  res.json({ success: true });
});

// AI proxy endpoints
app.post('/api/analyze-meal', async (req, res) => {
  // Forward to Claude API
});

app.post('/api/analyze-nutrition-label', async (req, res) => {
  // Forward to Claude API
});

app.listen(3000);
```

### Performance Considerations

- **Image compression**: Compress photos before sending to AI (reduce size to max 1MB)
- **Lazy loading**: Load muscle diagram assets on demand
- **Debouncing**: Debounce search/filter inputs
- **Virtualization**: Use virtual scrolling for long lists (100+ items)

### Security Considerations

- **API key**: Never expose in client code
- **Input validation**: Sanitize all user inputs
- **HTTPS**: Use HTTPS if accessing outside local network (Let's Encrypt on Pi)
- **Rate limiting**: Limit AI API calls (e.g., max 10/minute)

---

## Development Workflow

### Phase 1: Basic Structure (Week 1)
- Set up React project with Create React App
- Implement bottom navigation tabs
- Create basic layouts for each tab
- Set up LocalStorage/IndexedDB
- Deploy static build to Raspberry Pi

### Phase 2: Exercises & Machines (Week 2)
- Prepopulate exercise database (JSON file)
- Prepopulate machine database (JSON file)
- Implement exercise list with filtering
- Implement machine list with info pages
- Build muscle diagram (2D version first)
- Connect muscle highlighting logic

### Phase 3: Routines (Week 2-3)
- Create routine CRUD operations
- Build day/exercise structure
- Implement volume calculations
- Connect to muscle diagram
- Add/edit/delete exercises in routine

### Phase 4: Nutrition - Manual Entry (Week 3)
- Build food item library
- Implement manual food entry
- Create daily log view
- Build summary view with progress bars
- Build history view

### Phase 5: AI Integration (Week 4)
- Set up Raspberry Pi server with Express
- Create API proxy endpoints
- Implement Claude API calls
- Add meal photo recognition
- Add nutrition label OCR
- Error handling and fallbacks

### Phase 6: Polish & PWA Features (Week 4-5)
- Add service worker for offline support
- Create app icons and manifest
- Implement backup system
- Add loading states and animations
- Refine UI/UX
- Test on iPhone
- Bug fixes

### Phase 7: 3D Muscle Diagram (Optional Enhancement)
- Evaluate 3D libraries (Three.js, Babylon.js)
- Build or source 3D body model
- Implement rotation controls
- Connect highlighting logic
- Performance optimization

---

## Prepopulated Data Requirements

### Exercise Database
Aim for 50-100 exercises covering:
- All major muscle groups
- Mix of compound and isolation
- Variety of equipment (barbell, dumbbell, machine, bodyweight, cable)
- Both dynamic and static exercises

**Data format (JSON):**
```json
[
  {
    "id": "bench_press",
    "name": "Bench Press",
    "type": "dynamic",
    "category": "compound",
    "primaryMuscles": ["pectoralis_major_lower", "pectoralis_major_upper"],
    "secondaryMuscles": ["anterior_deltoid", "triceps_brachii"],
    "compatibleMachines": ["barbell", "bench_flat"],
    "instructions": "Lie flat on bench. Grip bar slightly wider than shoulder width. Lower bar to chest, press up to full extension."
  }
]
```

### Machine Database
Aim for 20-30 common machines:
- Free weights (barbell, dumbbells)
- Benches (flat, incline, decline)
- Racks and stations
- Cable machines
- Leg machines
- Chest/back machines

**Data format (JSON):**
```json
[
  {
    "id": "cable_machine_dual",
    "name": "Cable Machine",
    "variants": [
      { "id": "cable_single", "name": "Single Cable" },
      { "id": "cable_dual", "name": "Dual Cable (adjustable)" }
    ],
    "examplePhotos": [
      "https://example.com/cable_machine_1.jpg",
      "https://example.com/cable_machine_2.jpg"
    ],
    "compatibleExercises": ["cable_fly", "cable_row", "tricep_pushdown"]
  }
]
```

### Food Database (Optional - Start Small)
Start with 20-50 common foods:
- Proteins (chicken, beef, fish, eggs, tofu)
- Carbs (rice, pasta, bread, oats)
- Fats (oils, nuts, avocado)
- Vegetables (flexible portions)
- Fruits

User will add most foods via photo recognition or manual entry over time.

---

## Future Enhancements (Out of Scope for Initial Build)

- **Workout logging**: Track actual performance during workout (reps achieved, weight used)
- **Progress tracking**: Charts showing weight progression per exercise over time
- **Rest timer**: Between-set countdown timer
- **Superset support**: Group exercises performed back-to-back
- **Exercise videos**: Embedded tutorial videos for proper form
- **Social features**: Share routines with friends
- **Cloud sync**: Sync across multiple devices
- **Apple Health integration**: Export workout data
- **Meal planning**: Generate meal plans based on targets
- **Barcode scanner**: Scan packaged food barcodes for instant nutrition lookup
- **Recipe builder**: Save multi-ingredient meals as single item
- **Water intake tracking**: Simple counter for daily water consumption

---

## Testing Checklist

### Functionality
- [ ] Create, edit, delete routines
- [ ] Add exercises to routine days
- [ ] Volume calculations accurate
- [ ] Muscle diagram highlights correctly
- [ ] Food entry logging works
- [ ] Photo meal recognition works
- [ ] Nutrition label OCR works
- [ ] Daily summaries calculate correctly
- [ ] History view shows past days
- [ ] Backup sends to Pi successfully
- [ ] Offline mode works (no AI features)

### UI/UX
- [ ] All tap targets easily reachable (44x44pt minimum)
- [ ] Scrolling smooth on long lists
- [ ] Forms have appropriate keyboards (numeric, text)
- [ ] Loading states show for async operations
- [ ] Error messages clear and helpful
- [ ] Navigation intuitive
- [ ] Back buttons work as expected
- [ ] Modal overlays properly

### Cross-Browser
- [ ] Works on Safari (iOS)
- [ ] Works on Chrome (iOS)
- [ ] PWA installs to home screen
- [ ] App icon displays correctly
- [ ] Splash screen shows on launch

### Performance
- [ ] App loads in < 3 seconds on WiFi
- [ ] No jank when scrolling lists
- [ ] Photos compress before upload
- [ ] Muscle diagram renders smoothly
- [ ] No memory leaks over extended use

---

## Success Criteria

**MVP Complete When:**
1. User can select available equipment from prepopulated list
2. User can create multi-day workout routines with exercises, sets, and reps
3. Muscle diagram accurately highlights muscles worked
4. Volume per muscle group calculates and displays correctly
5. User can manually log food with macros
6. User can take photo of meal → AI suggests foods → creates log entries
7. User can take photo of nutrition label → AI extracts data → creates food item
8. Daily summary shows progress toward nutrition targets
9. History shows previous days' nutrition logs
10. Data backs up to Raspberry Pi once per day
11. PWA installs to iPhone home screen and works offline (except AI features)

---

## Conclusion

This specification provides complete requirements for building a personal gym and nutrition tracking Progressive Web App. The app prioritizes ease of use, visual feedback (muscle diagrams), and AI-powered convenience features (photo recognition) while maintaining full functionality offline. 

The modular design allows for phased development, with core features implemented first and AI integration added later. The Raspberry Pi hosting provides data ownership and control while keeping costs minimal.

**Estimated development time with Claude Code: 20-40 hours of YOUR oversight and feedback** across 4-5 weeks, with Claude Code doing the heavy lifting of actually writing the code.
