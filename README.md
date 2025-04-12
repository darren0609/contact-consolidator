# Contact Consolidator

A modern web application for managing and viewing contact information, with support for CSV import, filtering, and sorting capabilities.

## Features

- 📁 CSV Import: Easily import contact data from CSV files
- 🔍 Advanced Search: Filter contacts across all fields or specific attributes
- ↕️ Smart Sorting: Sort contacts by name, company, or other fields
- 👤 Detailed Views: Comprehensive contact cards with all information
- 🎨 Modern UI: Clean interface with dark mode and responsive design
- 📱 Mobile Friendly: Adaptable layout for various screen sizes
- 🔄 Real-time Updates: Instant filtering and sorting results
- ⚡ Performance: Efficient handling of large contact lists

## Technical Stack

- Frontend: Vanilla JavaScript, HTML5, CSS3
- Styling: Tailwind CSS
- Icons: Lucide Icons
- Phone Number Formatting: libphonenumber-js

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/contact-consolidator.git
cd contact-consolidator
```

2. Install dependencies:
```bash
npm install
```

3. Set up a local development server:
```bash
npm install -g http-server
http-server
```

## Cloud Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy to Netlify:
```bash
netlify deploy
```

## Usage

1. Launch the application in your browser
2. Use the "Import CSV" button to load your contact data
3. Use the search bar to filter contacts
4. Click on any contact card to view detailed information
5. Use the sort controls to organize your contacts
6. Use the field filter to search specific contact attributes

## CSV Format

The application expects CSV files with headers. Example format:

```csv
First Name,Last Name,Email,Phone,Company,Job Title
John,Doe,john@example.com,+1234567890,Acme Inc,Manager
```

Supported fields include:
- Basic Info (Name, Email, Phone)
- Company Details
- Addresses (Home/Work)
- Social Media
- Custom Fields

## Features in Development

- Contact editing capabilities
- Export functionality
- Duplicate detection
- Contact groups/categories
- Data backup and sync
- Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Lucide Icons](https://lucide.dev) for the icon set
- [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js) for phone number formatting