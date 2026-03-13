# Quick Start Guide - Phase 5 Server

Get your FreeFit server running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Claude API key from [console.anthropic.com](https://console.anthropic.com/)
- [ ] Project built (`npm run build` from project root)

## 5-Minute Setup

### 1. Install Dependencies (1 minute)

```bash
cd server
npm install
```

### 2. Configure API Key (1 minute)

```bash
# Copy template
cp .env.example .env

# Edit and add your API key
# Windows: notepad .env
# Mac/Linux: nano .env
```

In `.env` file:
```
PORT=3000
CLAUDE_API_KEY=sk-ant-api03-YOUR-KEY-HERE
```

**Get API key:** https://console.anthropic.com/settings/keys

### 3. Start Server (10 seconds)

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║          FreeFit Server                    ║
╚════════════════════════════════════════════╝

🚀 Server running on port 3000
🤖 AI features: ✅ Enabled
```

### 4. Test It Works (2 minutes)

**Option A: Basic test (no AI)**
```bash
# Open new terminal
cd server
node test-endpoints.js
```

**Option B: Full AI test (with images)**
1. Open browser to `http://localhost:3000`
2. Click around (your PWA should load!)
3. Go to `http://localhost:3000/test-ai.html`
4. Upload a meal photo
5. Upload a nutrition label photo
6. Verify AI responses look correct

### 5. Verify Health (10 seconds)

Open browser to: `http://localhost:3000/api/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T...",
  "apiConfigured": true
}
```

## ✅ Success!

Your server is now:
- ✅ Running and accessible
- ✅ Serving your PWA
- ✅ AI features enabled
- ✅ Backup endpoint ready

## What's Next?

### Immediate Next Steps

1. **Integrate Frontend** (30 minutes)
   - See `INTEGRATION.md` for code examples
   - Create `src/config/api.js`
   - Create `src/services/apiService.js`
   - Update Nutrition page to use AI features
   - Add backup logic to App.jsx

2. **Test Locally** (15 minutes)
   - Take photos of real meals
   - Scan nutrition labels
   - Verify backup works
   - Test error handling

### Deploy to Raspberry Pi (Later)

When ready to deploy:
1. See `DEPLOYMENT.md` for complete guide
2. Copy files to Pi
3. Install dependencies on Pi
4. Configure `.env` on Pi
5. Start with PM2
6. Access from phone!

## Troubleshooting

### "Module not found" Error

```bash
rm -rf node_modules
npm install
```

### "API key not configured" Warning

Check your `.env` file:
```bash
cat .env  # Mac/Linux
type .env # Windows

# Should show:
# CLAUDE_API_KEY=sk-ant-api03-...
```

### Port 3000 Already in Use

Change port in `.env`:
```
PORT=3001
```

### Can't Access from Phone

1. On same WiFi network?
2. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Try: `http://YOUR_IP:3000` from phone
4. Firewall blocking port 3000?

## Common Commands

```bash
# Start server
npm start

# Test basic endpoints
node test-endpoints.js

# View server directory
ls -la

# Check .env file
cat .env

# Find what's using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

## Documentation Index

Choose your path:

| I want to... | Read this file |
|-------------|----------------|
| **Understand API endpoints** | `README.md` |
| **Integrate with frontend** | `INTEGRATION.md` |
| **Deploy to Raspberry Pi** | `DEPLOYMENT.md` |
| **Understand architecture** | `ARCHITECTURE.md` |
| **Get started quickly** | This file! |

## API Endpoints Reference

```bash
# Health check
curl http://localhost:3000/api/health

# List backups
curl http://localhost:3000/api/backups

# Test backup
curl -X POST http://localhost:3000/api/backup \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2026-01-26T12:00:00Z","foodEntries":[]}'

# Test meal analysis (need base64 image)
# Use test-ai.html instead

# Test nutrition label (need base64 image)
# Use test-ai.html instead
```

## Example Frontend Integration

**Minimal integration to get started:**

```javascript
// src/config/api.js
export const API_BASE_URL = 'http://localhost:3000/api';

// src/services/apiService.js
export async function analyzeMealPhoto(base64Image) {
  const response = await fetch(`${API_BASE_URL}/analyze-meal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  });
  const data = await response.json();
  return data.foods || [];
}

// In your component
async function handleMealPhoto(file) {
  const base64 = await fileToBase64(file);
  const foods = await analyzeMealPhoto(base64);
  console.log('Identified foods:', foods);
}
```

Full examples in `INTEGRATION.md`.

## Support

- **API not responding?** Check server is running: `npm start`
- **AI features broken?** Verify API key: `cat .env`
- **Frontend can't connect?** Check port in `src/config/api.js`
- **Still stuck?** Read the relevant documentation file above

## File Structure

```
server/
├── server.js              # Main server (read this to understand code)
├── package.json          # Dependencies
├── .env.example          # Template (copy to .env)
├── .env                  # Your config (CREATE THIS)
├── backups/              # Backup files saved here
├── README.md             # API documentation
├── DEPLOYMENT.md         # Pi deployment guide
├── INTEGRATION.md        # Frontend integration
├── ARCHITECTURE.md       # System design
├── QUICKSTART.md         # This file
├── test-endpoints.js     # Test script
└── test-ai.html         # AI test page
```

## Estimated Timeline

- ✅ **Setup server:** 5 minutes (DONE NOW!)
- ⏱️ **Integrate frontend:** 30-60 minutes
- ⏱️ **Test locally:** 15-30 minutes
- ⏱️ **Deploy to Pi:** 30-60 minutes (when ready)

**Total time to full deployment: 2-3 hours**

## Cost Reminder

- **Setup:** Free (already have computer)
- **Development:** Free (localhost)
- **API usage:** ~$0.003 per meal photo
- **Monthly cost:** ~$0.27 for API + $0.50 electricity = **$0.77/month**

Compare to hosted alternatives: $10-20/month minimum! 💰

## Next Steps Decision Tree

```
Is server running? ─No─> Run: npm start
    │ Yes
    ↓
Is AI working? ─No─> Check: test-ai.html
    │ Yes
    ↓
Frontend integrated? ─No─> Read: INTEGRATION.md
    │ Yes
    ↓
Tested locally? ─No─> Test on computer first
    │ Yes
    ↓
Have Raspberry Pi? ─No─> Order one (optional, can use computer)
    │ Yes
    ↓
Ready to deploy? ─No─> Keep testing locally
    │ Yes
    ↓
Read: DEPLOYMENT.md and deploy! 🚀
```

## Success! 🎉

Your server is running and ready. Now integrate with your frontend and start using AI features!

**Questions?** Check the documentation files or review the code in `server.js`.

**Ready to integrate?** Start with `INTEGRATION.md`.

**Ready to deploy?** Start with `DEPLOYMENT.md`.

Happy tracking! 💪🍎
