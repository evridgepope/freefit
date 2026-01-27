## How to Adjust Muscle Overlay Positioning

The muscle diagram uses clickable overlay regions positioned on top of anatomy images. If the overlays don't align perfectly with your images, follow these steps:

### 1. Locate the Configuration File

Open: `src/components/ImageMuscleDiagram.jsx`

### 2. Find the Muscle Regions Object

Look for the `muscleRegions` object (around line 8-143). It contains front and back view muscle definitions:

```javascript
const muscleRegions = {
  front: {
    pectoralis_major_upper: {
      name: 'Upper Pecs',
      x: 35,      // Left position (percentage)
      y: 23,      // Top position (percentage)
      width: 30,  // Width (percentage)
      height: 8   // Height (percentage)
    },
    // ... more muscles
  },
  back: {
    // ... back view muscles
  }
}
```

### 3. Understanding the Coordinate System

All values are **percentages** (0-100) for responsive scaling:

- **x**: Distance from left edge of image (%)
- **y**: Distance from top edge of image (%)
- **width**: Width of clickable region (%)
- **height**: Height of clickable region (%)
- **side**: `'both'` for bilateral muscles (arms, legs, delts) - creates mirrored regions

### 4. Visual Guide for Positioning

The overlays are **semi-transparent blue** by default, so you can see exactly where they're positioned on your anatomy images.

**To adjust a muscle overlay:**

1. Open the app in your browser
2. Navigate to any tab with the muscle diagram
3. You'll see light blue semi-transparent rectangles over muscles
4. Note which muscles need adjustment
5. Edit the coordinates in `ImageMuscleDiagram.jsx`
6. Save the file (hot reload will update instantly)

### 5. Example: Repositioning the Chest

If the upper pecs overlay is too low:

```javascript
// BEFORE
pectoralis_major_upper: {
  name: 'Upper Pecs',
  x: 35,
  y: 23,  // Too low
  width: 30,
  height: 8
}

// AFTER (moved up 2%)
pectoralis_major_upper: {
  name: 'Upper Pecs',
  x: 35,
  y: 21,  // Moved up
  width: 30,
  height: 8
}
```

### 6. Tips for Precise Positioning

- **Start with major muscle groups** (chest, back, legs) to establish baseline positioning
- **Use small increments** (1-2% at a time) for fine-tuning
- **Test both views** - front and back may need different adjustments
- **Check on mobile** - percentages scale responsively
- **Bilateral muscles** (side: 'both') automatically mirror left/right

### 7. Temporarily Make Overlays More Visible

If you need to see the overlays more clearly while positioning:

1. Open: `src/components/ImageMuscleDiagram.css`
2. Find the `.muscle-overlay` class (around line 45)
3. Temporarily increase the opacity:

```css
.muscle-overlay {
  /* Current (subtle for normal use) */
  background-color: rgba(0, 122, 255, 0.08);
  border: 1px solid rgba(0, 122, 255, 0.15);

  /* Temporary (more visible for positioning) */
  background-color: rgba(0, 122, 255, 0.3);
  border: 2px solid rgba(0, 122, 255, 0.5);
}
```

4. After positioning, revert back to subtle values

### 8. Available Muscle Regions

**Front View:**
- pectoralis_major_upper / pectoralis_major_lower
- anterior_deltoid / lateral_deltoid
- biceps_brachii / forearm_flexors
- rectus_abdominis / obliques_external
- quadriceps / hip_adductors / tibialis_anterior

**Back View:**
- trapezius_upper / trapezius_middle / trapezius_lower
- posterior_deltoid
- latissimus_dorsi / rhomboids / erector_spinae
- triceps_brachii / forearm_extensors
- gluteus_maximus / gluteus_medius
- hamstrings / gastrocnemius / soleus