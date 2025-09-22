# PixelGlow Dashboard 🎨

A modern, AI-powered photo transformation platform built with Next.js 15, featuring 40+ professional AI presets for instant photo enhancement and style transformation.

## 🌟 Overview

PixelGlow Dashboard is a comprehensive web application that allows users to transform their photos using advanced AI technology. The platform offers a wide variety of artistic styles, professional presets, and creative filters that can turn ordinary photos into stunning visual masterpieces in minutes.

## ✨ Key Features

### 🎨 **AI Photo Transformation**
- **40+ Professional Presets** - From professional headshots to anime styles
- **Instant Processing** - 2-5 minute generation time
- **4K High Resolution** output ready for print or digital use
- **Commercial Rights** included for all generated images

### 🎯 **Core Functionality**
- **Real-time Search** - Find specific presets instantly
- **Style Categories** - Professional, Creative, Artistic, and more
- **Preview System** - Before/after image comparisons
- **Credit System** - Transparent pricing per preset
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🔐 **User Experience**
- **Google Authentication** integration ready
- **Dark/Light Mode** support
- **Animated UI** with smooth transitions
- **Modern Design** following current design trends
- **Accessibility** compliant components

## 🏗️ Project Structure

```
dashbaord2/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── search/            # Search functionality
│   │   └── studio/            # Studio workspace
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── HeroSection.tsx   # Main landing hero
│   │   ├── Footer.tsx        # Dynamic footer with presets
│   │   ├── PresetSearch.tsx  # Search functionality
│   │   └── [sections]/       # Various page sections
│   └── lib/                  # Utilities and configurations
├── public/
│   ├── prompts.json          # AI preset configurations
│   └── assets/               # Static images and icons
└── package.json              # Dependencies and scripts
```

## 🎨 Available AI Presets

### **Professional Collection**
- **Fashion Shoot Portrait** - Editorial fashion photography style
- **Professional Headshots** - Corporate and business portraits
- **Editorial Portraits** - Magazine-quality professional shots
- **London Fashion Week Runway** - High-fashion runway looks

### **Creative & Artistic**
- **Anime Portraits** - Japanese animation style transformation
- **3D Avatar Creation** - Three-dimensional character rendering
- **Watercolor Art** - Traditional painting aesthetics
- **Pop Art Style** - Bold, vibrant pop art designs
- **Street Art** - Urban graffiti and street art styles

### **Specialized Effects**
- **Cyberpunk Aesthetics** - Futuristic neon-lit scenes
- **Film Noir** - Classic black and white cinematic style
- **Vintage Hollywood** - Golden age cinema glamour
- **Embroidery Patch** - Realistic textile and fabric effects

### **Lifestyle & Scenarios**
- **Luxury Car Portraits** - High-end automotive lifestyle shots
- **Urban Street Photography** - Modern city life aesthetics
- **Action Scenes** - Dynamic movement and adventure shots
- **Surreal Environments** - Fantasy and dreamlike settings

## 🛠️ Technology Stack

### **Frontend Framework**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4.0** - Utility-first styling
- **Framer Motion** - Advanced animations and transitions

### **UI Components**
- **shadcn/ui** - Modern, accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icon library
- **React Icons** - Comprehensive icon collection

### **Design System**
- **CSS Variables** - Dynamic theming support
- **Dark/Light Mode** - Automatic theme switching
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components

### **State Management**
- **React Hooks** - Built-in state management
- **Context API** - Global state sharing
- **Local Storage** - Client-side persistence

## 📱 Page Sections

### **Landing Page Components**

#### 🚀 **HeroSection**
- Animated background with rotating AI-generated portraits
- Email signup form with validation
- Google authentication integration
- Rotating neon border effects
- Feature highlights with compelling copy

#### 🔑 **KeyFeaturesSection**
- Before/after image showcases
- Text-to-image capabilities
- Style variety demonstrations
- Professional quality examples

#### 🎯 **ApplicationsSection**
- Use case demonstrations
- Industry applications
- Creative possibilities
- Real-world examples

#### ⚙️ **ProcessSection**
- 3-step transformation process
- Upload → Style → Download workflow
- Feature benefits and guarantees
- Call-to-action buttons

