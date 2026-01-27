made by Sebastian Evridge Pope. this is a free app i made to remove any excuse for me not to go to the gym or diet properly. at time of writing i have nowhere near the skills to actually make the app that i envision: if this is ever of any use to anyone besides myself i'd be shocked but glad.

update: phase 4 partially completed.

needs improvement:
-  CLAUDE, SKIP THIS ONE FOR NOW. the muscle diagram implementation is not great. the overlay for highlighting muscles on the diagram is composed entirely of rectangles which dont sit properly on the non-rectangular muscles (so, all of them). i will need to figure out how to get claude to create svg shapes that are the correct size and placement for the muscles. 

## Project Structure

```
freefit/
├── public/
│   └── images/              # Muscle anatomy images go here
│       ├── muscles-front.png
│       └── muscles-back.png
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ImageMuscleDiagram.jsx    # Main muscle diagram component
│   │   ├── BottomNav.jsx
│   │   └── SplitLayout.jsx
│   ├── pages/               # Main app pages
│   │   ├── ExercisesPage.jsx
│   │   ├── MachinesPage.jsx
│   │   ├── RoutinesPage.jsx
│   │   └── NutritionPage.jsx
│   ├── data/                # Prepopulated data
│   │   ├── exercises.js     # 40 prepopulated exercises
│   │   └── machines.js      # 17 prepopulated machines
│   ├── utils/               # Helper functions
│   │   ├── db.js           # IndexedDB operations
│   │   ├── storage.js      # LocalStorage operations
│   │   └── helpers.js      # Utility functions
│   └── styles/             # CSS files
├── CLAUDE.md               # Instructions for Claude Code
└── freefit-spec.md        # Complete project specification
```
## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000` (or 3001 if 3000 is in use).