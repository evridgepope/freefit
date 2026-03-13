const API_BASE = 'http://localhost:3000/api';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Preview meal photo
  document.getElementById('mealPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('mealPreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Preview label photo
  document.getElementById('labelPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('labelPreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // Attach button event listeners
  document.getElementById('analyzeMealBtn').addEventListener('click', testMealAnalysis);
  document.getElementById('clearMealBtn').addEventListener('click', clearMealTest);
  document.getElementById('extractLabelBtn').addEventListener('click', testLabelOCR);
  document.getElementById('clearLabelBtn').addEventListener('click', clearLabelTest);
  document.getElementById('estimateNutritionBtn').addEventListener('click', testNutritionEstimation);
  document.getElementById('clearEstimateBtn').addEventListener('click', clearEstimateTest);
});

async function testMealAnalysis() {
  const fileInput = document.getElementById('mealPhoto');
  const resultDiv = document.getElementById('mealResult');

  if (!fileInput.files[0]) {
    resultDiv.innerHTML = '<div class="error">Please select an image first!</div>';
    return;
  }

  resultDiv.innerHTML = '<div class="loading">🔄 Analyzing meal photo...</div>';

  try {
    // Convert image to base64
    const base64 = await fileToBase64(fileInput.files[0]);

    // Call API
    const response = await fetch(`${API_BASE}/analyze-meal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 })
    });

    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<div class="error">❌ Error: ${data.error}</div>`;
    } else if (data.foods && data.foods.length > 0) {
      let html = '<div class="success">✅ Foods identified:</div><div class="result">';
      data.foods.forEach((food, index) => {
        html += `\n${index + 1}. ${food.name}`;
        html += `\n   Portion: ${food.servingSize} ${food.servingUnits}`;
        html += `\n`;
      });
      html += '</div>';
      resultDiv.innerHTML = html;
    } else {
      resultDiv.innerHTML = '<div class="error">⚠️ No foods identified in the image.</div>';
    }

  } catch (error) {
    resultDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
  }
}

async function testLabelOCR() {
  const fileInput = document.getElementById('labelPhoto');
  const resultDiv = document.getElementById('labelResult');

  if (!fileInput.files[0]) {
    resultDiv.innerHTML = '<div class="error">Please select an image first!</div>';
    return;
  }

  resultDiv.innerHTML = '<div class="loading">🔄 Extracting nutrition label...</div>';

  try {
    // Convert image to base64
    const base64 = await fileToBase64(fileInput.files[0]);

    // Call API
    const response = await fetch(`${API_BASE}/analyze-nutrition-label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 })
    });

    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<div class="error">❌ ${data.error}</div>`;
    } else {
      let html = '<div class="success">✅ Nutrition facts extracted:</div><div class="result">';
      html += `Serving Size: ${data.servingSize} ${data.servingUnits}\n`;
      html += `Calories: ${data.calories}\n`;
      html += `Protein: ${data.protein}g\n`;
      html += `Fat: ${data.fat}g\n`;
      html += `Carbs: ${data.carbs}g`;
      html += '</div>';
      resultDiv.innerHTML = html;
    }

  } catch (error) {
    resultDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
  }
}

function clearMealTest() {
  document.getElementById('mealPhoto').value = '';
  document.getElementById('mealPreview').style.display = 'none';
  document.getElementById('mealResult').innerHTML = '';
}

function clearLabelTest() {
  document.getElementById('labelPhoto').value = '';
  document.getElementById('labelPreview').style.display = 'none';
  document.getElementById('labelResult').innerHTML = '';
}

async function testNutritionEstimation() {
  const foodName = document.getElementById('foodNameInput').value.trim();
  const servingSize = document.getElementById('servingSizeInput').value;
  const servingUnits = document.getElementById('servingUnitsInput').value.trim();
  const resultDiv = document.getElementById('estimateResult');

  if (!foodName) {
    resultDiv.innerHTML = '<div class="error">Please enter a food name!</div>';
    return;
  }

  resultDiv.innerHTML = '<div class="loading">🔄 Estimating nutrition facts...</div>';

  try {
    const response = await fetch(`${API_BASE}/estimate-nutrition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        foodName,
        servingSize: parseFloat(servingSize) || 100,
        servingUnits: servingUnits || 'g'
      })
    });

    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `<div class="error">❌ ${data.error}</div>`;
    } else {
      let html = '<div class="success">✅ Nutrition estimated:</div><div class="result">';
      html += `Food: ${foodName}\n`;
      html += `Serving Size: ${data.servingSize} ${data.servingUnits}\n`;
      html += `Calories: ${data.calories}\n`;
      html += `Protein: ${data.protein}g\n`;
      html += `Fat: ${data.fat}g\n`;
      html += `Carbs: ${data.carbs}g\n`;
      html += '\n⚠️ These are estimates. Verify with actual label if available.';
      html += '</div>';
      resultDiv.innerHTML = html;
    }

  } catch (error) {
    resultDiv.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
  }
}

function clearEstimateTest() {
  document.getElementById('foodNameInput').value = '';
  document.getElementById('servingSizeInput').value = '100';
  document.getElementById('servingUnitsInput').value = 'g';
  document.getElementById('estimateResult').innerHTML = '';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
