# Frontend Integration Guide

This guide shows how to integrate the FreeFit React app with the Raspberry Pi server.

## Overview

The server provides three main endpoints that your React app will use:
1. **Backup** - Save daily data backups
2. **Meal Analysis** - AI-powered meal photo recognition
3. **Label OCR** - AI-powered nutrition label extraction

## Setup

### 1. Create an API Configuration File

Create `src/config/api.js` in your React app:

```javascript
// API configuration for FreeFit server
const isDevelopment = import.meta.env.DEV;

// In development, use localhost
// In production, use your Raspberry Pi's IP or domain
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3000/api'
  : 'http://YOUR_PI_IP_HERE:3000/api'; // e.g., http://192.168.1.100:3000/api

export const API_ENDPOINTS = {
  BACKUP: `${API_BASE_URL}/backup`,
  ANALYZE_MEAL: `${API_BASE_URL}/analyze-meal`,
  ANALYZE_LABEL: `${API_BASE_URL}/analyze-nutrition-label`,
  ESTIMATE_NUTRITION: `${API_BASE_URL}/estimate-nutrition`,
  HEALTH: `${API_BASE_URL}/health`,
};
```

### 2. Create an API Service Module

Create `src/services/apiService.js`:

```javascript
import { API_ENDPOINTS } from '../config/api';

/**
 * Send daily backup to Raspberry Pi
 */
export async function sendBackup(backupData) {
  try {
    const response = await fetch(API_ENDPOINTS.BACKUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...backupData
      })
    });

    if (!response.ok) {
      throw new Error('Backup failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Backup error:', error);
    throw error;
  }
}

/**
 * Analyze meal photo and identify foods
 * @param {string} base64Image - Base64 encoded image with data URI prefix
 * @returns {Promise<{foods: Array}>}
 */
export async function analyzeMealPhoto(base64Image) {
  try {
    const response = await fetch(API_ENDPOINTS.ANALYZE_MEAL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    if (!response.ok) {
      throw new Error('Meal analysis failed');
    }

    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('Meal analysis error:', error);
    throw error;
  }
}

/**
 * Extract nutrition facts from label photo
 * @param {string} base64Image - Base64 encoded image with data URI prefix
 * @returns {Promise<Object>} Nutrition data or {error: string}
 */
export async function analyzeNutritionLabel(base64Image) {
  try {
    const response = await fetch(API_ENDPOINTS.ANALYZE_LABEL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    if (!response.ok) {
      throw new Error('Label analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Label analysis error:', error);
    throw error;
  }
}

/**
 * Estimate nutrition facts for a food (when no label available)
 * @param {string} foodName - Name of the food (e.g., "Grilled Chicken Breast")
 * @param {number} servingSize - Serving size (e.g., 100)
 * @param {string} servingUnits - Units (e.g., "g", "oz", "cup")
 * @returns {Promise<Object>} Nutrition data or {error: string}
 */
export async function estimateNutrition(foodName, servingSize = 100, servingUnits = 'g') {
  try {
    const response = await fetch(API_ENDPOINTS.ESTIMATE_NUTRITION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName, servingSize, servingUnits })
    });

    if (!response.ok) {
      throw new Error('Nutrition estimation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Nutrition estimation error:', error);
    throw error;
  }
}

/**
 * Check if server is online and configured
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    return await response.json();
  } catch (error) {
    return { status: 'offline', apiConfigured: false };
  }
}

/**
 * Compress image before sending to server
 * @param {File} file - Image file from input
 * @param {number} maxSizeMB - Maximum size in MB (default 1MB)
 * @returns {Promise<string>} Base64 encoded image
 */
export async function compressImage(file, maxSizeMB = 1) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions (maintain aspect ratio)
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to meet size requirement
        let quality = 0.9;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        // Reduce quality if image is too large
        while (base64.length > maxSizeMB * 1024 * 1024 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(base64);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

## Usage Examples

### 1. Daily Backup

Add this to your main App component or a backup service:

```javascript
import { sendBackup } from './services/apiService';
import { getAllFoodEntries, getAllFoodItems } from './utils/storage';

