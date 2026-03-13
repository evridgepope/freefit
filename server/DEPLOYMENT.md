# Raspberry Pi Deployment Checklist

Complete guide for deploying FreeFit server to your Raspberry Pi.

## Prerequisites

- [ ] Raspberry Pi (Model 3B+ or newer recommended)
- [ ] Raspberry Pi OS (Bullseye or newer) installed
- [ ] SSH enabled on Pi
- [ ] Pi connected to your network
- [ ] Node.js 18+ installed on Pi
- [ ] Claude API key from [Anthropic Console](https://console.anthropic.com/)

## Step 1: Prepare Your Raspberry Pi

### Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Install Node.js (if not installed)

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Enable Firewall (Optional but Recommended)

```bash
sudo apt install ufw
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw enable
```

## Step 2: Transfer Files to Pi

### Option A: Via SCP (from your computer)

```bash
# From your project directory
cd /path/to/freefit

# Copy entire project to Pi
scp -r . pi@raspberrypi.local:~/freefit

# Or if you know the IP
scp -r . pi@192.168.1.100:~/freefit
```

### Option B: Via Git (recommended)

```bash
# SSH into Pi
ssh pi@raspberrypi.local

# Clone your repository
cd ~
git clone https://github.com/yourusername/freefit.git
cd freefit
```

### Option C: Via SFTP Client

Use FileZilla, Cyberduck, or WinSCP to transfer files.

## Step 3: Build the React App

```bash
# On your computer OR on the Pi
cd /path/to/freefit
npm install
npm run build
```

This creates the `dist/` folder with your PWA.

## Step 4: Set Up the Server

### Install Server Dependencies

```bash
# SSH into Pi
ssh pi@raspberrypi.local

cd ~/freefit/server
npm install
```

### Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit with your API key
nano .env
```

Add your Claude API key:
```
PORT=3000
CLAUDE_API_KEY=sk-ant-api03-...your-key-here
```

Save and exit (Ctrl+X, Y, Enter).

### Create Backups Directory

```bash
mkdir -p ~/freefit/server/backups
```

## Step 5: Test the Server

```bash
cd ~/freefit/server
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║                    FreeFit Server                          ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on port 3000
...
```

Test in browser: `http://raspberrypi.local:3000` or `http://YOUR_PI_IP:3000`

Stop the server (Ctrl+C) once confirmed working.

## Step 6: Set Up as Background Service

### Start with PM2

```bash
cd ~/freefit/server
pm2 start server.js --name freefit-server
```

### Save PM2 Process List

```bash
pm2 save
```

### Enable Auto-Start on Boot

```bash
pm2 startup
# Copy and run the command it outputs
```

### Useful PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs freefit-server

# Restart server
pm2 restart freefit-server

# Stop server
pm2 stop freefit-server

# Monitor in real-time
pm2 monit
```

## Step 7: Configure Network Access

### Find Your Pi's IP Address

```bash
hostname -I
```

Example output: `192.168.1.100`

### Test from Another Device

On your phone or computer:
1. Connect to same WiFi network
2. Open browser to `http://192.168.1.100:3000`
3. You should see the FreeFit app

### Update Frontend API URL

Edit `src/config/api.js` in your React app:

```javascript
export const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Your Pi's IP
```

Rebuild and redeploy:
```bash
npm run build
# Copy new dist/ to Pi
```

## Step 8: (Optional) Set Up External Access

### Static IP on Pi

Edit `/etc/dhcpcd.conf`:
```bash
sudo nano /etc/dhcpcd.conf
```

Add:
```
interface eth0  # or wlan0 for WiFi
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

Reboot: `sudo reboot`

### Router Port Forwarding

1. Log into your router admin panel
2. Find Port Forwarding section
3. Forward external port 3000 to Pi's IP (192.168.1.100:3000)
4. Note your public IP from [whatismyip.com](https://whatismyip.com)

### Dynamic DNS (Optional)

Use DuckDNS for free dynamic DNS:

1. Sign up at [duckdns.org](https://www.duckdns.org)
2. Create a domain (e.g., myfreefit.duckdns.org)
3. Install DuckDNS updater on Pi:

```bash
mkdir ~/duckdns
cd ~/duckdns
nano duck.sh
```

Add:
```bash
echo url="https://www.duckdns.org/update?domains=YOUR_DOMAIN&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -
```

Make executable and schedule:
```bash
chmod +x duck.sh
crontab -e
# Add: */5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1
```

### HTTPS with Nginx (Recommended for External Access)

Install nginx and certbot:
```bash
sudo apt install nginx certbot python3-certbot-nginx
```

Configure nginx:
```bash
sudo nano /etc/nginx/sites-available/freefit
```

Add:
```nginx
server {
    listen 80;
    server_name myfreefit.duckdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site and get SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/freefit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d myfreefit.duckdns.org
```

Update frontend URL to HTTPS:
```javascript
export const API_BASE_URL = 'https://myfreefit.duckdns.org/api';
```

## Step 9: Verify Everything Works

### Test Checklist

- [ ] PWA loads in browser
- [ ] Bottom navigation works
- [ ] Can create routines
- [ ] Can log food manually
- [ ] Health endpoint responds: `/api/health`
- [ ] Test meal photo (use `test-ai.html`)
- [ ] Test nutrition label (use `test-ai.html`)
- [ ] Backup endpoint works
- [ ] PWA installs to phone home screen
- [ ] Offline mode works (core features only)

### Common Issues

**Port 3000 in use:**
```bash
# Find process using port
sudo lsof -i :3000
# Kill it or change PORT in .env
```

**API key not working:**
```bash
# Verify key is set
grep CLAUDE_API_KEY ~/freefit/server/.env
# Test health endpoint
curl http://localhost:3000/api/health
```

**Can't access from phone:**
```bash
# Check firewall
sudo ufw status
# Allow port if needed
sudo ufw allow 3000
```

**PM2 not starting on boot:**
```bash
# Re-run startup command
pm2 startup
# Save again
pm2 save
```

## Step 10: Maintenance

### Update Server Code

```bash
cd ~/freefit
git pull  # or copy new files
cd server
npm install  # if dependencies changed
pm2 restart freefit-server
```

### View Logs

```bash
# Real-time logs
pm2 logs freefit-server

# Last 100 lines
pm2 logs freefit-server --lines 100

# Error logs only
pm2 logs freefit-server --err
```

### Backup Management

Backups are stored in `~/freefit/server/backups/`

```bash
# List backups
ls -lh ~/freefit/server/backups/

# Copy to external storage
scp pi@raspberrypi.local:~/freefit/server/backups/* /backup/location/

# Delete old backups (keep last 30 days)
find ~/freefit/server/backups/ -name "*.json" -mtime +30 -delete
```

### Monitor API Usage

Check [Anthropic Console](https://console.anthropic.com/) for:
- API calls made
- Cost this month
- Set billing alerts

### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
cd ~/freefit/server
npm update

# Update PM2
sudo npm update -g pm2
```

## Troubleshooting

### Server Won't Start

```bash
# Check logs
pm2 logs freefit-server --err

# Common fixes
cd ~/freefit/server
rm -rf node_modules
npm install
pm2 restart freefit-server
```

### Out of Memory

```bash
# Check memory usage
free -h

# Increase swap space (if needed)
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile  # Set CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### Slow Performance

```bash
# Check CPU/RAM
htop

# Restart server
pm2 restart freefit-server

# Reboot Pi
sudo reboot
```

## Security Checklist

- [ ] Changed default Pi password
- [ ] SSH keys configured (disable password auth)
- [ ] Firewall enabled
- [ ] Only necessary ports open
- [ ] HTTPS configured (if external access)
- [ ] API key in .env (not committed to git)
- [ ] Regular system updates
- [ ] Backup .env file securely

## Performance Tips

1. **Use wired ethernet** instead of WiFi for stability
2. **Overclock Pi** (optional, improves response time)
3. **Use SSD** instead of SD card for better I/O
4. **Monitor temperature**: `vcgencmd measure_temp`
5. **Enable GPU memory split** for image processing

## Support Resources

- **Raspberry Pi Docs**: https://www.raspberrypi.com/documentation/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Node.js Docs**: https://nodejs.org/docs/
- **Anthropic API Docs**: https://docs.anthropic.com/

## Success!

Your FreeFit server should now be:
- ✅ Running on Raspberry Pi
- ✅ Accessible from your phone
- ✅ Automatically starting on boot
- ✅ Backing up data daily
- ✅ Providing AI features

Enjoy your self-hosted gym & nutrition tracker! 💪🍎
