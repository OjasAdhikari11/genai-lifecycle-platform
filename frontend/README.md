# GenAI Chat Frontend

A modern React + Vite chat interface for the GenAI Lifecycle Platform.

**Author:** Ojas Adhikari

## Overview

This frontend provides a real-time chat interface that communicates with the FastAPI backend to deliver AI-powered responses using OpenAI's language models.

## Features

- 💬 Real-time chat interface
- 🟢 Backend connection status indicator
- ⚡ Hot module reloading (HMR) during development
- 📱 Responsive design (desktop and mobile)
- 🎨 Modern UI with smooth animations
- 🔌 Clean API integration layer

## Tech Stack

- **React 19** - UI library
- **Vite 8** - Build tool and dev server
- **JavaScript ES6+** - Language
- **CSS3** - Styling with animations

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running on `http://localhost:8000`

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Code Quality

Check for linting errors:

```bash
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx           # Main chat component
│   ├── ChatMessage.jsx   # Message display component
│   ├── api.js            # API integration layer
│   ├── App.css           # Chat UI styles
│   ├── index.css         # Global styles
│   └── main.jsx          # React entry point
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── index.html            # HTML template
```

## API Integration

The frontend communicates with the backend via:

- **GET `/health`** - Check backend status
- **POST `/chat`** - Send message and get AI response

See `src/api.js` for implementation details.

## Environment Configuration

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code for errors and style issues |

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Push and create a pull request

## License

MIT

---

For more information about the full project, see the [main README](../README.md).