async function performDailyBackup() {
  // Check if backup is needed (once per day)
  const lastBackup = localStorage.getItem('lastBackupDate');
  const today = new Date().toISOString().split('T')[0];

  if (lastBackup === today) {
    return; // Already backed up today
  }

  try {
    const backupData = {
      foodEntries: await getAllFoodEntries(),
      foodItems: await getAllFoodItems(),
      routines: await getAllRoutines(),
      customExercises: await getCustomExercises(),
      customMachines: await getCustomMachines(),
      nutritionTargets: getNutritionTargets()
    };

    await sendBackup(backupData);
    localStorage.setItem('lastBackupDate', today);
    console.log('✅ Daily backup completed');
  } catch (error) {
    console.error('❌ Backup failed:', error);
    // Retry on next app open
  }
}

// Call on app load
useEffect(() => {
  performDailyBackup();
}, []);
```

### 2. Meal Photo Analysis

In your Nutrition Log component:

```javascript
import { analyzeMealPhoto, compressImage } from './services/apiService';

async function handleMealPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  setLoading(true);
  setError(null);

  try {
    // Compress image before sending
    const base64Image = await compressImage(file, 1); // Max 1MB

    // Analyze with AI
    const foods = await analyzeMealPhoto(base64Image);

    if (foods.length === 0) {
      setError('No foods identified. Please try a clearer photo.');
      return;
    }

    // Show preview modal with identified foods
    setIdentifiedFoods(foods);
    setShowFoodPreview(true);

  } catch (error) {
    setError('Failed to analyze meal photo. Please try again.');
  } finally {
    setLoading(false);
  }
}

// In your JSX
<input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={handleMealPhoto}
  style={{ display: 'none' }}
  ref={cameraInputRef}
/>
<button onClick={() => cameraInputRef.current.click()}>
  📷 Log Meal Photo
</button>
```

### 3. Nutrition Label OCR

In your Add Food Item form:

```javascript
import { analyzeNutritionLabel, compressImage } from './services/apiService';

async function handleLabelPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  setLoading(true);
  setError(null);

  try {
    // Compress image
    const base64Image = await compressImage(file, 1);

    // Extract nutrition facts
    const result = await analyzeNutritionLabel(base64Image);

    if (result.error) {
      setError('Could not read label. Please enter manually.');
      return;
    }

    // Auto-fill form fields (except food name)
    setFormData({
      ...formData,
      servingSize: result.servingSize,
      servingUnits: result.servingUnits,
      calories: result.calories,
      protein: result.protein,
      fat: result.fat,
      carbs: result.carbs
    });

  } catch (error) {
    setError('Failed to read label. Please enter manually.');
  } finally {
    setLoading(false);
  }
}
```

### 4. Offline Detection

Add offline detection to gracefully handle when server is unavailable:

```javascript
import { checkServerHealth } from './services/apiService';

function useServerStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const health = await checkServerHealth();
      setIsOnline(health.status === 'ok');
      setAiEnabled(health.apiConfigured);
    }

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { isOnline, aiEnabled };
}

// In your component
const { isOnline, aiEnabled } = useServerStatus();

// Show warning if offline
{!isOnline && (
  <div className="warning">
    ⚠️ Server offline. AI features unavailable.
  </div>
)}
```

## Testing Locally

### 1. Start Both Servers

```bash
# Terminal 1 - React dev server
npm run dev

# Terminal 2 - Backend server
cd server
npm start
```

### 2. Test Endpoints

Open `http://localhost:3000/test-ai.html` in your browser to test AI features with real images.

### 3. Check Server Health

Visit `http://localhost:3000/api/health` to verify the server is running and API key is configured.

## Deployment to Raspberry Pi

### 1. Build the React App

```bash
npm run build
```

This creates the `dist/` folder with optimized production files.

### 2. Copy Files to Pi

