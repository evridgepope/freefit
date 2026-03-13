made by Sebastian Evridge Pope. this is a free app i made to remove any excuse for me not to go to the gym or diet properly. at time of writing i have nowhere near the skills to actually make the app that i envision: if this is ever of any use to anyone besides myself i'd be shocked but glad.

## Development Status

**Phase 1-4 Complete:**
- ✅ App structure with navigation
- ✅ Exercise database with filtering
- ✅ Machine management
- ✅ Multi-day workout routines
- ✅ Nutrition tracking (manual entry)

**Phase 5 Complete (Server):**
- ✅ Express server for Raspberry Pi
- ✅ Daily data backup endpoint
- ✅ AI proxy for meal photo recognition (Claude API)
- ✅ AI proxy for nutrition label OCR

**Next Steps:**
- Integrate frontend with server API endpoints
- Deploy server to Raspberry Pi
- Add PWA features (service worker, manifest)
- Test on iPhone

needs improvement:
-  CLAUDE, SKIP THIS ONE FOR NOW. the muscle diagram implementation is not great. the overlay for highlighting muscles on the diagram is composed entirely of rectangles which dont sit properly on the non-rectangular muscles (so, all of them). i will need to figure out how to get claude to create svg shapes that are the correct size and placement for the muscles. 

## Project Structure

```
freefit/
├── server/                  # 🆕 Raspberry Pi backend (Phase 5)
│   ├── server.js           # Express server with AI proxy
│   ├── package.json        # Server dependencies
│   ├── .env.example        # Environment template
│   ├── backups/            # Daily JSON backups
│   ├── README.md           # Server documentation
│   ├── DEPLOYMENT.md       # Pi deployment guide
│   ├── INTEGRATION.md      # Frontend integration guide
│   ├── test-endpoints.js   # Test script
│   └── test-ai.html        # AI features test page
├── public/
│   └── images/             # Muscle anatomy images
│       ├── muscles-front.png
│       └── muscles-back.png
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ImageMuscleDiagram.jsx
│   │   ├── BottomNav.jsx
│   │   └── SplitLayout.jsx
│   ├── pages/              # Main app pages
│   │   ├── ExercisesPage.jsx
│   │   ├── MachinesPage.jsx
│   │   ├── RoutinesPage.jsx
│   │   └── NutritionPage.jsx
│   ├── data/               # Prepopulated data
│   │   ├── exercises.js    # 40 prepopulated exercises
│   │   ├── machines.js     # 17 prepopulated machines
│   │   └── foodItems.js    # Sample food database
│   ├── utils/              # Helper functions
│   │   ├── db.js          # IndexedDB operations
│   │   ├── storage.js     # LocalStorage operations
│   │   └── helpers.js     # Utility functions
│   └── styles/            # CSS files
├── CLAUDE.md              # Instructions for Claude Code
└── freefit-spec.md       # Complete project specification
```
## Quick Start

### Frontend (PWA)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173` (Vite default port).

### Backend Server (Raspberry Pi)

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Claude API key

# Start server
npm start
```

The server will run on `http://localhost:3000`.

## Testing the Server

### Test Basic Endpoints

```bash
cd server
node test-endpoints.js
```

### Test AI Features

1. Start the server: `npm start`
2. Open `server/test-ai.html` in your browser
3. Upload meal photos or nutrition labels to test AI recognition

## Documentation

- **[server/README.md](server/README.md)** - Server setup and API documentation
- **[server/DEPLOYMENT.md](server/DEPLOYMENT.md)** - Complete Raspberry Pi deployment guide
- **[server/INTEGRATION.md](server/INTEGRATION.md)** - Frontend integration examples
- **[CLAUDE.md](CLAUDE.md)** - Project guidelines for AI assistance
- **[freefit-spec.md](freefit-spec.md)** - Complete project specification

## Features

### Current (Phases 1-5)
- 📋 Exercise database with muscle filtering
- 🏋️ Equipment/machine management
- 📅 Multi-day workout routines with volume tracking
- 🍽️ Manual nutrition logging
- 📊 Daily macro tracking with progress bars
- 💾 Automatic daily backups to Raspberry Pi
- 📸 AI meal photo recognition (Claude API)
- 🏷️ AI nutrition label OCR

### Coming Soon (Phase 6)
- 📱 PWA installation (add to home screen)
- 🔌 Full offline support with service worker
- 🎨 UI polish and animations

## Tech Stack

**Frontend:**
- React 18 + Vite
- IndexedDB for data storage
- Progressive Web App features

**Backend:**
- Node.js + Express
- Claude 3.5 Sonnet API (Anthropic)
- PM2 for process management
- Hosted on Raspberry Pi

## API Endpoints

### Backup
- `POST /api/backup` - Save daily backup

### AI Features
- `POST /api/analyze-meal` - Meal photo recognition
- `POST /api/analyze-nutrition-label` - Nutrition label OCR

### Health
- `GET /api/health` - Server status
- `GET /api/backups` - List available backups

Rate limit: 10 AI requests/minute per IP

## Cost Estimation

- **Claude API**: ~$0.27/month (90 photos @ $3/1000 images)
- **Raspberry Pi**: One-time hardware cost (~$50-100)
- **Self-hosted**: No recurring hosting fees!

## Deployment to Raspberry Pi

See **[server/DEPLOYMENT.md](server/DEPLOYMENT.md)** for complete deployment instructions.

Quick summary:
1. Build the PWA: `npm run build`
2. Copy files to Pi
3. Install server dependencies
4. Configure environment variables
5. Start with PM2: `pm2 start server.js`
6. Access from phone on same network

## Contributing

This is a personal project, but feel free to fork and modify for your own use!