import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for PWA
app.use(express.json({ limit: '50mb' })); // Support large base64 images
app.use(express.static(path.join(__dirname, '..', 'dist'))); // Serve PWA build

// Rate limiting for AI endpoints (10 requests per minute per IP)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many AI requests. Please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Ensure backups directory exists
const backupsDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Helper function to get formatted date for filename
function getDateString(date = new Date()) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ============================================================================
// BACKUP ENDPOINT
// ============================================================================

app.post('/api/backup', async (req, res) => {
  try {
    const backupData = req.body;

    // Validate backup data
    if (!backupData || typeof backupData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid backup data'
      });
    }

    // Add server timestamp
    backupData.serverTimestamp = new Date().toISOString();

    // Generate filename with date
    const dateString = getDateString();
    const filename = `backup_${dateString}.json`;
    const filepath = path.join(backupsDir, filename);

    // Write backup file
    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));

    console.log(`✅ Backup saved: ${filename}`);

    res.json({
      success: true,
      filename,
      timestamp: backupData.serverTimestamp
    });

  } catch (error) {
    console.error('❌ Backup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save backup'
    });
  }
});

// ============================================================================
// AI PROXY ENDPOINTS
// ============================================================================

/**
 * POST /api/analyze-meal
 * Analyzes a photo of a meal and identifies foods with portion estimates
 * Body: { image: "base64_encoded_image" }
 * Returns: { foods: [{ name, servingSize, servingUnits, foodItemId }] }
 */
app.post('/api/analyze-meal', aiLimiter, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        error: 'No image provided'
      });
    }

    // Validate base64 format
    const base64Pattern = /^data:image\/(png|jpg|jpeg|webp);base64,/;
    if (!base64Pattern.test(image)) {
      return res.status(400).json({
        error: 'Invalid image format. Must be base64 encoded image.'
      });
    }

    // Extract media type and base64 data
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    let mediaType = `image/${matches[1]}`;
    const base64Data = matches[2];

    // Normalize media type (jpg -> jpeg)
    if (mediaType === 'image/jpg') {
      mediaType = 'image/jpeg';
    }

    // Detect actual image format from magic bytes
    const buffer = Buffer.from(base64Data, 'base64');
    const magicBytes = buffer.slice(0, 4).toString('hex');

    // Detect format from file signature
    if (magicBytes.startsWith('ffd8ff')) {
      mediaType = 'image/jpeg';
    } else if (magicBytes.startsWith('89504e47')) {
      mediaType = 'image/png';
    } else if (magicBytes.startsWith('47494638')) {
      mediaType = 'image/gif';
    } else if (magicBytes.startsWith('52494646')) {
      mediaType = 'image/webp';
    }

    console.log('🔍 Analyzing meal photo... (detected format:', mediaType, ')');

    // Call Claude API with vision
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Analyze this photo of a meal. For each food item visible, identify:
1. The food name (be specific, e.g., "Grilled Chicken Breast" not just "Chicken")
2. Estimated portion size as a number
3. Units for the portion (g, oz, cup, piece, slice, etc.)

Return ONLY a JSON array with no other text. Each food should be an object with:
- name: string
- servingSize: number
- servingUnits: string

Example:
[
  { "name": "Grilled Chicken Breast", "servingSize": 200, "servingUnits": "g" },
  { "name": "Brown Rice", "servingSize": 150, "servingUnits": "g" },
  { "name": "Steamed Broccoli", "servingSize": 100, "servingUnits": "g" }
]

