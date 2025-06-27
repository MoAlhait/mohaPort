# Portfolio Customization Guide

This guide will help you personalize your portfolio with your own information, projects, and styling preferences.

## 🎯 Quick Start

1. **Install dependencies**: `npm install`
2. **Start development server**: `npm run dev`
3. **Open browser**: Navigate to `http://localhost:3000`

## 📝 Personal Information Updates

### 1. Update Metadata (`app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  title: 'Your Name - Portfolio', // Change this
  description: 'Personal portfolio showcasing my work...', // Update description
  keywords: ['portfolio', 'developer', 'your-keywords'], // Add relevant keywords
  authors: [{ name: 'Your Name' }], // Your name
  creator: 'Your Name', // Your name
  // Update social media cards
  openGraph: {
    title: 'Your Name - Portfolio',
    description: 'Your description here',
    // Add your social media image
    images: ['/og-image.jpg'],
  },
}
```

### 2. Update Personal Details (`app/page.tsx`)

#### Hero Section
```typescript
<h1 className="text-5xl md:text-7xl font-bold mb-6">
  Hi, I'm <span className="text-gradient">Your Name</span> // Change this
</h1>
<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
  Your tagline here // Update this
</p>
```

#### About Section
```typescript
<p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
  Your personal story and background // Update this
</p>
```

#### Social Links
```typescript
<a href="https://github.com/yourusername" className="...">
  <Github size={24} />
</a>
<a href="https://linkedin.com/in/yourusername" className="...">
  <Linkedin size={24} />
</a>
<a href="https://twitter.com/yourusername" className="...">
  <Twitter size={24} />
</a>
```

### 3. Update Contact Information

```typescript
<a href="mailto:your.email@example.com" className="...">
  Send Email
</a>
```

## 🛠️ Skills Section

Update the skills array in `app/page.tsx`:

```typescript
const skills = [
  {
    name: 'Your Skill Category',
    icon: Code, // Choose from: Code, Server, Database, Smartphone, Palette, Globe
    description: 'Your specific technologies and tools'
  },
  // Add more skills...
]
```

Available icons:
- `Code` - Frontend development
- `Server` - Backend development
- `Database` - Database technologies
- `Smartphone` - Mobile development
- `Palette` - Design tools
- `Globe` - DevOps/Cloud

## 📁 Projects Section

Replace the sample projects with your own:

```typescript
const projects = [
  {
    title: 'Your Project Name',
    description: 'Detailed description of your project',
    tech: ['React', 'Node.js', 'Your Tech Stack'],
    image: '/path/to/your/project-image.jpg', // Add your project images
    link: 'https://your-project-demo.com',
    github: 'https://github.com/yourusername/project'
  },
  // Add more projects...
]
```

### Project Images
- Place your project images in the `public/` directory
- Recommended size: 500x300 pixels
- Format: JPG, PNG, or WebP
- Example: `public/project1.jpg`

## 🎨 Design Customization

### 1. Color Scheme (`tailwind.config.js`)

Update the primary color palette:

```javascript
colors: {
  primary: {
    50: '#f0f9ff',   // Lightest
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Main color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',  // Darkest
  },
  // Add custom colors...
}
```

### 2. Fonts (`tailwind.config.js`)

Change the font family:

```javascript
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
  mono: ['Your Mono Font', 'monospace'],
}
```

Then update `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400;500;600;700&display=swap');
```

### 3. Custom Styles (`app/globals.css`)

Add your own custom styles:

```css
@layer components {
  .your-custom-class {
    @apply your-tailwind-classes;
  }
}
```

## 📱 Responsive Design

The portfolio is already responsive, but you can customize breakpoints in `tailwind.config.js`:

```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

## 🚀 Performance Optimization

### 1. Image Optimization
- Use Next.js Image component for better performance
- Optimize images before adding them
- Use WebP format when possible

### 2. Font Loading
- Preload critical fonts
- Use font-display: swap for better performance

### 3. Bundle Optimization
- The project already includes tree-shaking
- Consider code splitting for large components

## 🔧 Advanced Customization

### 1. Add New Sections
Create new components in the `components/` directory and import them in `app/page.tsx`.

### 2. Custom Animations
Modify Framer Motion animations in the components:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  Your content
</motion.div>
```

### 3. SEO Optimization
- Add structured data for better search results
- Optimize meta descriptions for each section
- Add Open Graph images for social sharing

## 📊 Analytics

Add Google Analytics or other tracking:

1. Create `app/analytics.ts`:
```typescript
export const GA_TRACKING_ID = 'your-ga-id'

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  })
}
```

2. Add the script to `app/layout.tsx`

## 🎯 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build: `npm run build`
2. Deploy the `out` folder

### Custom Domain
- Add your domain in your hosting provider
- Update DNS settings
- Configure SSL certificate

## 🔍 Testing

Test your portfolio on:
- Different browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices
- Different screen sizes
- Slow internet connections

## 📞 Support

If you need help:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Review [Tailwind CSS docs](https://tailwindcss.com/docs)
3. Check [Framer Motion docs](https://www.framer.com/motion/)

---

Happy customizing! 🚀 