```bash
# Copy entire project to Pi
scp -r . pi@raspberrypi.local:~/freefit
```

### 3. Set Up Server

```bash
# SSH into Pi
ssh pi@raspberrypi.local

# Install dependencies
cd ~/freefit/server
npm install

# Configure environment
cp .env.example .env
nano .env  # Add your Claude API key

# Start server
npm start
```

### 4. Update Frontend API URL

Edit `src/config/api.js` and change production URL to your Pi's IP:

```javascript
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3000/api'
  : 'http://192.168.1.100:3000/api'; // Your Pi's IP
```

Then rebuild and deploy again.

## Network Configuration

### Find Your Pi's IP Address

```bash
hostname -I
```

### Allow Port Access

```bash
sudo ufw allow 3000
```

### Configure Router Port Forwarding (Optional)

For external access, forward port 3000 to your Pi's local IP in your router settings.

## Troubleshooting

### Camera Not Working on Mobile

Make sure you're using:
- `accept="image/*"` attribute
- `capture="environment"` for rear camera
- HTTPS or localhost (camera API requires secure context)

### CORS Errors

The server has CORS enabled by default. If you still get CORS errors:
1. Check that the API URL is correct
2. Verify the server is running
3. Check browser console for details

### Images Too Large

The server accepts up to 50MB, but images should be compressed to ~1MB for faster uploads. Use the `compressImage()` helper function.

### Rate Limiting

The AI endpoints are limited to 10 requests per minute. If you hit the limit:
- Wait 1 minute before retrying
- Implement client-side queuing
- Show a clear error message to users

## Security Notes

