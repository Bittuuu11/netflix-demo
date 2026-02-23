# Troubleshooting Guide: Clearing API Errors

If you are seeing **500 Internal Server Errors** or other connectivity issues in the Netflix Clone app, follow these steps to resolve them.

## 1. Verify Your Network Connectivity
The 500 error "Internal error encountered" often suggests a problem with the environment's proxy or your local network connection to TMDB servers.
- Ensure you have a stable internet connection.
- If you are behind a VPN or corporate firewall, try disabling it temporarily.

## 2. Check the Browser Console
We've updated the app to provide detailed error logs.
- Press `F12` or `Ctrl+Shift+I` to open Developer Tools.
- Look for logs starting with `[TMDB API Error]`. 
- Check the **Status** and **Message**. If it's a 500 error, it confirms an intermittent infrastructure issue.

## 3. Validate your API Key
Ensure your TMDB API key is correct and active.
1. Go to [TMDB API Settings](https://www.themoviedb.org/settings/api).
2. Verify the key matches the `VITE_TMDB_API_KEY` in your `.env` file.
3. You can test your key manually in the terminal:
   ```bash
   curl "https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY_HERE"
   ```

## 4. Environment Variables
Ensure your `.env` file is in the root directory and contains:
```env
VITE_TMDB_API_KEY=your_actual_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```
*Note: After changing `.env`, you must restart the development server (`npm run dev`).*

## 5. Wait and Retry
Intermittent 500 errors from a proxy or internal gateway often resolve themselves after a few minutes. Refresh the page or try again shortly.
