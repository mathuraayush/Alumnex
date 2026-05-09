# Alumnex Frontend

This is a Vite + React frontend scaffold for the Alumnex backend.

Quick start

1. cd frontend
2. npm install
3. copy .env.example to .env and set `VITE_API_BASE_URL` to your backend URL (e.g. http://localhost:3000)
4. npm run dev

Build

- `npm run build`
- `npm run preview` to preview production build

Notes

- Uses Tailwind CSS for styling.
- Uses Redux Toolkit for state management.
- API layer is in `src/services/api.js` and reads base URL from `VITE_API_BASE_URL`.
- Routes are lazy-loaded and ready for admin routes at `/admin/*`.
