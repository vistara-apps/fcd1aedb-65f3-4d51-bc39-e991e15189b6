# StatusBoard - Base Mini App

**Instantly signal your availability and showcase your services.**

StatusBoard is a production-ready Base Mini App that enables users to easily broadcast their availability for specific startup tasks and present their service offerings to potential clients within a social context like Farcaster.

## 🚀 Features

### Core Features

1. **Automated Availability Status**
   - Set and automatically update status for specific startup tasks
   - Signal when you're available for scoping, deployment, brainstorming, etc.
   - Real-time status broadcasting to social networks

2. **Service Showcase & Menu**
   - Create and manage a clear menu of startup assistance services
   - Categorized service offerings (Idea Scoping, Deployment, Feature Addition, Brainstorming)
   - Pricing and detailed descriptions

3. **Task-Specific Readiness Prompts**
   - Quick confirmation prompts for service engagement
   - Smooth transitions into detailed discussions
   - AI-powered interaction assistance

4. **AI-Powered Interaction Assistant**
   - Help users refine service offerings
   - Scope client needs before committing to services
   - Enhance communication quality

### Technical Features

- **Real-time Updates**: Live status and service updates
- **Analytics Tracking**: Comprehensive event tracking and insights
- **Farcaster Integration**: Automatic cast publishing for status updates
- **Responsive Design**: Optimized for mobile and desktop
- **Production Ready**: Error handling, loading states, and performance optimized

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base (via OnchainKit)
- **AI**: OpenAI/OpenRouter integration
- **Backend**: Next.js API routes
- **Database**: Supabase (configured, using mock data for demo)
- **Social**: Farcaster/Neynar API integration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd statusboard-base-miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys and configuration:
   - OpenAI/OpenRouter API key for AI features
   - Supabase credentials for database
   - Neynar API key for Farcaster integration
   - OnchainKit API key for Base integration

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `OPENROUTER_API_KEY` | Alternative to OpenAI API | Optional |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_NEYNAR_API_KEY` | Neynar API for Farcaster | Yes |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | OnchainKit API key | Yes |

### Design System

The app uses a custom design system with the following tokens:

- **Colors**: Dark theme with purple/blue gradients
- **Typography**: Inter font with responsive sizing
- **Spacing**: Consistent 8px grid system
- **Components**: Glass morphism design with backdrop blur

## 🏗 Architecture

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── users/         # User management endpoints
│   │   ├── services/      # Service CRUD endpoints
│   │   └── analytics/     # Analytics tracking
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main application
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard with stats
│   ├── UserProfile.tsx    # User profile management
│   ├── ServiceCard.tsx    # Service display component
│   ├── StatusSelector.tsx # Availability status selector
│   ├── AddServiceModal.tsx # Service creation modal
│   └── AIAssistant.tsx    # AI chat interface
├── lib/                   # Utilities and configuration
│   ├── api.ts            # API client functions
│   ├── ai.ts             # AI integration
│   ├── constants.ts      # App constants
│   └── types.ts          # TypeScript definitions
└── public/               # Static assets
```

### Data Model

#### User
```typescript
interface User {
  userId: string;
  farcasterId: string;
  username: string;
  bio: string;
  availabilityStatus: AvailabilityStatus;
  servicesOffered: Service[];
}
```

#### Service
```typescript
interface Service {
  serviceId: string;
  userId: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price?: number;
}
```

#### Availability Update
```typescript
interface AvailabilityUpdate {
  updateId: string;
  userId: string;
  statusType: AvailabilityStatus;
  timestamp: Date;
  duration?: number;
}
```

## 🔌 API Endpoints

### Users
- `GET /api/users/[userId]` - Get user profile
- `PATCH /api/users/[userId]` - Update user profile
- `POST /api/users/[userId]/availability` - Update availability status

### Services
- `GET /api/services` - List services (with filtering)
- `POST /api/services` - Create new service
- `GET /api/services/[serviceId]` - Get service details
- `PATCH /api/services/[serviceId]` - Update service
- `DELETE /api/services/[serviceId]` - Delete service

### Analytics
- `POST /api/analytics/track` - Track events
- `GET /api/analytics/track` - Get analytics data

## 🎨 Design System

### Colors
- **Background**: `hsl(220, 20%, 12%)`
- **Primary**: `hsl(200, 80%, 50%)`
- **Accent**: `hsl(160, 70%, 45%)`
- **Surface**: `hsl(220, 20%, 15%)`
- **Text Emphasized**: `hsl(0, 0%, 95%)`
- **Text Muted**: `hsl(0, 0%, 70%)`

### Components
- **Glass Cards**: Backdrop blur with subtle borders
- **Status Indicators**: Color-coded availability states
- **Action Buttons**: Primary and secondary variants
- **Modals**: Slide-up animations with glass morphism

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📊 Analytics & Monitoring

The app includes comprehensive analytics tracking:

- **User Actions**: Status changes, service interactions
- **Performance**: Page loads, API response times
- **Engagement**: Service clicks, AI interactions
- **Real-time**: Live user activity and service updates

## 🔐 Security

- **API Validation**: Input validation on all endpoints
- **Rate Limiting**: Prevent API abuse
- **Error Handling**: Graceful error handling and user feedback
- **Environment Variables**: Secure credential management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Community**: Join our Discord/Telegram for discussions

## 🎯 Roadmap

- [ ] Supabase database integration
- [ ] Real-time WebSocket connections
- [ ] Push notifications for engagements
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Integration with more social platforms

---

**Built with ❤️ for the Base ecosystem**