If you cannot identify any foods, return an empty array: []`
            }
          ],
        },
      ],
    });

    // Extract response text
    const responseText = message.content[0].text;

    // Parse JSON response
    let foods;
    try {
      // Try to extract JSON from response (in case Claude added extra text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        foods = JSON.parse(jsonMatch[0]);
      } else {
        foods = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return res.status(500).json({
        error: 'Failed to parse AI response',
        foods: []
      });
    }

    // Add foodItemId as null (client will match to library)
    const foodsWithIds = foods.map(food => ({
      ...food,
      foodItemId: null
    }));

    console.log(`✅ Identified ${foodsWithIds.length} food items`);

    res.json({ foods: foodsWithIds });

  } catch (error) {
    console.error('❌ Meal analysis error:', error);

    // Handle specific Anthropic errors
    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed. Check server configuration.'
      });
    }

    res.status(500).json({
      error: 'Failed to analyze meal photo. Please try again.',
      foods: []
    });
  }
});

/**
 * POST /api/analyze-nutrition-label
 * OCR extraction of nutrition facts from a label photo
 * Body: { image: "base64_encoded_image" }
 * Returns: { servingSize, servingUnits, calories, protein, fat, carbs }
 *       OR: { error: "Could not read label" }
 */
app.post('/api/analyze-nutrition-label', aiLimiter, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        error: 'No image provided'
      });
    }

    // Validate base64 format
    const base64Pattern = /^data:image\/(png|jpg|jpeg|webp);base64,/;
    if (!base64Pattern.test(image)) {
      return res.status(400).json({
        error: 'Invalid image format. Must be base64 encoded image.'
      });
    }

    // Extract media type and base64 data
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    let mediaType = `image/${matches[1]}`;
    const base64Data = matches[2];

    // Normalize media type (jpg -> jpeg)
    if (mediaType === 'image/jpg') {
      mediaType = 'image/jpeg';
    }

    // Detect actual image format from magic bytes
    const buffer = Buffer.from(base64Data, 'base64');
    const magicBytes = buffer.slice(0, 4).toString('hex');

    // Detect format from file signature
    if (magicBytes.startsWith('ffd8ff')) {
      mediaType = 'image/jpeg';
    } else if (magicBytes.startsWith('89504e47')) {
      mediaType = 'image/png';
    } else if (magicBytes.startsWith('47494638')) {
      mediaType = 'image/gif';
    } else if (magicBytes.startsWith('52494646')) {
      mediaType = 'image/webp';
    }

    console.log('📋 Analyzing nutrition label... (detected format:', mediaType, ')');

    // Call Claude API with vision
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `Extract nutrition facts from this food label photo. Return ONLY a JSON object with no other text.

Required fields:
- servingSize: number (e.g., 100 for "100g" or 1 for "1 cup")
- servingUnits: string (e.g., "g", "oz", "cup", "piece")
- calories: number (total calories per serving)
- protein: number (grams of protein per serving)
- fat: number (grams of total fat per serving)
- carbs: number (grams of total carbohydrates per serving)

Example response:
{
  "servingSize": 100,
  "servingUnits": "g",
  "calories": 112,
  "protein": 2.6,
  "fat": 0.9,
  "carbs": 23.5
}

If you cannot read the label clearly or any required field is missing, return:
{ "error": "Could not read label" }`
            }
          ],
        },
      ],
    });

    // Extract response text
    const responseText = message.content[0].text;

    // Parse JSON response
    let nutritionData;
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[0]);
      } else {
        nutritionData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return res.json({ error: 'Could not read label' });
    }

    // Check if AI returned error
    if (nutritionData.error) {
      console.log('⚠️  Could not read nutrition label');
      return res.json({ error: 'Could not read label' });
    }

    // Validate all required fields are present
    const requiredFields = ['servingSize', 'servingUnits', 'calories', 'protein', 'fat', 'carbs'];
    const missingFields = requiredFields.filter(field => !(field in nutritionData));

    if (missingFields.length > 0) {
      console.log('⚠️  Missing fields:', missingFields);
      return res.json({ error: 'Could not read label' });
    }

    console.log('✅ Nutrition label extracted successfully');

    res.json(nutritionData);

  } catch (error) {
    console.error('❌ Label analysis error:', error);

    // Handle specific Anthropic errors
    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed. Check server configuration.'
      });
    }

    res.json({ error: 'Could not read label' });
  }
});

/**
 * POST /api/estimate-nutrition
 * Estimates nutrition facts for a food item when no label is available
 * Body: { foodName: "Grilled Chicken Breast", servingSize: 200, servingUnits: "g" }
 * Returns: { servingSize, servingUnits, calories, protein, fat, carbs }
 */
app.post('/api/estimate-nutrition', aiLimiter, async (req, res) => {
  try {
    const { foodName, servingSize, servingUnits } = req.body;

    if (!foodName) {
      return res.status(400).json({
        error: 'Food name is required'
      });
    }

    console.log(`🧮 Estimating nutrition for: ${foodName} (${servingSize}${servingUnits})...`);

    // Call Claude API for nutrition estimation
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `Estimate the nutrition facts for this food item: "${foodName}"

