# POAP Minter

A responsive web application that allows users to mint POAPs (Proof of Attendance Protocol) by authenticating with Twitter/X.

## Features

- 🐦 Twitter/X OAuth authentication
- 📧 Support for ENS names, Ethereum addresses, and email addresses
- 🔒 One POAP per Twitter account
- 📊 Admin dashboard to view minted POAPs
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 and TypeScript

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Twitter provider
- **Database**: Redis (Upstash)
- **Validation**: Zod, React Hook Form
- **Blockchain**: Ethers.js for ENS resolution
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Twitter OAuth
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret

# POAP Configuration (defaults provided)
POAP_EVENT_ID=191758
POAP_SECRET_CODE=902096
POAP_API_KEY=doJbd1DdLFG3q6lE1o22LOzfpFYmIkcN1n7ataBYtBgQ7RaA9XfZ1vpyXmjs8lWHPJ36t4GKSHQnfLrPwbouzl87Zh5dICQd9gnHvAf5ngxraPonAj4BizSs7uMwvLyl
POAP_CLIENT_SECRET=JybIHlU1xZQyjNO6Tzq4QdzTPFITfxAyKMb3_EFlIV_jEcD7F8R1-Ruf7SJ3T0wl
POAP_CLIENT_ID=x9wYXDc3HY6HONCqHuHk1MSCxcxb8j3y

# Redis (Upstash REST API)
UPSTASH_REDIS_REST_URL=your-upstash-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token

# Infura (for ENS resolution)
NEXT_PUBLIC_INFURA_PROJECT_ID=your-infura-project-id
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poap-minter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Twitter OAuth credentials
   - Set up Upstash Redis and add credentials
   - (Optional) Add Infura project ID for ENS resolution

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

The `vercel.json` file includes default POAP configuration values.

## Pages

- `/` - Main page with Twitter authentication and POAP minting form
- `/admin` - Admin dashboard showing all minted POAPs

## Security

- One POAP per Twitter account enforced
- Server-side validation of all inputs
- Secure session management with NextAuth.js
- Environment variables for sensitive data

## License

MIT
