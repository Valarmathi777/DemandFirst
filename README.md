# Reverse Marketplace

A modern, demand-first marketplace platform built with React and Vite. This application connects buyers and sellers in a dynamic bidding environment where customers can post their needs and sellers can compete to fulfill them.

## Features

- **Buyer Dashboard**: Manage purchase requests and view seller bids
- **Seller Dashboard**: Browse buyer requests and submit competitive bids
- **Authentication**: Secure user registration and login system
- **Profile Management**: Customize user profiles and preferences
- **Bidding System**: Post needs and receive competitive bids from sellers
- **Bid Comparison**: Compare multiple seller bids side-by-side
- **Shopping**: Browse and purchase from the marketplace
- **Chat System**: Direct messaging between buyers and sellers
- **Post Need**: Create detailed purchase requests

## Tech Stack

- **Frontend**: React + Vite with Hot Module Replacement (HMR)
- **Styling**: CSS
- **State Management**: React Context API
- **Build Tool**: Vite with ESLint

## Project Structure

```
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components for different routes
│   ├── context/          # React Context for state management
│   ├── assets/           # Static assets
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── App.css           # Global styles
├── server/               # Backend server
├── public/               # Static files
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── package.json          # Project dependencies
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup

```bash
cd server
npm install
node server.js
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser
5. Start the backend server in a separate terminal from the `server/` directory

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
