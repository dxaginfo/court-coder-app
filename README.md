# Court Coder - Basketball Playbook Animator

A web application that allows basketball coaches at any level (from youth leagues to college) to easily diagram and animate basketball plays using a simple interface, with an AI-powered enhancement layer.

## Key Features

- **Intuitive Court Diagram Interface**: Drag and drop players onto a virtual basketball court
- **Animation Design**: Draw paths for player and ball movement with a simple interface
- **AI Enhancement**: Provide text instructions to fine-tune animations automatically
- **Export & Share**: Save animations as videos or shareable links for team distribution
- **Play Library**: Store and organize playbooks for different situations

## Technology Stack

- **Frontend**: React.js with TypeScript
- **UI Framework**: Tailwind CSS and shadcn/ui
- **Animation**: GSAP (GreenSock Animation Platform)
- **State Management**: Zustand
- **AI Integration**: Client-side LLM for processing text instructions
- **Build System**: Vite

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/court-coder-app.git
   cd court-coder-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

## Development Roadmap

- [x] Project setup and configuration
- [ ] Basic court interface with draggable player icons
- [ ] Path drawing implementation
- [ ] Animation sequencing engine
- [ ] AI prompt processing integration
- [ ] Export and sharing functionality
- [ ] Play library and storage
- [ ] User authentication
- [ ] Mobile responsive design

## Project Structure

```
src/
├── components/     # UI components
│   ├── court/      # Court-related components
│   ├── players/    # Player-related components
│   ├── controls/   # Animation controls
│   └── ui/         # Shared UI components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and functions
├── stores/         # State management
├── types/          # TypeScript type definitions
└── App.tsx         # Main application component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by basketball coaching tools and diagram systems
- Built to make strategic visualization accessible to coaches at all levels