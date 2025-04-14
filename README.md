# Contact Consolidator

A modern contact management system built with React and SQLite that helps you maintain a clean contact database by detecting and managing duplicate entries. The application provides an intuitive interface for viewing, merging, and managing contacts with features like duplicate detection, contact merging, and comprehensive contact history.

## Features & Progress

### ✅ Completed Features

#### Contact List View
- Two-column grid layout
- Contact cards with icons
- Basic contact details display
- Source indicators

#### Navigation
- A-Z speed dial
- Smooth scroll to letter groups
- Sidebar navigation
- Search functionality

#### Duplicate Management
- Duplicate detection algorithm
- Side-by-side comparison
- Merge capability
- Dismiss duplicates option
- Split view toggle

#### Contact Details
- Modal view with full details
- Icons for different field types
- Phone number formatting
- Source indication
- Grid layout for fields

#### Data Management
- CSV import functionality
- Loading states
- Error handling
- Basic data validation

### 🚧 In Progress

#### Merge History
- [x] Database schema created
- [x] API endpoints defined
- [x] Basic UI implemented
- [ ] Testing and refinement
- [ ] Historical data visualization

### 📋 Planned Features

#### Contact Details Enhancement
- [ ] Edit capability
- [ ] Field validation
- [ ] Custom fields support
- [ ] Contact groups/tags
- [ ] Notes/comments system

#### Data Export
- [ ] CSV export
- [ ] Export format selection
- [ ] Export history
- [ ] Selective field export

#### Advanced Search
- [ ] Filter by fields
- [ ] Sort options
- [ ] Save searches
- [ ] Advanced query builder

#### User Preferences
- [ ] Display settings
- [ ] Default view options
- [ ] Theme customization
- [ ] Column customization

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- SQLite 3.x

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/contact-consolidator.git
cd contact-consolidator
```

2. Install dependencies:
```bash
npm install
```

3. Create the SQLite database:
```bash
npm run init-db
```

4. Start the development server:
```bash
npm run dev:all
```

The application will be available at `http://localhost:5173`

## Development

### Project Structure
```
contact-consolidator/
├── src/
│   ├── client/         # React frontend code
│   ├── server/         # Express backend code
│   └── shared/         # Shared types and utilities
├── public/            # Static assets
└── database/          # SQLite database files
```

### Available Scripts
- `npm run dev:all` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the backend
- `npm run build` - Build the production version
- `npm run test` - Run tests
- `npm run init-db` - Initialize/reset the database

### Environment Variables
Create a `.env` file in the root directory:
```
DATABASE_PATH=./database/contacts.db
PORT=3001
NODE_ENV=development
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Configure your project:
```bash
vercel init
```

3. Update `vercel.json`:
````json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "src/server/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "src/server/index.js" },
    { "src": "/(.*)", "dest": "/dist/$1" }
  ]
}
````

4. Deploy:
````bash
vercel --prod
````

### Netlify Deployment

1. Create netlify.toml:

````bash

[build]
  command = "npm run build"
  publish = "dist"
  functions = "functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

  ````

  2. Deploy via Netlify CLI:

````bash
  npm install -g netlify-cli
netlify init
netlify deploy --prod
````

## Contributing

1. Fork the repository
2. Create your feature branch: git checkout -b feature/amazing-feature
3. Commit your changes: git commit -m 'Add amazing feature'
4. Push to the branch: git push origin feature/amazing-feature
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

# Contact Consolidator

A React-based contact management application that helps identify and manage duplicate contacts.

## Features
- Import contacts from CSV files
- Detect duplicate contacts automatically
- Group contacts alphabetically
- Search through contacts
- View detailed contact information
- Visual indicators for duplicate entries

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```
