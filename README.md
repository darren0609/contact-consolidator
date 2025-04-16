# Contact Consolidator

A modern contact management system built with React and SQLite that helps you maintain a clean contact database by detecting and managing duplicate entries. The application provides an intuitive interface for viewing, merging, and managing contacts.

---

## ✅ Features & Progress

### 🔹 Contact List
- Contact cards with responsive layout
- Sidebar navigation (A-Z speed dial)
- Icons for phone, email, and address
- Unknown contact highlighting

### 🔹 Duplicate Management
- Duplicate detection algorithm
- Side-by-side comparison
- Merge with field-level selection ✅
- Modal merge interface ✅
- Merge history tracking ✅
- Dismiss matches

### 🔹 Data Import / Export
- CSV import with flexible field mapping ✅
- Import deduplication logic
- [ ] CSV export functionality

### 🔹 Contact Details & Management
- Full contact modal with all fields ✅
- Address formatting & fallback display ✅
- [ ] Edit contact modal
- [ ] Add notes or tags
- [ ] Custom fields support

### 🔹 Merge History
- Database schema ✅
- API implementation ✅
- [ ] UI component for merge log display
- [ ] Visual merge trail view

---

## 🧩 Planned Features (Suggested Next)

### 🧪 Data Quality & Rules
- [ ] Highlight incomplete or inconsistent contacts
- [ ] Suggestions for fill-ins (e.g. known domains)

### 📤 Data Export
- [ ] CSV export with field selection
- [ ] Export history
- [ ] JSON format support

### 🔍 Search & Filters
- [ ] Advanced filter: by name, company, missing data
- [ ] Sort options: recently modified, alphabetically
- [ ] Save search presets

### ⚙️ User Preferences
- [ ] Theme toggle (light/dark)
- [ ] Default view setting (list vs grouped)
- [ ] Group by source file

---

## 🛠 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- SQLite 3+

### Install & Run

```bash
git clone https://github.com/yourusername/contact-consolidator.git
cd contact-consolidator
npm install
npm run init-db
npm run dev:all
```

App will run at: `http://localhost:5173`

---

## 🧱 Project Structure

```
contact-consolidator/
├── src/
│   ├── client/       # React UI
│   ├── server/       # Express + SQLite API
│   └── shared/       # Utilities/types
├── database/         # SQLite data
├── public/           # Static assets
└── README.md
```

---

## 🔧 Available Scripts

- `npm run dev:all` — start frontend + backend
- `npm run dev:frontend` — start frontend only
- `npm run dev:backend` — start backend only
- `npm run init-db` — initialize/reset DB
- `npm run build` — production build

---

## 🧪 Deployment

### Vercel

```bash
npm install -g vercel
vercel init
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Open a PR

---

## 📄 License
MIT — see [LICENSE](./LICENSE)