## Set Up Supabase Storage
Create a storage bucket in the Supabase dashboard:
- Go to your Supabase project.
- Navigate to the "Storage" tab.
- Create a new bucket "images"

## Installation
Clone the repository:
```bash
git clone <repository_url>
cd <repository_name>
```

## Install dependencies:
```bash
npm install
```

## Set up environment variables: 
Create a .env.local file in the root directory and add your Supabase project URL and anon key:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```