#### ❓ **FAQSection**
- Expandable FAQ items
- Common user questions
- Technical specifications
- Pricing and licensing information

#### 📞 **CTASection**
- Final conversion opportunity
- Demo video integration
- Trust signals and social proof
- Clear next steps

#### 🔗 **Footer**
- Dynamic preset links from prompts.json
- Organized by categories
- Direct studio navigation
- Company information and legal links

### **Search Functionality**

#### 🔍 **PresetSearch Component**
- Real-time filtering across 40+ presets
- Visual preview cards with thumbnails
- Search by title, description, or tags
- Instant navigation to studio workspace
- Loading states and empty results handling

#### 📄 **Dedicated Search Page**
- Full-screen search experience
- Category browsing options
- Popular preset recommendations
- Advanced filtering capabilities

## 🎨 Design Features

### **Visual Elements**
- **Gradient Backgrounds** - Modern color schemes
- **Glassmorphism** - Frosted glass UI effects
- **Neumorphism** - Soft, realistic shadows
- **Animated Borders** - Rotating neon glow effects
- **Smooth Transitions** - 60fps animations throughout

### **Typography**
- **Font Hierarchy** - Clear information structure
- **Responsive Text** - Scales across all devices
- **High Contrast** - Excellent readability
- **Brand Consistency** - Unified visual language

### **Interactive Elements**
- **Hover Effects** - Engaging micro-interactions
- **Loading States** - Skeleton screens and spinners
- **Form Validation** - Real-time input feedback
- **Button Animations** - Satisfying click responses

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd dashbaord2
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**
```
http://localhost:3000
```

### **Build for Production**
```bash
npm run build
npm start
```

## 📁 Key Files

### **Configuration**
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Styling configuration
- `tsconfig.json` - TypeScript settings
- `next.config.js` - Next.js configuration

### **Data**
- `public/prompts.json` - AI preset definitions (40+ presets)
- Each preset includes:
  - Title and description
  - Before/after image URLs
  - Credit cost and slug
  - Input field configurations
  - Variable parameters

### **Core Components**
- `src/app/page.tsx` - Main landing page
- `src/components/HeroSection.tsx` - Hero section with animations
- `src/components/Footer.tsx` - Dynamic footer with preset links
- `src/components/PresetSearch.tsx` - Search functionality
- `src/components/ui/` - Reusable UI components

## 🎯 Features in Detail

### **AI Preset System**
Each preset in `prompts.json` contains:
- **Metadata** - ID, title, description, credits
- **Visual Assets** - Before/after image URLs
- **Configuration** - Variables and input fields
- **Branding** - Badge text and colors
- **Navigation** - Unique slug for routing

### **Search Capabilities**
- **Text Matching** - Searches titles, descriptions, badges
- **Visual Results** - Thumbnail previews with metadata
- **Quick Navigation** - Direct links to studio pages
- **Performance** - Client-side filtering for speed
- **UX Optimization** - Debounced input and smart clearing

### **Responsive Design**
- **Mobile First** - Optimized for small screens
- **Tablet Support** - Medium screen optimizations
- **Desktop Enhanced** - Large screen features
- **Touch Friendly** - Mobile gesture support

### **Performance Optimizations**
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting
- **Lazy Loading** - Component and image lazy loading
- **Caching** - Aggressive caching strategies

## 🔮 Future Enhancements

### **Planned Features**
- **User Accounts** - Profile management and history
- **Payment Integration** - Stripe/PayPal for credits
- **Advanced Filters** - Category, price, and style filtering
- **Preset Collections** - Curated style bundles
- **Social Sharing** - Results sharing capabilities
- **Mobile App** - Native iOS/Android applications

### **Technical Improvements**
- **API Integration** - Backend service connection
- **Database** - User data and preset management
- **Analytics** - Usage tracking and optimization
- **A/B Testing** - Conversion optimization
- **Internationalization** - Multi-language support

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or collaboration inquiries, please contact the development team.

## 📧 Support

For technical support or feature requests, please contact:
- **Email**: support@pixelglow.com
- **Website**: https://pixelglow.com

---

**PixelGlow Dashboard** - Transform your photos with AI in minutes, not hours. ✨