1. **API Key**: Never expose your Claude API key in the frontend code
2. **HTTPS**: Use HTTPS in production (set up nginx with Let's Encrypt)
3. **Rate Limiting**: The server has built-in rate limiting for AI endpoints
4. **Input Validation**: All endpoints validate input data
5. **File Uploads**: Only base64 images are accepted (no direct file uploads)

## Cost Monitoring

Track your Claude API usage:
- Visit [Anthropic Console](https://console.anthropic.com/)
- Check usage dashboard
- Set up billing alerts

Typical costs:
- ~$0.003 per meal photo
- ~90 photos/month = ~$0.27/month

## Complete Workflow Examples

### Workflow 1: Meal Photo with Auto-Generated Food Items

When a user takes a meal photo and the food isn't in their library:

```javascript
import { analyzeMealPhoto, estimateNutrition } from './services/apiService';
import { getFoodItemByName, createFoodItem } from './utils/storage';

async function handleMealPhoto(file) {
  setLoading(true);

  try {
    // Step 1: Analyze meal photo
    const base64 = await compressImage(file);
    const foods = await analyzeMealPhoto(base64);

    // Step 2: Check each food against library
    const foodsWithData = await Promise.all(
      foods.map(async (food) => {
        // Try to find in existing library
        let foodItem = await getFoodItemByName(food.name);

        if (!foodItem) {
          // Food not in library - offer to create it
          const shouldCreate = await confirmWithUser(
            `"${food.name}" not found in library. Generate nutrition estimate?`,
            ['Yes, estimate nutrition', 'Skip this food']
          );

          if (shouldCreate) {
            // Step 3: Get AI nutrition estimate
            const nutrition = await estimateNutrition(
              food.name,
              food.servingSize,
              food.servingUnits
            );

            if (!nutrition.error) {
              // Step 4: Create food item in library
              foodItem = await createFoodItem({
                name: food.name,
                servingSize: nutrition.servingSize,
                servingUnits: nutrition.servingUnits,
                caloriesPerServing: nutrition.calories,
                proteinPerServing: nutrition.protein,
                fatPerServing: nutrition.fat,
                carbsPerServing: nutrition.carbs,
                isCustom: true,
                isEstimated: true // Flag to show user this is estimated
              });
            }
          }
        }

        return {
          ...food,
          foodItem
        };
      })
    );

    // Step 5: Show preview and let user adjust servings
    showMealPreview(foodsWithData);

  } catch (error) {
    setError('Failed to analyze meal');
  } finally {
    setLoading(false);
  }
}
```

### Workflow 2: Manual Food Entry with Options

When user clicks "Add Food Item" button:

```javascript
import { analyzeNutritionLabel, estimateNutrition } from './services/apiService';

function AddFoodItemForm() {
  const [formData, setFormData] = useState({
    name: '',
    servingSize: 100,
    servingUnits: 'g',
    calories: '',
    protein: '',
    fat: '',
    carbs: ''
  });

  // Option 1: Scan nutrition label
  async function handleLabelScan(file) {
    setLoading(true);
    try {
      const base64 = await compressImage(file);
      const nutrition = await analyzeNutritionLabel(base64);

      if (!nutrition.error) {
        setFormData({
          ...formData,
          servingSize: nutrition.servingSize,
          servingUnits: nutrition.servingUnits,
          calories: nutrition.calories,
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs
        });
        showSuccess('Label scanned! Please enter food name.');
      } else {
        showError('Could not read label. Try manual entry or AI estimate.');
      }
    } catch (error) {
      showError('Label scan failed');
    } finally {
      setLoading(false);
    }
  }

  // Option 2: AI estimate nutrition
  async function handleEstimate() {
    if (!formData.name) {
      showError('Please enter food name first');
      return;
    }

    setLoading(true);
    try {
      const nutrition = await estimateNutrition(
        formData.name,
        formData.servingSize,
        formData.servingUnits
      );

      if (!nutrition.error) {
        setFormData({
          ...formData,
          calories: nutrition.calories,
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs
        });
        showWarning('Nutrition estimated - verify if possible!');
      } else {
        showError('Could not estimate nutrition');
      }
    } catch (error) {
      showError('Estimation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Food name"
      />

      <div className="input-methods">
        <button type="button" onClick={() => labelInputRef.current.click()}>
          📷 Scan Label
        </button>
        <button type="button" onClick={handleEstimate}>
          🤖 AI Estimate
        </button>
        <span>or enter manually below</span>
      </div>

      <input type="file" ref={labelInputRef} onChange={(e) => handleLabelScan(e.target.files[0])} />

      {/* Nutrition fields */}
      <input
        type="number"
        value={formData.servingSize}
        onChange={(e) => setFormData({...formData, servingSize: e.target.value})}
        placeholder="Serving size"
      />
      <input
        value={formData.servingUnits}
        onChange={(e) => setFormData({...formData, servingUnits: e.target.value})}
        placeholder="Units"
      />
      <input
        type="number"
        value={formData.calories}
        onChange={(e) => setFormData({...formData, calories: e.target.value})}
        placeholder="Calories"
      />
      {/* protein, fat, carbs inputs... */}

      <button type="submit">Save Food Item</button>
    </form>
  );
}
```

### Workflow 3: Smart Food Library Matching

Match AI-identified foods to existing library with fuzzy matching:

```javascript
async function findFoodInLibrary(aiSuggestedName) {
  // Try exact match first
  let foodItem = await getFoodItemByName(aiSuggestedName);
  if (foodItem) return foodItem;

  // Try fuzzy matching (simple example)
  const allFoods = await getAllFoodItems();
  const normalized = aiSuggestedName.toLowerCase();

  // Check for similar names
  foodItem = allFoods.find(food =>
    food.name.toLowerCase().includes(normalized) ||
    normalized.includes(food.name.toLowerCase())
  );

  if (foodItem) {
    // Ask user to confirm match
    const confirmed = await confirmWithUser(
      `Match "${aiSuggestedName}" to "${foodItem.name}"?`,
      ['Yes', 'No, create new']
    );
    return confirmed ? foodItem : null;
  }

  return null;
}
```

## Support

If you encounter issues:
1. Check server logs: `cd server && npm start`
2. Test with `test-ai.html`
3. Verify API key is set correctly
4. Check network connectivity
5. Review browser console for errors
