# useModels 🤖
Real-time API Pipeline: Fetches raw data from the live Hugging Face Hub models database via dynamic, debounced search filters without requiring system authentication keys.

A React single-page app for discovering, rating, and bookmarking machine learning models from the [Hugging Face Hub](https://huggingface.co/models) — search in real time, inspect a model's stats, rate it, and keep a personal favorites list that persists across sessions.

## Features

- **Live search** against the Hugging Face Hub API, debounced as you type
- **Model details view** — downloads, likes, trending score, pipeline tag, library, tags, and a direct link to the model's files
- **Star ratings** for any model you look at
- **Favorites list** saved to `localStorage`, with a summary card (total favorites, top-rated model) and one-click removal
- **Animated landing screen** with a typewriter-style intro
- Responsive, dark-themed UI

## Tech Stack
\-Standard Html,css
- [React 19](https://react.dev/) (Create React App / `react-scripts`)
- [Hugging Face Hub API](https://huggingface.co/docs/hub/api) for model data
- [react-icons](https://react-icons.github.io/react-icons/) for social/contact icons
- Custom hooks for `localStorage` persistence and keyboard shortcuts (no external state library)
-useRef,useEffect,useState hooks

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Installation

```bash
git clone https://github.com/DENBARIT/useModels.git
cd useModels/usemodels
npm install
```

### Environment Variables

Create a `.env` file inside `usemodels/`:

```
REACT_APP_HUGGINGFACE_API_KEY=your_huggingface_access_token
```

Generate a token from your [Hugging Face settings](https://huggingface.co/settings/tokens) (a read-only token is enough). `.env` is already gitignored.

> **Note:** Create React App inlines every `REACT_APP_*` variable into the client bundle at build time, so this token is visible to anyone who inspects the deployed site. Treat it as a low-privilege, read-only token, and consider proxying Hugging Face requests through a backend before using this in a public production deployment.

### Run locally

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
```

Outputs an optimized, static build to `usemodels/build`.

## Project Structure

```
usemodels/
├── public/
└── src/
    ├── App.js                  # Top-level layout, search state, favorites state
    ├── Components/
    │   ├── Search.js            # Debounced search input with animated placeholder
    │   ├── MovieDetails.js      # Selected model's detail card
    │   ├── LandingScreen.js     # Intro/splash screen
    │   ├── Loader.js            # Loading spinner
    │   ├── ListedBoxButton.js   # Expand/collapse toggle for the details card
    │   └── startRating.js       # Star rating input
    ├── CustomHooks/
    │   ├── useLocalStorage.js   # Persist state to localStorage
    │   └── useKey.js            # Keyboard shortcut hook (e.g. Escape to close)
    ├── utils/
    │   └── stringToColor.js     # Deterministic color generator for model avatars
    └── cssfiles/                # Stylesheets
```

## Available Scripts

Run these from inside `usemodels/`:

| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Runs the test suite in watch mode |

## Contact

- Email: [leulethiopia05@gmail.com](mailto:leulethiopia05@gmail.com)
- LinkedIn: [leul-gebremariam-930810354](https://www.linkedin.com/in/leul-gebremariam-930810354)
- GitHub: [DENBARIT](https://github.com/DENBARIT)
