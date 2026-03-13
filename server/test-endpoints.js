/**
 * Test script for FreeFit server endpoints
 * Run with: node test-endpoints.js
 *
 * Make sure the server is running first: npm start
 */

const BASE_URL = 'http://localhost:3000';

// Test health endpoint
async function testHealth() {
  console.log('\n🔍 Testing /api/health...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health check:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

// Test backup endpoint
async function testBackup() {
  console.log('\n🔍 Testing /api/backup...');
  try {
    const sampleBackup = {
      timestamp: new Date().toISOString(),
      foodEntries: [
        {
          id: 'test_entry_1',
          foodItemId: 'test_food_1',
          servings: 1.5,
          timestamp: new Date().toISOString(),
          totalCalories: 168,
          totalProtein: 3.9,
          totalFat: 1.35,
          totalCarbs: 35.25
        }
      ],
      foodItems: [
        {
          id: 'test_food_1',
          name: 'Brown Rice',
          servingSize: 100,
          servingUnits: 'g',
          caloriesPerServing: 112,
          proteinPerServing: 2.6,
          fatPerServing: 0.9,
          carbsPerServing: 23.5
        }
      ],
      routines: [],
      customExercises: [],
      customMachines: [],
      nutritionTargets: {
        caloriesTarget: 2500,
        proteinTarget: 180,
        carbsTarget: 250,
        fatsTarget: 80
      }
    };

    const response = await fetch(`${BASE_URL}/api/backup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleBackup)
    });

    const data = await response.json();
    console.log('✅ Backup saved:', data);
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

// Test list backups
async function testListBackups() {
  console.log('\n🔍 Testing /api/backups...');
  try {
    const response = await fetch(`${BASE_URL}/api/backups`);
    const data = await response.json();
    console.log('✅ Backups found:', data.backups.length);
    data.backups.forEach(backup => {
      console.log(`   - ${backup.filename} (${(backup.size / 1024).toFixed(2)} KB)`);
    });
  } catch (error) {
    console.error('❌ List backups failed:', error.message);
  }
}

// Test meal analysis (requires a sample image)
async function testMealAnalysis() {
  console.log('\n🔍 Testing /api/analyze-meal...');
  console.log('⚠️  Skipped - requires actual image data');
  console.log('   Use the sample HTML file (test-ai.html) to test with real images');
}

// Test nutrition label (requires a sample image)
async function testNutritionLabel() {
  console.log('\n🔍 Testing /api/analyze-nutrition-label...');
  console.log('⚠️  Skipped - requires actual image data');
  console.log('   Use the sample HTML file (test-ai.html) to test with real images');
}

// Run all tests
async function runTests() {
  console.log('═══════════════════════════════════════');
  console.log('    FreeFit Server Endpoint Tests     ');
  console.log('═══════════════════════════════════════');

  await testHealth();
  await testBackup();
  await testListBackups();
  await testMealAnalysis();
  await testNutritionLabel();

  console.log('\n═══════════════════════════════════════');
  console.log('Tests complete!');
  console.log('═══════════════════════════════════════\n');
}

runTests();
