# Advanced Landing Page Components - ProcessStepper & VendorMarketplace

This guide documents the two new advanced components created for the EVEA landing page, featuring scroll-triggered animations and interactive filtering systems.

## 🎯 ProcessStepper.js - Animated Vertical Stepper

**Location**: `src/components/ProcessStepper.js`

### Features

#### 1. **Scroll-Triggered Active Step Highlighting**
- **Dynamic Active State**: The step currently in the center of the viewport becomes the 'active' step
- **Glowing Background**: Active step gets a subtle purple glow using `box-shadow`
- **Icon Animation**: Active step's icon scales up (1.1x) and rotates slightly
- **Smooth Transitions**: All state changes are animated with Framer Motion

#### 2. **Connecting Line Animation**
- **Progressive Drawing**: Vertical line 'draws' itself as user scrolls down
- **Gradient Fill**: Line fills with vibrant purple gradient up to active step
- **Step Dots**: Animated dots that light up as they become active
- **Smooth Progress**: Uses `useScroll` and `useTransform` for accurate scroll mapping

#### 3. **Content Fade-In Animation**
- **Staggered Entrance**: Each step's content fades in and slides from right
- **Viewport Detection**: Uses `useInView` hook for precise trigger points
- **Performance Optimized**: Animations only trigger when elements are visible

### Technical Implementation

```jsx
// Scroll progress calculation
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start end", "end start"]
});

// Active step calculation
useEffect(() => {
  const unsubscribe = scrollYProgress.onChange((latest) => {
    const stepProgress = latest * 4; // 4 steps total
    const currentStep = Math.min(Math.floor(stepProgress), 3);
    setActiveStep(currentStep);
    setProgress(stepProgress / 4);
  });
  return unsubscribe;
}, [scrollYProgress]);
```

### Animation Variants

```jsx
// Step card animations
<motion.div
  animate={{ 
    opacity: isInView ? 1 : 0.3,
    x: isInView ? 0 : 50,
    scale: isActive ? 1.02 : 1
  }}
  style={{
    boxShadow: isActive 
      ? '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)' 
      : 'none'
  }}
/>
```

---

## 🛍️ VendorMarketplace.js - Interactive Filtering System

**Location**: `src/components/VendorMarketplace.js`

### Features

#### 1. **Dynamic Filter UI**
- **Category Buttons**: Filter by Photography, Catering, Decor, Entertainment, etc.
- **Active State**: Currently selected filter has distinct highlighted style
- **Count Badges**: Each filter shows number of available vendors
- **Mobile Responsive**: Collapsible filter menu for mobile devices

#### 2. **Live Filtering Logic**
- **Instant Filtering**: Client-side filtering without page reload
- **State Management**: Uses React's `useState` and `useMemo` for performance
- **Efficient Updates**: Only re-renders when filter changes

#### 3. **Animated Grid Transitions**
- **Layout Animations**: Cards smoothly rearrange when filters change
- **Exit Animations**: Filtered-out cards fade out and shrink
- **Entrance Animations**: New cards fade in and scale up
- **Staggered Timing**: Cards animate with slight delays for visual appeal

#### 4. **Enhanced Card Interactions**
- **Hover Effects**: Cards lift and scale on hover
- **Button Animations**: "Add to Package" button fills with gradient on hover
- **Shine Effect**: Subtle shine animation across buttons
- **Border Glow**: Card borders light up on hover

### Technical Implementation

```jsx
// Filter logic with useMemo for performance
const filteredVendors = useMemo(() => {
  if (activeFilter === 'all') return vendors;
  return vendors.filter(vendor => vendor.category === activeFilter);
}, [activeFilter, vendors]);

// Animated grid with AnimatePresence
<motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  <AnimatePresence mode="wait">
    {filteredVendors.map((vendor, index) => (
      <VendorCard key={vendor.id} vendor={vendor} index={index} />
    ))}
  </AnimatePresence>
</motion.div>
```

### Animation Details

```jsx
// Card layout animations
<motion.div
  layout
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
/>

// Button shine effect
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
  initial={{ x: '-100%' }}
  animate={{ x: isHovered ? '100%' : '-100%' }}
  transition={{ duration: 0.6 }}
/>
```

