# EventPlannerWizard.js - Multi-Step Event Planning System

This guide documents the comprehensive EventPlannerWizard system that transforms the static multi-page form into a single, fluid, and highly interactive component for planning events.

## 🎯 **System Overview**

The EventPlannerWizard is a modular, multi-step form system that guides users through event planning with smooth animations, real-time validation, and interactive elements.

### **Main Components**
- **EventPlannerWizard.js**: Main parent component managing state and navigation
- **StepEventType.js**: Event type selection with enhanced hover effects
- **StepPackage.js**: Package selection with 3D tilt effects
- **StepServices.js**: Service selection with animated toggles
- **StepEventDetails.js**: Event details with floating labels
- **EventSummary.js**: Real-time summary sidebar

## ✨ **Key Features**

### 1. **Smooth Step Transitions**
- **Slide Animations**: Current step slides out left, next step slides in from right
- **Reverse Animation**: Back button triggers reverse slide animation
- **Spring Physics**: Natural, bouncy transitions using Framer Motion
- **Direction Awareness**: Different animations for forward/backward navigation

### 2. **Dynamic Progress Bar**
- **Visual Progress**: Animated progress bar showing completion percentage
- **Step Indicators**: Clear "Step X of Y" display
- **Smooth Fill**: Progress bar animates as user progresses
- **Real-time Updates**: Updates immediately on step changes

### 3. **Enhanced Step Interactions**

#### **Step 1: Event Type Selection**
- **Hover Effects**: Cards zoom (1.03x) with glowing purple borders
- **Selection Animation**: Checkmark icon animates in on selection
- **Visual Feedback**: Selected cards get persistent bold borders
- **Darkening Overlay**: Hover overlay makes white text pop

#### **Step 2: Package Selection**
- **3D Tilt Effects**: Cards tilt on hover using react-parallax-tilt
- **Gradient Borders**: Selected packages get vibrant gradient borders
- **Transparency Effect**: Unselected cards become semi-transparent
- **Popular Badge**: "Most Popular" badge with rotation animation

#### **Step 3: Service Selection**
- **Animated Toggles**: Custom switch components with smooth sliding
- **Journey Animation**: Services animate from available to selected list
- **Tag System**: Selected services appear as animated tags
- **Real-time Pricing**: Dynamic cost calculation and display

#### **Step 4: Event Details**
- **Floating Labels**: Placeholder text animates up to become labels
- **Real-time Validation**: Instant feedback with checkmark icons
- **Icon Integration**: Each field has contextual icons
- **Form Validation**: Comprehensive validation with visual indicators

### 4. **Persistent Summary View**
- **Real-time Updates**: Summary updates as user makes selections
- **Desktop Sidebar**: Fixed sidebar on desktop with live updates
- **Mobile Accordion**: Collapsible summary on mobile devices
- **Cost Estimation**: Dynamic pricing calculation
- **Visual Hierarchy**: Clear organization of selected items

## 🛠️ **Technical Implementation**

### **State Management**
```jsx
const [formData, setFormData] = useState({
  eventType: null,
  package: null,
  services: [],
  eventDetails: {
    eventName: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    venue: '',
    specialRequests: ''
  }
});
```

### **Animation System**
```jsx
// Step transition variants
const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};
```

### **Progress Bar Animation**
```jsx
const progressVariants = {
  initial: { width: 0 },
  animate: (progress) => ({
    width: `${progress}%`,
    transition: { duration: 0.5, ease: "easeOut" }
  })
};
```

## 🎨 **Design System**

### **Color Palette**
- **Primary Purple**: `#8B5CF6` (rgb(139, 92, 246))
- **Primary Pink**: `#EC4899` (rgb(236, 72, 153))
- **Success Green**: `#10B981` (rgb(16, 185, 129))
- **Warning Orange**: `#F59E0B` (rgb(245, 158, 11))
- **Error Red**: `#EF4444` (rgb(239, 68, 68))

### **Animation Timing**
- **Fast**: 0.2s for micro-interactions
- **Medium**: 0.3s for card transitions
- **Slow**: 0.5s for step transitions
- **Spring**: Natural physics for bouncy effects

