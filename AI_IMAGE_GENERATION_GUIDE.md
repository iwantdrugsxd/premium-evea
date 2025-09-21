# 🎨 AI Image Generation Guide for EVEA Event Types

## 📁 Folder Structure Setup

Create the following folder structure in your project:

```
evea-nextjs/
├── public/
│   └── event-images/
│       ├── wedding.jpg
│       ├── birthday-party.jpg
│       ├── corporate-event.jpg
│       ├── anniversary.jpg
│       ├── cultural-event.jpg
│       └── custom-event.jpg
```

## 🤖 AI Image Generation Prompts

### 1. **Wedding** (`wedding.jpg`)
**Prompt for Midjourney/DALL-E/Stable Diffusion:**
```
A romantic wedding celebration with elegant decorations, soft lighting, white flowers, and a beautiful couple. Soft, dreamy atmosphere with purple and pink accents. High-quality, professional photography style, 16:9 aspect ratio, photorealistic
```

**Alternative Prompt:**
```
Elegant wedding reception with crystal chandeliers, white roses, golden accents, and romantic lighting. Soft bokeh background, professional event photography, cinematic composition
```

### 2. **Birthday Party** (`birthday-party.jpg`)
**Prompt for Midjourney/DALL-E/Stable Diffusion:**
```
Colorful birthday party celebration with balloons, confetti, cake, and happy people. Vibrant colors, festive atmosphere, party decorations. High-quality, joyful photography style, 16:9 aspect ratio
```

**Alternative Prompt:**
```
Fun birthday party setup with colorful balloons, streamers, birthday cake, and party favors. Bright, cheerful lighting, celebration atmosphere, professional event photography
```

### 3. **Corporate Event** (`corporate-event.jpg`)
**Prompt for Midjourney/DALL-E/Stable Diffusion:**
```
Professional corporate event with modern conference setup, LED screens, professional lighting, and business people networking. Clean, sophisticated design, corporate atmosphere, high-quality photography
```

**Alternative Prompt:**
```
Corporate conference hall with stage, presentation screens, professional lighting, and business professionals. Modern, clean aesthetic, professional event photography, corporate branding elements
```

### 4. **Anniversary** (`anniversary.jpg`)
**Prompt for Midjourney/DALL-E/Stable Diffusion:**
```
Romantic anniversary celebration with candles, roses, champagne, and intimate setting. Warm, romantic lighting, elegant decorations, couple's celebration. High-quality, intimate photography style
```

**Alternative Prompt:**
```
Anniversary dinner setup with candlelight, rose petals, wine glasses, and romantic atmosphere. Intimate, elegant setting, warm lighting, celebration photography
```

### 5. **Cultural Event** (`cultural-event.jpg`)
**Prompt for Midjourney/DALL-E/Stable Diffusion:**
```
Cultural festival celebration with traditional decorations, colorful costumes, cultural symbols, and diverse people celebrating. Vibrant, cultural atmosphere, traditional elements, festival photography
```

**Alternative Prompt:**
```
Cultural event with traditional music instruments, colorful cultural decorations, traditional attire, and celebration atmosphere. Cultural heritage elements, vibrant colors, festival photography
```

### 6. **Custom Event** (`custom-event.jpg`)
**Prompt for Midjourney/DALL-E/Stable Diffusion:**
```
Unique custom event setup with creative decorations, innovative lighting, and personalized elements. Creative, artistic atmosphere, unique design, custom celebration photography
```

**Alternative Prompt:**
```
Custom event with creative lighting, unique decorations, artistic elements, and personalized celebration setup. Innovative design, creative atmosphere, custom event photography
```

## 🎯 Image Specifications

### **Technical Requirements:**
- **Resolution:** 800x600px (4:3) or 1200x800px (3:2)
- **Format:** JPG or PNG
- **Quality:** High quality, professional appearance
- **Style:** Consistent with EVEA's dark theme and purple/pink color scheme

### **Design Elements:**
- **Color Palette:** Purple, pink, white, and accent colors
- **Lighting:** Soft, atmospheric lighting
- **Composition:** Professional event photography style
- **Mood:** Celebratory, elegant, and inviting

## 🚀 AI Tools to Use

### **1. Midjourney (Recommended)**
- **Best for:** High-quality, artistic images
- **Style:** Add `--ar 16:9` for aspect ratio
- **Quality:** Add `--q 2` for high quality

### **2. DALL-E 3**
- **Best for:** Realistic, detailed images
- **Style:** Use detailed descriptions
- **Quality:** High quality setting

### **3. Stable Diffusion**
- **Best for:** Customizable, artistic images
- **Style:** Use negative prompts for unwanted elements
- **Quality:** High resolution settings

### **4. Leonardo.ai**
- **Best for:** Creative, artistic images
- **Style:** Multiple style options
- **Quality:** High resolution output

## 📝 Generation Tips

### **For Best Results:**
1. **Use specific details** in your prompts
2. **Include style keywords** like "professional photography", "high-quality"
3. **Specify lighting** and atmosphere
4. **Mention color schemes** that match EVEA's theme
5. **Use consistent aspect ratios** for uniform appearance

### **Negative Prompts (Stable Diffusion):**
```
blurry, low quality, distorted, watermark, text, logo, signature, ugly, deformed, bad anatomy
```

### **Style Modifiers:**
- Add `--v 6` for Midjourney version 6
- Add `--s 750` for Midjourney style
- Add `--ar 16:9` for aspect ratio

## 🔄 Updating Images

### **When to Regenerate:**
- **Style inconsistency** with other images
- **Quality issues** or blurriness
- **Color scheme mismatch** with EVEA theme
- **Composition problems** or awkward framing

### **Iteration Process:**
1. Generate initial image
2. Refine prompt based on results
3. Regenerate with improved prompt
4. Repeat until satisfied
5. Save final version to `public/event-images/`

## 🎨 Integration with EVEA

### **CSS Classes Used:**
- `bg-cover bg-center bg-no-repeat` for background images
- `opacity-40 group-hover:opacity-60` for hover effects
- `backdrop-blur-sm` for glassmorphism effects
- `rounded-xl` for rounded corners

### **Responsive Design:**
- Images scale properly on all devices
- Hover effects work on desktop
- Touch-friendly on mobile devices

## 📱 Testing

### **After Adding Images:**
1. **Check file paths** are correct
2. **Verify image loading** in browser
3. **Test hover effects** on desktop
4. **Check mobile responsiveness**
5. **Verify image quality** and sizing

---

**Happy Image Generating! 🎉**

Your event type cards will now have beautiful, professional background images that enhance the user experience and make the community page more visually appealing.
