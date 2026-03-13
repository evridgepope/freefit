# FreeFit Server

Express server for the FreeFit PWA. Runs on Raspberry Pi to handle data backups and proxy AI requests to Claude API.

## Features

- **Data Backup**: Daily automatic backups of user data to JSON files
- **AI Meal Recognition**: Analyze meal photos to identify foods and estimate portions
- **AI Label OCR**: Extract nutrition facts from food label photos
- **Rate Limiting**: Prevents abuse of AI endpoints (10 requests/minute)
- **Security**: Helmet.js security headers, CORS enabled
- **PWA Hosting**: Serves the built React app

## Prerequisites

- Node.js 18+ installed on Raspberry Pi
- Claude API key from [Anthropic Console](https://console.anthropic.com/)

## Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file and add your Claude API key
nano .env
```

Replace `your_api_key_here` with your actual Claude API key.

### 3. Build the PWA

From the project root directory:

```bash
npm run build
```

This creates the `dist/` folder that the server will serve.

## Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Run as Background Service (Linux/Raspberry Pi)

Using PM2 (recommended):

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the server
pm2 start server.js --name freefit-server

# Save the process list
pm2 save

# Set PM2 to start on boot
pm2 startup
```

## API Endpoints

### Backup Endpoint

**POST** `/api/backup`

Saves daily backup data to JSON file.

**Request:**
```json
{
  "timestamp": "2026-01-26T10:30:00Z",
  "foodEntries": [...],
  "foodItems": [...],
  "routines": [...],
  "customExercises": [...],
  "customMachines": [...],
  "nutritionTargets": {...}
}
```

**Response:**
```json
{
  "success": true,
  "filename": "backup_2026-01-26.json",
  "timestamp": "2026-01-26T10:30:00Z"
}
```

### Meal Photo Analysis

**POST** `/api/analyze-meal`

Analyzes a meal photo and identifies foods with portion estimates.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response:**
```json
{
  "foods": [
    {
      "name": "Grilled Chicken Breast",
      "servingSize": 200,
      "servingUnits": "g",
      "foodItemId": null
    },
    {
      "name": "Brown Rice",
      "servingSize": 150,
      "servingUnits": "g",
      "foodItemId": null
    }
  ]
}
```

**Rate Limit:** 10 requests per minute per IP

### Nutrition Label OCR

**POST** `/api/analyze-nutrition-label`

Extracts nutrition facts from a food label photo.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response (Success):**
```json
{
  "servingSize": 100,
  "servingUnits": "g",
  "calories": 112,
  "protein": 2.6,
  "fat": 0.9,
  "carbs": 23.5
}
```

**Response (Failure):**
```json
{
  "error": "Could not read label"
}
```

**Rate Limit:** 10 requests per minute per IP

### Nutrition Estimation (No Label)

**POST** `/api/estimate-nutrition`

Estimates nutrition facts for a food item when no label is available. Useful for fresh foods, prepared meals, or when adding items identified from meal photos.

**Request:**
```json
{
  "foodName": "Grilled Chicken Breast",
  "servingSize": 200,
  "servingUnits": "g"
}
```

**Response (Success):**
```json
{
  "servingSize": 200,
  "servingUnits": "g",
  "calories": 330,
  "protein": 62,
  "fat": 7.2,
  "carbs": 0
}
```

**Response (Failure):**
```json
{
  "error": "Could not estimate nutrition"
}
```

**Rate Limit:** 10 requests per minute per IP

**Note:** These are AI estimates based on typical nutritional values. Always verify with actual labels when available.

### Health Check

**GET** `/api/health`

Returns server status and configuration.

```json
{
  "status": "ok",
  "timestamp": "2026-01-26T10:30:00Z",
  "apiConfigured": true
}
```

### List Backups

**GET** `/api/backups`

Lists all available backup files.

```json
{
  "backups": [
    {
      "filename": "backup_2026-01-26.json",
      "date": "2026-01-26",
      "size": 52847,
      "modified": "2026-01-26T10:30:00Z"
    }
  ]
}
```

## Network Configuration

### Local Network Access

By default, the server runs on `http://localhost:3000`. To access from your phone on the same network:

1. Find your Raspberry Pi's IP address:
```bash
hostname -I
```

2. Update your PWA's API endpoints to use the Pi's IP:
```javascript
// In your React app
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

3. Make sure your firewall allows port 3000:
```bash
sudo ufw allow 3000
```

### External Access (Optional)

To access the app outside your home network:

1. **Port Forwarding**: Configure your router to forward port 3000 to your Pi
2. **Dynamic DNS**: Use a service like DuckDNS for a stable hostname
3. **HTTPS**: Use Let's Encrypt with nginx as a reverse proxy (recommended for security)

#### Example nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.duckdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Backup Files

Backups are saved to `server/backups/` with filename format:
- `backup_YYYY-MM-DD.json`

Each backup includes:
- Complete food entry history
- Food item library
- Custom exercises and machines
- User routines
- Nutrition targets
- Timestamps

## Troubleshooting

### AI Features Not Working

1. Check if API key is set:
```bash
grep CLAUDE_API_KEY .env
```

2. Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

3. Check server logs for errors

### Port Already in Use

Change the port in `.env`:
```bash
PORT=3001
```

### Permission Denied

Make sure the `backups/` directory is writable:
```bash
chmod 755 backups
```

## Cost Estimation

Claude API costs (as of 2026):
- **Model**: Claude Sonnet 3.5
- **Image analysis**: ~$3 per 1,000 images
- **Typical usage**: 3 meals/day = 90 photos/month = **~$0.27/month**

Nutrition label OCR is infrequent and negligible cost.

## Security Notes

- API key is stored on the server only (never exposed to client)
- Rate limiting prevents abuse (10 AI requests/minute)
- Helmet.js adds security headers
- CORS enabled for PWA access
- Keep your `.env` file secure and never commit it to git

## Development

To update the server while it's running:

```bash
# With PM2
pm2 restart freefit-server

# Or stop and start manually
pm2 stop freefit-server
npm start
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs: `pm2 logs freefit-server`
3. Refer to the main project spec: `freefit-spec.md`

## License

MIT