Serving size: ${servingSize || 100} ${servingUnits || 'g'}

Provide realistic estimates based on typical nutritional values for this food. Return ONLY a JSON object with no other text.

Required fields:
- servingSize: number (use ${servingSize || 100})
- servingUnits: string (use "${servingUnits || 'g'}")
- calories: number (total calories per serving)
- protein: number (grams of protein per serving)
- fat: number (grams of total fat per serving)
- carbs: number (grams of total carbohydrates per serving)

Example response:
{
  "servingSize": 100,
  "servingUnits": "g",
  "calories": 165,
  "protein": 31,
  "fat": 3.6,
  "carbs": 0
}

If you cannot make a reasonable estimate, return:
{ "error": "Could not estimate nutrition for this food" }`
        },
      ],
    });

    // Extract response text
    const responseText = message.content[0].text;

    // Parse JSON response
    let nutritionData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[0]);
      } else {
        nutritionData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return res.json({ error: 'Could not estimate nutrition' });
    }

    // Check if AI returned error
    if (nutritionData.error) {
      console.log('⚠️  Could not estimate nutrition');
      return res.json({ error: 'Could not estimate nutrition' });
    }

    // Validate required fields
    const requiredFields = ['servingSize', 'servingUnits', 'calories', 'protein', 'fat', 'carbs'];
    const missingFields = requiredFields.filter(field => !(field in nutritionData));

    if (missingFields.length > 0) {
      console.log('⚠️  Missing fields:', missingFields);
      return res.json({ error: 'Could not estimate nutrition' });
    }

    console.log('✅ Nutrition estimated successfully');

    res.json(nutritionData);

  } catch (error) {
    console.error('❌ Nutrition estimation error:', error);

    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed. Check server configuration.'
      });
    }

    res.json({ error: 'Could not estimate nutrition' });
  }
});

// ============================================================================
// HEALTH CHECK & INFO ENDPOINTS
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiConfigured: !!process.env.CLAUDE_API_KEY
  });
});

app.get('/api/backups', (req, res) => {
  try {
    const files = fs.readdirSync(backupsDir)
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first

    const backups = files.map(file => {
      const filepath = path.join(backupsDir, file);
      const stats = fs.statSync(filepath);
      return {
        filename: file,
        date: file.replace('backup_', '').replace('.json', ''),
        size: stats.size,
        modified: stats.mtime
      };
    });

    res.json({ backups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

// ============================================================================
// SERVE TEST FILES (before catch-all)
// ============================================================================

app.get('/test-ai.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-ai.html'));
});

app.get('/test-ai.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'test-ai.js'));
});

app.get('/test-endpoints.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-endpoints.js'));
});

// ============================================================================
// SERVE PWA (catch-all for client-side routing)
// ============================================================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                    FreeFit Server                          ║
╚════════════════════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
📁 Serving PWA from: ${path.join(__dirname, '..', 'dist')}
💾 Backups directory: ${backupsDir}
🤖 AI features: ${process.env.CLAUDE_API_KEY ? '✅ Enabled' : '❌ Disabled (no API key)'}

Endpoints:
  POST   /api/backup                - Save daily backup
  POST   /api/analyze-meal          - AI meal recognition
  POST   /api/analyze-nutrition-label - AI label OCR
  GET    /api/health                - Health check
  GET    /api/backups               - List backups

Local URL: http://localhost:${PORT}
  `);

  if (!process.env.CLAUDE_API_KEY) {
    console.warn(`
⚠️  WARNING: CLAUDE_API_KEY not found in environment variables.
   AI features will not work until you set up your .env file.
   See .env.example for instructions.
`);
  }
});
