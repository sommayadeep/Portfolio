# Portfolio Website

A modern, interactive portfolio with hand gesture control and 3D animations.

## ✨ Features

### 🎮 Hand Gesture Control
- **Both Hands:** Control the 3D sphere
  - Move hands together → Shrink sphere
  - Move hands apart → Expand sphere
  - Make fists → Glow effect
  - Move hands → 360° rotation
  
- **Single Hand:** Navigation
  - 0 fingers (fist) → Home
  - Index finger → Projects
  - Index + Middle → Skills
  - Index + Middle + Ring → Contact

### 📱 Sections
- **Hero** - Introduction with animated text
- **Projects** - 5 featured projects with live demos
- **Skills** - Technical skills & ML specialization
- **Contact** - Working contact form (sends to Gmail)

### 🎨 Tech Stack
- React + Vite
- Tailwind CSS
- Three.js / React-Three-Fiber
- MediaPipe Hand Tracking
- Framer Motion
- Formspree

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sommayadeep/PORTFOLIO.git
cd PORTFOLIO

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify
```bash
npm run build
# Upload dist folder
```

## 🔒 Privacy

This portfolio uses your camera for hand gesture control. 
- Camera access is optional (toggle available)
- No video is stored or transmitted
- Permissions are requested only when gesture mode is enabled

## 📄 License

MIT License - feel free to use for your own portfolio!

## 👤 Contact

- **LinkedIn:** https://www.linkedin.com/in/sommayadeep-saha-127baa335
- **Email:** sommayadeepsaha@gmail.com

---

Built with ❤️ using React & Three.js

