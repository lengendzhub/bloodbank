# Blood Bank Management System

A comprehensive blood bank management system built with React, TypeScript, and Supabase to connect donors with those in need.

## Features

- **Donor Management**: Add, update, and manage blood donor information with complete CRUD operations
- **Smart Filtering**: Filter by blood group and sort by location to find the perfect donor match quickly
- **User Authentication**: Secure authentication system powered by Supabase
- **Real-time Database**: All data stored and managed through Supabase PostgreSQL database
- **Responsive Design**: Modern UI built with shadcn/ui and Tailwind CSS

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account and project

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

If you plan to run the local API server that talks to MongoDB (optional), create a `.env` file and add:
```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=bloodbank
PORT=4000
```

4. Start the development server:
```sh
npm run dev
```

### Running the optional local API server (for MongoDB CRUD)

Start the MongoDB-backed API server (runs on port 4000 by default):

```powershell
npm run server
```

Make sure `MONGODB_URI` is set in your `.env` before starting the server.

## Database Setup

The application uses Supabase as the database. The database schema includes:

- **donors** table with fields for personal information, blood group, contact details, location, and availability status
- Row Level Security (RLS) policies for data protection
- Authentication integration

Run the migration file in `supabase/migrations/` to set up the database schema.

## Usage

1. **Sign Up/Login**: Create an account or sign in to access the dashboard
2. **Add Donors**: Use the "Add New Donor" button to register blood donors
3. **Manage Donors**: View, edit, or delete donor records
4. **Filter & Search**: Use the filter bar to find donors by blood group or sort by location

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Security & Secrets

Important: never commit credentials or secret connection strings to the repository. This project expects you to store sensitive configuration in environment variables (see `.env.example`). If you accidentally committed a secret, take these steps immediately:

1. Rotate the leaked credential (change the password/keys) — this is the fastest mitigation.
2. Remove the secret from your git history. Two common tools:
	- BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
	- git filter-repo (recommended): https://github.com/newren/git-filter-repo

	Example (BFG):

	```text
	bfg --delete-files .env
	git push --force
	```

3. Audit your repository and CI/CD logs for any exposed values and rotate them if needed.

If you're unsure how to proceed, rotate credentials first and then ask for help performing a history rewrite. Always keep a backup of your repository before running history-rewrite operations.
