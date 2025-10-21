# MongoDB Database Setup for Vercel Deployment

## Current State
⚠️ **User data is NOT currently being stored** - signup is simulated with `console.log()` only.

## Recommended Architecture for Vercel + MongoDB

### Option 1: MongoDB Atlas (Recommended)
MongoDB Atlas is a cloud-hosted MongoDB service that works perfectly with Vercel.

#### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account (M0 tier - free forever)
3. Create a new cluster (choose the region closest to your Vercel deployment)

#### Step 2: Configure Database Access & Network
```bash
# Database Access:
1. Go to "Database Access" in Atlas
2. Click "Add New Database User"
3. Create a user with username/password
4. Set role to "Read and write to any database"
5. Save username and password securely

# Network Access:
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   Note: For production, restrict to Vercel's IP ranges if needed
```

#### Step 3: Get Connection String
```bash
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### Step 4: Add to Vercel Environment Variables
```bash
# In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aibyml?retryWrites=true&w=majority
MONGODB_DB=aibyml
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this
NEXTAUTH_URL=https://your-domain.vercel.app

# For local development (.env.local):
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aibyml?retryWrites=true&w=majority
MONGODB_DB=aibyml
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this
NEXTAUTH_URL=http://localhost:3002
```

### Backend Implementation Options

Since you're deploying a React SPA on Vercel, you have two options:

#### Option A: Vercel Serverless Functions (Recommended for SPAs)
Create API routes in `/api` directory that Vercel will automatically deploy as serverless functions.

#### Option B: Separate Backend Service
Deploy a separate Node.js/Express backend on Vercel or another platform.

## Implementation Guide - Option A (Serverless Functions)

### 1. Install Dependencies
```bash
cd /Users/aibyml.com.hk/AIServicePlatform/frontend
npm install mongodb bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 2. Create Database Utility (`/api/lib/mongodb.ts`)
```typescript
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across module reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new client for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

### 3. Create User Model Schema
```typescript
// /api/models/User.ts
export interface User {
  _id?: string;
  email: string;
  name: string;
  password: string; // hashed
  provider: 'email' | 'google' | 'github' | 'whatsapp';
  emailVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription?: {
    plan: 'free' | 'premium';
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired' | 'cancelled';
  };
}
```

### 4. Create API Endpoints

#### Sign Up Endpoint (`/api/auth/signup.ts`)
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, password } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Create 30-day free subscription
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 30);

    // Insert user
    const result = await users.insertOne({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      provider: 'email',
      emailVerified: false,
      verificationToken,
      createdAt: now,
      updatedAt: now,
      subscription: {
        plan: 'free',
        startDate: now,
        endDate: endDate,
        status: 'active'
      }
    });

    // TODO: Send verification email with token
    // await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      success: true,
      message: 'Account created. Please check your email to verify.',
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### Login Endpoint (`/api/auth/login.ts`)
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check email verification
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Please verify your email first' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscription: user.subscription
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 5. Security Best Practices

#### A. Password Security
```typescript
// Use bcrypt with salt rounds >= 12
const hashedPassword = await bcrypt.hash(password, 12);
```

#### B. Environment Variables
```bash
# NEVER commit these to git!
# Add to .gitignore:
.env.local
.env.production
```

#### C. Input Validation
```typescript
// Validate and sanitize all inputs
import validator from 'validator';

if (!validator.isEmail(email)) {
  return res.status(400).json({ error: 'Invalid email' });
}

const sanitizedEmail = validator.normalizeEmail(email);
```

#### D. Rate Limiting
```typescript
// Install: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});
```

#### E. HTTPS Only
```typescript
// In production, ensure all requests are HTTPS
if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
  return res.redirect(301, `https://${req.headers.host}${req.url}`);
}
```

### 6. Database Indexes (Important for Performance)
```javascript
// Run these commands in MongoDB Atlas or MongoDB Compass:

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ verificationToken: 1 });
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ "subscription.status": 1 });
```

### 7. Backup Strategy
```bash
# MongoDB Atlas provides automated backups in free tier
# Configure in Atlas Dashboard:
1. Go to "Backup" tab
2. Enable "Continuous Backup" (if available in your tier)
3. Or use "Cloud Provider Snapshots"
```

## Alternative: NextAuth.js (Easiest Option)

For a simpler approach with OAuth support:

```bash
npm install next-auth @next-auth/mongodb-adapter mongodb
```

Create `/api/auth/[...nextauth].ts`:
```typescript
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../lib/mongodb";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Your custom authentication logic
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
```

## Deployment Checklist

- [ ] Create MongoDB Atlas cluster
- [ ] Set up database user with strong password
- [ ] Configure network access (0.0.0.0/0 for Vercel)
- [ ] Add environment variables to Vercel
- [ ] Test locally with .env.local
- [ ] Create database indexes
- [ ] Set up monitoring (MongoDB Atlas has built-in monitoring)
- [ ] Configure automated backups
- [ ] Add rate limiting to API endpoints
- [ ] Implement email verification
- [ ] Set up logging (use Vercel Analytics or external service)
- [ ] Test all authentication flows
- [ ] Security audit before production launch

## Cost Estimate

**MongoDB Atlas M0 (Free Tier):**
- Storage: 512 MB
- RAM: Shared
- vCPU: Shared
- Bandwidth: Limited
- Good for: ~1000 active users

**When to Upgrade:**
- M2 ($9/month): ~10,000 users
- M5 ($25/month): ~100,000 users

**Vercel:**
- Hobby (Free): Personal projects
- Pro ($20/month): Production apps

## Monitoring & Maintenance

1. **MongoDB Atlas Dashboard:**
   - Monitor query performance
   - Track database size
   - Set up alerts for slow queries

2. **Vercel Analytics:**
   - Monitor function execution times
   - Track errors
   - Monitor bandwidth usage

3. **Security Updates:**
   - Regularly update dependencies
   - Monitor for security vulnerabilities
   - Rotate secrets periodically

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Vercel Docs: https://vercel.com/docs
- NextAuth.js Docs: https://next-auth.js.org/
