# FloorSense - Node.js Backend

Node.js/Express backend for the FloorSense tactical property analysis platform, connected to MongoDB Atlas.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Required:
- `MONGODB_URI` - MongoDB Atlas connection string
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

Optional:
- `ELEVENLABS_API_KEY` - For text-to-speech integration

### 3. Run Development Server
```bash
npm run dev
```
Server will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Listings
- `GET /api/listings` - Get all listings (with pagination & sorting)
  - Query params: `sortBy`, `page`, `limit`
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing

## Project Structure
```
server/
├── src/
│   ├── index.js          # Main server file
│   ├── models/
│   │   └── Listing.js    # MongoDB schema
│   └── routes/
│       └── listings.js   # Listings endpoints
├── .env.example
├── .gitignore
└── package.json
```

## Next Steps
- [ ] Connect frontend to `/api/listings` endpoints
- [ ] Create upload endpoint for floor plans
- [ ] Integrate ElevenLabs text-to-speech API
- [ ] Add authentication (if needed)
- [ ] Deploy to Vercel or similar
