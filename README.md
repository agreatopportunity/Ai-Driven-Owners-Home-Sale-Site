# HomeBase AI - Free FSBO Real Estate Platform

🏠 **An AI-powered For Sale By Owner platform that competes with Zillow through programmatic SEO and superior AI tools.**

## Features

- **AI Listing Writer** - Upload photos and get professional descriptions in seconds
- **AI Photo Enhancement** - Automatic improvements and virtual staging
- **Smart Pricing** - AI-powered valuations based on market data
- **SEO Optimized** - Programmatic pages that outrank Zillow locally
- **100% Free for Sellers** - Monetize through affiliate partnerships

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **AI**: OpenAI-compatible API (works with local LLMs too)
- **Hosting**: Vercel / Railway / Any Node.js host

---

## 🚀 Quick Start (5 minutes)

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- OpenAI API key (or local LLM endpoint)

### 1. Clone & Install

```bash
cd fsbo-ai
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/homebase_ai"

# Auth (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# AI (Required - OpenAI or compatible)
AI_API_KEY="sk-your-openai-key"
AI_BASE_URL="https://api.openai.com/v1"
AI_MODEL="gpt-4o-mini"
```

### 3. Set Up Database

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Production Deployment

### Option A: Vercel (Recommended - Easiest)

1. Push code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel --prod
```

### Option B: Railway (Full-Stack)

1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL plugin
3. Connect GitHub repo
4. Add environment variables
5. Deploy!

### Option C: Self-Hosted (VPS/Docker)

```bash
# Build
npm run build

# Start production server
npm start
```

For Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Configuration

### Database Options

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/homebase"
```

**Supabase (Free tier):**
```env
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

**Neon (Free tier):**
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/homebase"
```

### AI Options

**OpenAI:**
```env
AI_API_KEY="sk-..."
AI_BASE_URL="https://api.openai.com/v1"
AI_MODEL="gpt-4o-mini"
```

**Local LLM (LM Studio/Ollama):**
```env
AI_API_KEY="not-needed"
AI_BASE_URL="http://localhost:1234/v1"
AI_MODEL="llama-3.1-8b"
```

**Anthropic Claude:**
```env
AI_API_KEY="sk-ant-..."
AI_BASE_URL="https://api.anthropic.com/v1"
AI_MODEL="claude-3-haiku-20240307"
```

### Image Storage (Optional for MVP)

For production, add cloud storage:

**Cloudinary:**
```env
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## 📁 Project Structure

```
fsbo-ai/
├── prisma/
│   └── schema.prisma      # Database models
├── src/
│   ├── app/               # Next.js pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # User dashboard
│   │   ├── listing/       # Listing detail pages
│   │   ├── listings/      # Browse listings
│   │   └── list-your-home/ # Create listing flow
│   ├── components/        # React components
│   │   ├── layout/        # Navbar, Footer
│   │   ├── listings/      # Listing cards, gallery
│   │   └── providers/     # Auth provider
│   └── lib/               # Utilities
│       ├── ai.ts          # AI service
│       ├── auth.ts        # NextAuth config
│       ├── prisma.ts      # DB client
│       └── utils.ts       # Helpers
├── .env.example           # Environment template
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Styling
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/listings` | Create listing |
| GET | `/api/listings` | List/search listings |
| POST | `/api/ai/generate-listing` | Generate AI content |
| POST | `/api/inquiries` | Send inquiry |

---

## 💰 Monetization (Add Later)

The platform is free for users. Revenue comes from:

1. **Mortgage Affiliates** - $500-2000 per closed loan
2. **Title/Escrow Referrals** - $200-500 per transaction
3. **Moving Services** - Lead generation
4. **Premium AI Tools** - For agents/power users
5. **Local Service Ads** - Contractors, inspectors

---

## 🎯 SEO Strategy

### Programmatic Pages (Add Later)

Generate unique content pages for:
- `/neighborhoods/[state]/[city]/[area]` - Neighborhood guides
- `/homes-for-sale/[state]/[city]` - City listing pages
- `/[property-type]-for-sale/[city]` - Property type pages

### Sitemap Generation

```typescript
// Add to next.config.js for dynamic sitemap
export async function generateSitemaps() {
  // Generate sitemaps from database
}
```

---

## 🛠 Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma db push   # Sync schema to DB
```

---

## 📝 Next Steps After Launch

1. **Add Image Upload** - Integrate Cloudinary/S3
2. **Add Maps** - Google Maps or Mapbox integration
3. **Add Analytics** - Google Analytics, Posthog
4. **Add Neighborhood Pages** - Programmatic SEO content
5. **Add Email Notifications** - SendGrid/Resend
6. **Add Mortgage Calculator** - Interactive tool
7. **Mobile App** - React Native or PWA

---

## 🤝 Contributing

Pull requests welcome! Please read our contributing guidelines.

---

## 📄 License

MIT License - feel free to use commercially.

---

## 🆘 Support

- Issues: GitHub Issues
- Email: support@homebase.ai
- Docs: [docs.homebase.ai](https://docs.homebase.ai)

---

Built with ❤️ to help homeowners sell without the 6% fee.