### **Responsive Breakpoints**
- **Mobile**: `< 768px` - Stacked layout, mobile summary
- **Tablet**: `768px - 1024px` - Adjusted spacing
- **Desktop**: `> 1024px` - Full sidebar, all features

## 📱 **Responsive Design**

### **Mobile Optimizations**
- **Collapsible Summary**: Mobile summary modal with slide-up animation
- **Touch-Friendly**: Larger touch targets for mobile interactions
- **Simplified Layout**: Stacked form fields on smaller screens
- **Swipe Gestures**: Potential for swipe navigation between steps

### **Desktop Enhancements**
- **Persistent Sidebar**: Fixed summary sidebar with live updates
- **Hover Effects**: Full hover interactions and micro-animations
- **3D Effects**: Complete 3D tilt effects on package cards
- **Multi-column Layout**: Side-by-side form fields

## 🚀 **Performance Optimizations**

### **Animation Performance**
- **CSS Transforms**: All animations use transform and opacity
- **Hardware Acceleration**: `will-change` properties for smooth animations
- **Reduced Motion**: Respects user's motion preferences
- **Efficient Re-renders**: Minimal state updates and re-renders

### **Bundle Optimization**
- **Code Splitting**: Lazy loading of step components
- **Tree Shaking**: Only import used Framer Motion features
- **Memoization**: useMemo for expensive calculations
- **Event Delegation**: Efficient event handling

## 🔧 **Customization Options**

### **Step Configuration**
```jsx
// Add new steps
const totalSteps = 4; // Modify this value

// Custom step validation
const isStepValid = (step) => {
  switch (step) {
    case 1: return formData.eventType !== null;
    case 2: return formData.package !== null;
    // Add new cases
  }
};
```

### **Animation Customization**
```jsx
// Adjust transition timing
const stepTransition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
};

// Modify progress bar animation
const progressVariants = {
  animate: (progress) => ({
    width: `${progress}%`,
    transition: { duration: 0.5, ease: "easeOut" }
  })
};
```

### **Form Field Customization**
```jsx
// Add new form fields
<FloatingLabelInput
  id="newField"
  label="New Field"
  type="text"
  value={formData.newField}
  onChange={(value) => handleFieldChange('newField', value)}
  placeholder="Enter value"
  icon={NewIcon}
  required
/>
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Animations Not Smooth**
   - Check for CSS conflicts
   - Ensure hardware acceleration is enabled
   - Verify Framer Motion is properly installed

2. **Form Validation Not Working**
   - Check validation functions are properly defined
   - Verify state updates are triggering re-renders
   - Ensure form fields have proper IDs

3. **Mobile Summary Not Showing**
   - Check viewport meta tag is present
   - Verify touch events are properly handled
   - Ensure modal backdrop is clickable

4. **Step Navigation Issues**
   - Check step validation logic
   - Verify direction state is properly managed
   - Ensure AnimatePresence is configured correctly

### **Debugging Tips**
- Use React DevTools to inspect state changes
- Check browser console for animation warnings
- Test on different devices and screen sizes
- Verify accessibility with screen readers

## 📈 **Performance Metrics**

### **Target Performance**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Animation Frame Rate**: 60fps

### **Monitoring Tools**
- Chrome DevTools Performance tab
- Lighthouse for Core Web Vitals
- React DevTools Profiler
- Framer Motion DevTools

## 🚀 **Future Enhancements**

### **Planned Features**
1. **Step Persistence**: Save progress in localStorage
2. **Step Validation**: More sophisticated validation rules
3. **Custom Fields**: User-defined form fields
4. **Progress Saving**: Auto-save form data
5. **Step Skipping**: Allow users to skip optional steps

### **Performance Improvements**
1. **Virtual Scrolling**: For large service lists
2. **Lazy Loading**: Load step components on demand
3. **Service Worker**: Cache form data and assets
4. **Bundle Analysis**: Optimize bundle size

## 📚 **Additional Resources**

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Form Validation Best Practices](https://web.dev/sign-up-form-best-practices/)

---

**Note**: This wizard system is designed for modern browsers with ES6+ support. For older browsers, consider providing fallback static versions or progressive enhancement strategies.