---

## 🎨 Design System Integration

### Color Palette
- **Primary Purple**: `#8B5CF6` (rgb(139, 92, 246))
- **Primary Pink**: `#EC4899` (rgb(236, 72, 153))
- **Background Dark**: `#000000` with opacity variations
- **Text Light**: `#ffffff` with gray variations

### Animation Timing
- **Fast**: 0.2s for micro-interactions
- **Medium**: 0.3s for card transitions
- **Slow**: 0.6s for complex animations
- **Staggered**: 0.1s delays between items

### Responsive Breakpoints
- **Mobile**: `< 768px` - Single column, simplified animations
- **Tablet**: `768px - 1024px` - Adjusted grid and spacing
- **Desktop**: `> 1024px` - Full feature set

---

## 🚀 Performance Optimizations

### ProcessStepper
1. **Intersection Observer**: Only animates visible elements
2. **Debounced Scroll**: Prevents excessive calculations
3. **CSS Transforms**: Hardware-accelerated animations
4. **Conditional Rendering**: Dots only render when needed

### VendorMarketplace
1. **useMemo**: Prevents unnecessary re-calculations
2. **Layout Animations**: Framer Motion's layout prop for smooth transitions
3. **AnimatePresence**: Efficient enter/exit animations
4. **Lazy Loading**: Components only render when visible

---

## 📱 Mobile Considerations

### ProcessStepper Mobile
- **Simplified Animations**: Reduced complexity for better performance
- **Touch-Friendly**: Larger touch targets
- **Reduced Motion**: Respects user preferences

### VendorMarketplace Mobile
- **Collapsible Filters**: Space-efficient filter menu
- **Touch Interactions**: Optimized for touch devices
- **Grid Responsiveness**: Adapts to screen size

---

## 🔧 Customization Options

### ProcessStepper Customization
```jsx
// Adjust animation timing
transition={{ duration: 0.6, delay: index * 0.1 }}

// Modify glow intensity
boxShadow: isActive 
  ? '0 0 30px rgba(139, 92, 246, 0.3)' 
  : 'none'

// Change step count
const totalSteps = 4; // Modify this value
```

### VendorMarketplace Customization
```jsx
// Add new categories
const categories = [
  { id: 'new-category', name: 'New Category', icon: NewIcon }
];

// Modify grid layout
className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"

// Adjust animation delays
transition={{ duration: 0.3, delay: index * 0.1 }}
```

---

## 🐛 Troubleshooting

### Common Issues

#### ProcessStepper
1. **Scroll Not Detected**
   - Check `useScroll` target and offset settings
   - Ensure container has proper height
   - Verify scroll container is scrollable

2. **Animations Not Smooth**
   - Use `transform` instead of layout properties
   - Check for conflicting CSS animations
   - Verify hardware acceleration is enabled

#### VendorMarketplace
1. **Filter Not Working**
   - Check category IDs match between data and filters
   - Verify `useMemo` dependencies are correct
   - Ensure state updates are triggering re-renders

2. **Layout Jank**
   - Use `layout` prop on motion components
   - Avoid animating layout properties
   - Check for CSS conflicts

---

## 📈 Performance Metrics

### Target Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Animation Frame Rate**: 60fps

### Monitoring Tools
- Chrome DevTools Performance tab
- Lighthouse for Core Web Vitals
- React DevTools Profiler
- Framer Motion DevTools

---

## 🚀 Future Enhancements

### ProcessStepper
1. **Progress Persistence**: Save scroll position
2. **Step Validation**: Mark completed steps
3. **Custom Icons**: Allow custom step icons
4. **Accessibility**: Enhanced screen reader support

### VendorMarketplace
1. **Search Functionality**: Text-based search
2. **Sorting Options**: Price, rating, availability
3. **Favorites System**: Save preferred vendors
4. **Advanced Filters**: Date, location, budget range

---

## 📚 Additional Resources

- [Framer Motion Layout Animations](https://www.framer.com/motion/layout-animations/)
- [React useMemo Hook](https://reactjs.org/docs/hooks-reference.html#usememo)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Note**: These components are designed for modern browsers with ES6+ support. For older browsers, consider providing fallback static versions or progressive enhancement strategies.
