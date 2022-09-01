This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Screenshots

### Session call (leader view)

![Session call view](public/screenshots/call.png)

### Rooms directory

![Session call view](public/screenshots/directory.png)

### Magic link sign-in

![Session call view](public/screenshots/signin.png)

### Scheduling

TODO:

### Calendar

TODO:

### Ical subscription URL

TODO:::

## Getting Started

First, you will need to create accounts on hubspot and supabase, and add the relevant API keys / URLs to your project. To do this, copy the `.env.template` file to `.env.local`, and fill in the following fields:

- `NEXT_PUBLIC_SUPABASE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_API_BASEURL`
- `HUBSPOT_PRIVATE_APP_TOKEN`

On Supabase, you should set up the database to have the correct tables by running the SQL contained in `tables.sql`.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Technical stack

- [React](https://reactjs.org/docs/getting-started.html/) - UI rendering
- [Tailwind](https://tailwindcss.com/docs) - Styling
- [Next](https://nextjs.org/docs) - App server
- [Supabase](https://supabase.io/docs) - Database layer
