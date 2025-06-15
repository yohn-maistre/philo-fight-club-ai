
# 🏛️ Philosophy Fight Club 🥊

> **"The first rule of Philosophy Fight Club is: you MUST talk about Philosophy Fight Club"**

A revolutionary voice-interactive debate platform where you challenge history's greatest philosophical minds through real-time AI conversations. Engage in Socratic dialogues, defend your positions, and explore the deepest questions of human existence.

## ✨ Features

### 🎭 Interactive Voice Debates
- **Real-time voice interaction** with AI-powered philosophers
- **Socratic moderation** ensuring structured, meaningful dialogue
- **Live transcription** of all conversations
- **Voice interruption system** to naturally join debates

### 🧠 Diverse Philosophical Battles
Choose from carefully curated debates across multiple categories:

- **📚 Classic Philosophy** - Timeless debates between legendary thinkers
  - Morality: Socrates vs Nietzsche
  - Free Will: Descartes vs Spinoza  
  - Knowledge: Kant vs Hume

- **⚡ Modern Issues** - Contemporary philosophical challenges
  - AI Consciousness: Turing vs Searle
  - Economic Systems: Adam Smith vs Karl Marx
  - Digital Privacy: Bentham vs Mill

- **🔥 Provocative Topics** - Edge-cutting modern dilemmas
  - Simulation Theory: Bostrom vs Chalmers
  - Gender Identity: Butler vs Paglia
  - Climate vs Progress: Thunberg vs Lomborg

- **💀 Wild Cards** - Unexpected philosophical battlegrounds
  - Cancel Culture vs Free Speech
  - Digital Connection vs Human Isolation
  - Death and Meaning of Life

### 🎨 Modern UI/UX
- **Glassmorphism design** with dark academia aesthetics
- **Responsive mobile-first** interface
- **Smooth animations** powered by Framer Motion
- **Real-time visual feedback** for voice interactions
- **Dynamic category filtering** with expandable tabs

### 🎤 Advanced Voice Features
- **Mute/unmute controls** during debates
- **Volume level monitoring** with visual indicators
- **Speaking state detection** for natural conversation flow
- **Voice activity visualization** in real-time

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A [Vapi.ai](https://vapi.ai) account and API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-git-url>
   cd philosophy-fight-club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Vapi Integration**
   - Sign up at [Vapi.ai](https://vapi.ai)
   - Get your Public API Key
   - Open `src/hooks/useVapi.ts`
   - Replace `"YOUR_VAPI_PUBLIC_KEY"` with your actual key

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Tech Stack

- **⚛️ React 18** - Modern React with hooks
- **🔧 TypeScript** - Type-safe development
- **⚡ Vite** - Lightning-fast build tool
- **🎨 Tailwind CSS** - Utility-first styling
- **🧩 shadcn/ui** - Beautiful, accessible components
- **🎭 Framer Motion** - Smooth animations
- **🎤 Vapi.ai** - Voice AI integration
- **📡 TanStack Query** - Server state management

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── ArenaBackground.tsx # Debate arena visual effects
│   ├── BattleCard.tsx      # Philosophy battle selection cards
│   ├── DebateArena.tsx     # Main debate interface
│   ├── HeroSection.tsx     # Landing page hero
│   ├── LoadingScreen.tsx   # Beautiful loading animation
│   └── ...
├── hooks/
│   └── useVapi.ts          # Voice AI integration hook
├── pages/
│   └── Index.tsx           # Main application page
└── lib/
    └── utils.ts            # Utility functions
```

## 🎯 How It Works

1. **Choose Your Battle** - Select from curated philosophical debates
2. **Enter the Arena** - Connect to the voice AI system  
3. **Challenge Philosophers** - Speak your questions and challenges
4. **Engage in Dialogue** - Experience real-time philosophical discourse
5. **Socratic Moderation** - AI Socrates ensures productive dialogue

## 🔧 Configuration

### Voice AI Setup
The app uses Vapi.ai for voice interactions. To set up:

1. Create assistants in your Vapi dashboard for each philosopher
2. Configure the assistants with appropriate personalities and knowledge
3. Update the battle configurations with your assistant IDs

### Customization
- **Add new battles**: Modify the `availableBattles` array in `src/pages/Index.tsx`
- **Customize UI themes**: Update Tailwind classes throughout components
- **Extend voice features**: Enhance the `useVapi` hook with additional functionality

## 🎨 Design Philosophy

Philosophy Fight Club embraces **dark academia** aesthetics with:
- Rich slate and charcoal backgrounds
- Golden accent colors symbolizing enlightenment
- Classical typography (serif fonts)
- Glassmorphism effects for modern elegance
- Smooth micro-interactions for engagement

## 🚀 Deployment

### Using Lovable (Recommended)
1. Click the "Publish" button in your Lovable editor
2. Your app will be deployed instantly with a custom URL

### Manual Deployment
```bash
npm run build
# Deploy the `dist` folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 Philosophy

This project believes that philosophical discourse should be:
- **Accessible** to everyone, not just academics
- **Interactive** and engaging, not passive reading
- **Challenging** to our assumptions and beliefs
- **Respectful** of different viewpoints and traditions

## 🎓 Educational Value

Perfect for:
- **Philosophy students** exploring different perspectives
- **Debate enthusiasts** practicing argumentation skills  
- **Curious minds** seeking intellectual stimulation
- **Educators** teaching critical thinking

## ⚖️ License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the great philosophical traditions
- Built with modern web technologies
- Powered by AI voice interaction
- Designed for the digital age of learning

---

**Ready to challenge the greatest minds in history?** 🤔

[Enter the Arena](https://your-app-url.com) and begin your philosophical journey!
