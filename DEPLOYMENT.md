# Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- OpenAI API key (optional, app works with mock responses)

### Step-by-Step Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Voice Assistant"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-voice-assistant.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_OPENAI_API_KEY` with your OpenAI API key value
   - Click "Save"

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Important Notes

- **HTTPS Required**: Voice features only work over HTTPS (Vercel provides this automatically)
- **Browser Compatibility**: Inform users to use Chrome, Edge, or Safari for best experience
- **API Key**: Without OpenAI API key, the app will use mock responses
- **Domain**: You can add a custom domain in Vercel settings

### Build Configuration

The project is pre-configured with:
- `vercel.json` for deployment settings
- Proper routing for SPA
- Security headers
- Optimized build output

### Troubleshooting

**Build Fails:**
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility

**Voice Features Don't Work:**
- Verify the site is served over HTTPS
- Check browser compatibility
- Ensure microphone permissions are granted

**API Errors:**
- Verify OpenAI API key is correctly set in environment variables
- Check API key has sufficient credits
- Monitor API usage in OpenAI dashboard

### Performance Optimization

The app is optimized for production with:
- Code splitting
- Asset optimization
- Gzip compression
- CDN delivery via Vercel

### Monitoring

Monitor your deployment:
- Vercel Analytics (built-in)
- OpenAI API usage dashboard
- Browser console for client-side errors