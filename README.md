# 🏠 UrbanEstate - Next-Generation Real Estate Platform

A modern, intelligent real estate platform built with Next.js that combines geospatial intelligence, AI-powered features, and role-based dashboards to revolutionize the property buying and selling experience in Bangladesh.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-7.1.0-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)

## ✨ Features

### 🎯 Core Features

- **Role-Based Access Control** - Separate dashboards for Users, Sellers, and Admins
- **AI-Powered Chatbot** - Rule-based intelligent assistant for property inquiries
- **Property Management** - List, browse, search, and filter properties
- **Advanced Authentication** - NextAuth.js with multiple providers
- **Dark/Light Theme** - Full theme support with context-based switching
- **Responsive Design** - Mobile-first approach, works on all devices
- **Geospatial Intelligence** - Interactive maps with property locations

### 📊 Dashboard Features

#### 👤 User Dashboard

- Bookings management
- Saved properties
- Offers tracking
- Payment history
- Profile management

#### 🏢 Seller Dashboard

- Add and manage property listings
- Analytics and insights
- Booking requests
- Offer management
- Revenue tracking
- Profile settings

#### 👨‍💼 Admin Dashboard

- User management
- Platform oversight
- Content moderation
- System analytics

### 🎨 Interactive Home Features

- **3D Property Visualization** - Three.js powered 3D models
- **EMI Calculator** - Interactive mortgage calculator
- **Property Map** - Leaflet-based interactive map
- **Price Predictor** - AI-powered property price estimation
- **Space Reimaginer** - AI interior design assistant
- **Amenities Showcase** - Visual amenities display
- **Live Support Chat** - Real-time customer support
- **Voice Search** - Voice-activated property search
- **Swipe Deck** - Tinder-style property browsing
- **Before/After Slider** - Property transformation views
- **Architectural Story** - Immersive property narratives
- **Environmental Layers** - Eco-friendly property data
- **AeroTopo Scanner** - Aerial property scanning
- **Lifestyle Triangulation** - Neighborhood analysis
- **Compare Properties** - Side-by-side property comparison
- **FAQ Section** - Common questions answered
- **Testimonial Slider** - Customer reviews
- **Explore Locations** - Area discovery

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Swiper** - Touch slider
- **Recharts** - Data visualization

### Backend

- **MongoDB** - NoSQL database
- **MongoClient** - Database driver
- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js** - Authentication

### 3D & Maps

- **Three.js** - 3D rendering
- **React Three Fiber** - Three.js React renderer
- **React Three Drei** - Three.js helpers
- **Leaflet** - Interactive maps
- **React Leaflet** - Leaflet React components

### Storage & Media

- **Firebase** - Cloud storage and authentication
- **Firebase Admin** - Server-side Firebase SDK
- **React Dropzone** - File uploads
- **UploadThing** - File upload service

### Utilities

- **BcryptJS** - Password hashing
- **EmailJS** - Email service
- **SweetAlert2** - Beautiful alerts
- **Lucide React** - Icon library
- **React CountUp** - Animated counters

## 📁 Project Structure

```
UrbanEstate/
├── public/                      # Static assets
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── about/              # About page
│   │   ├── all-properties/     # Property listings
│   │   ├── api/                # API routes
│   │   │   ├── auth/          # Authentication APIs
│   │   │   └── ai-chat/       # AI chatbot API
│   │   ├── dashboard/          # Role-based dashboards
│   │   │   ├── admin/
│   │   │   ├── seller/
│   │   │   └── user/
│   │   ├── property/[id]/      # Dynamic property page
│   │   ├── sellproperty/       # Add property form
│   │   ├── profile/            # User profile
│   │   ├── updateprofile/      # Update profile
│   │   ├── layout.jsx          # Root layout
│   │   ├── page.jsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/              # React components
│   │   ├── About/              # About section
│   │   ├── Ai Chatbot/         # AI chatbot components
│   │   ├── AllProperty/        # Property components
│   │   ├── Auth/               # Authentication components
│   │   ├── AuthProvider/       # Auth context provider
│   │   ├── dashboard/          # Dashboard components
│   │   ├── home/               # Home page components
│   │   ├── SellProperty/       # Property selling components
│   │   ├── shared/             # Shared components
│   │   └── Theme/              # Theme context & toggle
│   ├── data/                    # Static data
│   ├── lib/                     # Utility libraries
│   │   ├── dbConnect.js        # MongoDB connection
│   │   ├── firebase-config.js  # Firebase config
│   │   └── uploadthing.ts      # UploadThing config
│   └── utils/                   # Helper functions
├── .env.local                   # Environment variables (not in git)
├── next.config.mjs             # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- MongoDB database
- Firebase project (for storage & authentication)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ferdaws-ahmed/UrbanEstate.git
cd UrbanEstate
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
DB_NAME=urban_estate

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# UploadThing (optional)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# EmailJS (optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

- **Netlify** - [Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)
- **Railway** - Auto-detects Next.js
- **Digital Ocean** - App Platform support

## 🔐 Authentication

UrbanEstate uses NextAuth.js for authentication with:

- Email/Password login
- Google OAuth (via Firebase)
- Role-based access (User, Seller, Admin)
- Protected routes via middleware

## 🗄️ Database

### MongoDB Collections

- `users` - User accounts and profiles
- `properties` - Property listings
- `bookings` - Property bookings
- `offers` - Purchase offers
- `payments` - Payment transactions
- `reviews` - User reviews

## 🤖 AI Chatbot

The platform includes a built-in AI chatbot with:

- Rule-based responses for common queries
- Property recommendations
- Multi-topic support (pricing, locations, amenities, etc.)
- No external API key required
- Easy to upgrade to OpenAI/LLM integration

## 🎨 Styling

- **Tailwind CSS 4** for utility-first styling
- **Dark/Light theme** with context-based switching
- **Responsive design** for all screen sizes
- **Custom animations** with Framer Motion
- **Geist font family** for modern typography

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Ferdaws Ahmed** - Project Owner
- **Saimum Islam** - Developer

## 📞 Contact

- **Email**: info@urbanestate.com
- **Phone**: +880 1234 567 890
- **Address**: House #123, Road #45, Gulshan-2, Dhaka-1212

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for database solutions
- Firebase for authentication and storage
- All open-source contributors

---

Built with ❤️ by UrbanEstate Team
