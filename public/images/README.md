# Muscle Diagram Images

This folder should contain the anatomical muscle diagram images for the FreeFit app.

## Required Images

You need two high-quality muscle anatomy images:

1. **muscles-front.png** - Front view of human muscular system
2. **muscles-back.png** - Back view of human muscular system

## Image Requirements

- **Format**: PNG or JPG (PNG preferred for transparency)
- **Dimensions**: At least 800x1200px (aspect ratio ~1:1.4)
- **Quality**: High resolution, clear muscle definition
- **Style**: Anatomical illustration (not photo-realistic)
- **Background**: White or transparent
- **Labels**: No text labels on the image itself

## Where to Find Images

### Free Resources (with attribution)

1. **Freepik** (https://www.freepik.com)
   - Search: "muscle anatomy illustration"
   - Filter: Free
   - Download license: Free with attribution

2. **Vecteezy** (https://www.vecteezy.com)
   - Search: "human muscles diagram"
   - Many free vector illustrations
   - Can export as high-res PNG

3. **Pixabay** (https://pixabay.com)
   - Search: "muscle anatomy"
   - Completely free, no attribution required

4. **Wikimedia Commons** (https://commons.wikimedia.org)
   - Search: "muscular system"
   - Public domain images available

### Paid Resources (royalty-free)

1. **Shutterstock** (https://www.shutterstock.com)
   - Professional quality
   - One-time purchase license

2. **Adobe Stock** (https://stock.adobe.com)
   - High-quality medical illustrations

3. **iStock** (https://www.istockphoto.com)
   - Medical and fitness illustrations

## Recommended Search Terms

- "muscle anatomy illustration"
- "human muscular system diagram"
- "body muscles chart"
- "anatomical muscles front back"
- "fitness anatomy illustration"

## Example Sources to Try

- Freepik: https://www.freepik.com/free-photos-vectors/muscle-anatomy
- Vecteezy: https://www.vecteezy.com/free-vector/muscle-anatomy
- Flaticon: https://www.flaticon.com/search?word=muscle

## After Adding Images

Once you've added the images:

1. Place them in this `/public/images/` folder
2. Name them exactly: `muscles-front.png` and `muscles-back.png`
3. The app will automatically load them
4. You may need to adjust the overlay coordinates in `ImageMuscleDiagram.jsx` to match your specific images

## Adjusting Overlay Coordinates

If the clickable regions don't align with your images:

1. Open `src/components/ImageMuscleDiagram.jsx`
2. Find the `muscleRegions` object
3. Adjust the `x`, `y`, `width`, `height` percentages for each muscle
4. The coordinates are percentage-based for responsive scaling

## License Compliance

Make sure to:
- Check the license of any images you use
- Provide attribution if required
- Keep a copy of the license terms
- For commercial use, ensure you have the appropriate rights
