# StatusBoard Deployment Guide

This guide covers deploying StatusBoard to production environments.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/statusboard-base-miniapp)

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

Ensure all required environment variables are configured:

```bash
# Required for AI features
OPENAI_API_KEY=sk-...
# OR
OPENROUTER_API_KEY=sk-or-...

# Required for database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Required for Farcaster integration
NEXT_PUBLIC_NEYNAR_API_KEY=your-neynar-key

# Required for Base integration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-key

# Production URLs
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Database Setup (Supabase)

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Create database tables**
   ```sql
   -- Users table
   CREATE TABLE users (
     user_id TEXT PRIMARY KEY,
     farcaster_id TEXT UNIQUE,
     username TEXT NOT NULL,
     bio TEXT,
     availability_status TEXT DEFAULT 'free',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Services table
   CREATE TABLE services (
     service_id TEXT PRIMARY KEY,
     user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     category TEXT NOT NULL,
     price DECIMAL(10,2),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Availability updates table
   CREATE TABLE availability_updates (
     update_id TEXT PRIMARY KEY,
     user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
     status_type TEXT NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     duration INTEGER
   );

   -- Analytics events table
   CREATE TABLE analytics_events (
     id SERIAL PRIMARY KEY,
     event TEXT NOT NULL,
     properties JSONB,
     user_id TEXT,
     session_id TEXT,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Set up Row Level Security (RLS)**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE services ENABLE ROW LEVEL SECURITY;
   ALTER TABLE availability_updates ENABLE ROW LEVEL SECURITY;

   -- Create policies (adjust based on your auth strategy)
   CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = user_id);
   
   CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
   CREATE POLICY "Users can manage own services" ON services FOR ALL USING (auth.uid()::text = user_id);
   ```

### 3. API Keys Setup

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add billing information
4. Set usage limits

#### Neynar API Key
1. Go to [neynar.com](https://neynar.com)
2. Sign up for an account
3. Create a new app
4. Get your API key

#### OnchainKit API Key
1. Go to [onchainkit.xyz](https://onchainkit.xyz)
2. Sign up and create a project
3. Get your API key

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Configure Environment Variables in Vercel**
   - Go to your project settings
   - Add all environment variables from `.env.example`
   - Redeploy if needed

### Option 2: Netlify

1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"

   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy**
   - Connect your repository to Netlify
   - Configure environment variables
   - Deploy

### Option 3: Railway

1. **Create Railway Project**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Configure Environment Variables**
   ```bash
   railway variables set OPENAI_API_KEY=your-key
   railway variables set NEXT_PUBLIC_SUPABASE_URL=your-url
   # ... add all other variables
   ```

### Option 4: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t statusboard .
   docker run -p 3000:3000 statusboard
   ```

## 🔧 Production Optimizations

### 1. Performance

1. **Enable Next.js optimizations in `next.config.js`**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       optimizeCss: true,
     },
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif'],
     },
     compress: true,
     poweredByHeader: false,
   }

   module.exports = nextConfig
   ```

2. **Add caching headers**
   ```javascript
   // In next.config.js
   async headers() {
     return [
       {
         source: '/api/:path*',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=300, stale-while-revalidate=60',
           },
         ],
       },
     ]
   }
   ```

### 2. Security

1. **Add security headers**
   ```javascript
   // In next.config.js
   async headers() {
     return [
       {
         source: '/(.*)',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
           {
             key: 'Referrer-Policy',
             value: 'origin-when-cross-origin',
           },
         ],
       },
     ]
   }
   ```

2. **Environment variable validation**
   ```javascript
   // Add to your API routes
   const requiredEnvVars = [
     'OPENAI_API_KEY',
     'NEXT_PUBLIC_SUPABASE_URL',
     'NEXT_PUBLIC_NEYNAR_API_KEY',
   ];

   requiredEnvVars.forEach((envVar) => {
     if (!process.env[envVar]) {
       throw new Error(`Missing required environment variable: ${envVar}`);
     }
   });
   ```

### 3. Monitoring

1. **Add error tracking (Sentry)**
   ```bash
   npm install @sentry/nextjs
   ```

   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

2. **Add analytics (Vercel Analytics)**
   ```bash
   npm install @vercel/analytics
   ```

   ```javascript
   // In _app.tsx
   import { Analytics } from '@vercel/analytics/react';

   export default function App({ Component, pageProps }) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     );
   }
   ```

## 🧪 Testing in Production

### 1. Health Check Endpoint

Create `/api/health`:
```javascript
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

### 2. Load Testing

```bash
# Install artillery
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'https://your-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health check"
    requests:
      - get:
          url: "/api/health"
EOF

# Run load test
artillery run load-test.yml
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Check linting: `npm run lint`
   - Clear Next.js cache: `rm -rf .next`

2. **API Errors**
   - Verify environment variables are set
   - Check API key permissions
   - Review network connectivity

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check database table structure
   - Review RLS policies

### Debugging

1. **Enable debug logging**
   ```javascript
   // Add to your API routes
   if (process.env.NODE_ENV === 'development') {
     console.log('Debug info:', { request: req.body, timestamp: new Date() });
   }
   ```

2. **Monitor API responses**
   ```bash
   # Check API health
   curl https://your-domain.com/api/health

   # Test specific endpoints
   curl -X GET https://your-domain.com/api/services
   ```

## 📊 Post-Deployment

### 1. Monitor Performance
- Set up uptime monitoring
- Monitor API response times
- Track error rates

### 2. User Feedback
- Set up user feedback collection
- Monitor analytics for usage patterns
- Track feature adoption

### 3. Continuous Deployment
- Set up automated deployments
- Configure staging environment
- Implement feature flags

---

**Need help?** Create an issue in the repository or check the troubleshooting section above.
