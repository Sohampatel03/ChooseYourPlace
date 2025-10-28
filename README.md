# ChooseYourPlace 🏠

A full-stack vacation rental platform built with Node.js, Express, MongoDB, and EJS. Users can browse, list, and review properties worldwide.

![ChooseYourPlace](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)

## 🌟 Features

- **User Authentication**: Secure signup/login with Passport.js
- **Property Listings**: Create, read, update, and delete vacation rentals
- **Review System**: Leave ratings and comments on properties
- **Authorization**: Owner-only editing and deletion of listings/reviews
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Flash Messages**: Real-time feedback for user actions
- **Image Hosting**: URL-based image management

## 🚀 Live Demo

[**Visit ChooseYourPlace**](https://choose-your-place.vercel.app/listings)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chooseyourplace.git
   cd chooseyourplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chooseyourplace
   
   # Session Secret (generate a random string)
   SECRET=your_super_secret_session_key_here
   
   # Port (optional, defaults to 2000)
   PORT=2000
   
   # Node Environment
   NODE_ENV=development
   ```

4. **Initialize the database** (optional - adds sample listings)
   ```bash
   cd init
   node index.js
   cd ..
   ```

5. **Build Tailwind CSS**
   ```bash
   npm run build
   ```

6. **Start the server**
   ```bash
   npm start
   ```

   For development with Tailwind watch mode:
   ```bash
   npm run dev
   ```

7. **Access the application**
   
   Open your browser and navigate to `https://choose-your-place.vercel.app/listings`

## 📁 Project Structure

```
chooseyourplace/
├── models/              # Mongoose schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/              # Express routes
│   ├── authentication.js
│   ├── listing.js
│   └── review.js
├── views/               # EJS templates
│   ├── includes/        # Partials (navbar, footer, flash)
│   ├── layouts/         # Layout templates
│   └── listings/        # Listing views
├── public/              # Static assets
│   ├── css/
│   └── js/
├── utils/               # Utility functions
│   ├── ExpressError.js
│   └── wrapAsync.js
├── init/                # Database initialization
├── middleware.js        # Custom middleware
├── schema.js            # Joi validation schemas
├── app.js               # Main application file
└── package.json
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM library
- **Passport.js** - Authentication middleware
- **Express-session** - Session management
- **Connect-flash** - Flash messages

### Frontend
- **EJS** - Templating engine
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Bootstrap** - UI components (minimal usage)

### Validation & Security
- **Joi** - Schema validation
- **passport-local-mongoose** - Password hashing

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required),
  password: String (hashed)
}
```

### Listing Model
```javascript
{
  title: String (required),
  description: String,
  image: String (default provided),
  price: Number,
  location: String,
  country: String,
  reviews: [ObjectId] (ref: Review),
  owner: ObjectId (ref: User)
}
```

### Review Model
```javascript
{
  comment: String (required),
  rating: Number (1-5, required),
  author: ObjectId (ref: User),
  createdAt: Date (default: Date.now)
}
```

## 🔐 Authentication

The app uses Passport.js with Local Strategy:
- Passwords are hashed using `passport-local-mongoose`
- Sessions are stored server-side with express-session
- Protected routes require authentication
- Authorization checks ensure users can only modify their own content

## 🚦 API Routes

### Authentication
- `GET /signup` - Signup page
- `POST /signup` - Register new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - Create listing form (auth required)
- `POST /listings` - Create new listing (auth required)
- `GET /listings/:id` - View single listing
- `GET /listings/:id/edit` - Edit listing form (owner only)
- `PUT /listings/:id` - Update listing (owner only)
- `DELETE /listings/:id` - Delete listing (owner only)

### Reviews
- `POST /listings/:id/review` - Add review (auth required)
- `DELETE /listings/:id/review/:reviewId` - Delete review (author only)

## 🎨 UI Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern UI**: Clean, gradient-based design with smooth transitions
- **Flash Messages**: Animated success/error notifications
- **Image Previews**: Visual feedback for property images
- **Interactive Forms**: Client-side validation with Bootstrap
- **Sticky Navigation**: Easy access to main navigation
- **Star Ratings**: Visual rating system for reviews

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection via method-override
- Input validation with Joi
- Owner-only edit/delete authorization
- SQL injection prevention via Mongoose


## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `SECRET` | Session secret key | `mysupersecretkey123` |
| `PORT` | Server port (optional) | `2000` |
| `NODE_ENV` | Environment mode | `production` or `development` |

## 🚀 Deployment

### Vercel (Current)

**Important Notes for Vercel:**
- Install `connect-mongo` for persistent sessions
- Configure environment variables in Vercel dashboard
- Sessions may not work reliably in free tier

### Alternative: Render/Railway (Recommended)

1. Create account on Render.com or Railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy

These platforms maintain persistent connections, making them better suited for session-based authentication.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Soham Patel**
- GitHub: [sohampatel03](https://github.com/sohampatel03)

## 🙏 Acknowledgments

- Design inspiration from Airbnb
- Icons from Font Awesome
- UI components from Tailwind CSS
- Sample images from Unsplash

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: soham171203@gmail.com

---

