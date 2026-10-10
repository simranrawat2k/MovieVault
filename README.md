# MovieVault

MovieVault is a movie discovery web application where users can explore movies, search for titles, view movie details, and save their favorite movies to a personal collection. It also includes user authentication with email OTP verification.

The project is built using the MERN stack, with a third-party movie API to fetch movie information.

## Project Overview and Architecture

MovieVault follows a client-server architecture.

- **Frontend:** React handles the user interface, movie cards, search, authentication pages, and saved movie collection.
- **Backend:** Node.js and Express provide REST APIs for authentication, movie search, movie listings, and saved movies.
- **Database:** MongoDB stores user accounts, OTP challenges, and saved movie records.
- **External services:** Brevo is used for email OTP delivery, and RapidAPI provides movie data from IMDb.

The frontend communicates with the backend through Axios. The backend handles requests, verifies users where required, and communicates with MongoDB and external APIs.

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- Styled Components
- React Router
- Axios
- React Toastify

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- CORS

**External Services**
- MongoDB Atlas
- Brevo for email OTPs
- RapidAPI for movie data

## Environment Variables

The project uses environment variables to configure API URLs, database access, authentication, and external services.

### Frontend

Create `.env.development` and `.env.production` in the frontend project root.

Required variable:

- `VITE_API_URL` — the base URL of the backend API.

For local development, the URL should point to your local backend. For production, it should point to your deployed backend.

### Backend

Create a `.env` file in the backend project root.

Variables used by the backend include:

- `PORT` — the port used by the Express server.
- `CLIENT_URL` — the frontend origin allowed by CORS.
- `MONGODB_URI` — the MongoDB connection string.
- `JWT_SECRET` — the secret used to sign and verify authentication tokens.
- `BREVO_API_KEY` — the API key used to send emails through Brevo.
- `RAPIDAPI_KEY` — the RapidAPI key.
- `RAPIDAPI_HOST` — the RapidAPI host for the movie service.

## Database Setup

MovieVault uses MongoDB. MongoDB Atlas can be used for a hosted database, or a local MongoDB instance can be configured.

1. Create a MongoDB database.
2. Configure the database connection string in the backend environment variables.
3. Ensure your database user has the required permissions.
4. Start the backend and confirm that the database connects successfully.

Mongoose models define the structure of user accounts, OTP challenges, and saved movies. Collections and indexes are created through the application's Mongoose models when required.

## Brevo and OTP Integration

Brevo is used to send email OTPs for account verification and password-reset flows.

To configure it:

1. Create a Brevo account.
2. Generate an API key.
3. Configure the API key in the backend environment variables.
4. Set up and verify a sender address in Brevo.
5. Test email verification and password-reset flows.

OTP challenges are stored in MongoDB and include details such as the email, OTP hash, purpose, expiration time, attempt count, and consumption status.

OTP codes expire after a limited period. The backend should validate the code and its purpose before allowing the related action.

Phone-based OTP login is not documented as a completed feature in this version; the implemented email OTP flows should be tested independently.

## RapidAPI and Movie API Configuration

MovieVault uses a movie API available through RapidAPI to retrieve IMDb movie information.

To configure it:

1. Create a RapidAPI account.
2. Subscribe to the required movie API plan.
3. Obtain the API key and host.
4. Add the credentials to the backend environment variables.
5. Restart the backend.

The backend provides endpoints for retrieving the Top 250 movies and searching movie titles. Search requests are triggered after the user stops typing for one second.

Movie data is cached in the browser's session storage to reduce repeated requests when returning to the movie list. If the Top 250 API request fails, the application can fall back to local sample movie data.

## Running the Project Locally

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB installation
- RapidAPI account
- Brevo account for email OTP functionality

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd movievault
```

### 2. Set up the backend

Open a terminal in the backend directory.

```bash
npm install
```

Create the backend `.env` file and configure the required environment variables.

Start the server using the script configured in `package.json`, for example:

```bash
npm run dev
```

The backend uses port `5000` by default unless another port is configured.

### 3. Set up the frontend

Open another terminal in the frontend directory.

```bash
npm install
```

Create `.env.development` and configure `VITE_API_URL` to point to the local backend.

Start the frontend:

```bash
npm run dev
```

Vite will display the local URL in the terminal, usually `http://localhost:5173`.

### 4. Test the application

- Create an account and verify the email OTP.
- Log in to your account.
- Browse the movie list.
- Search for a movie title.
- Save a movie to your collection.
- Open your collection and remove a saved movie.
- Test the forgot-password flow.

## Live Demo and Repository

- **Live URL:** To be added.
- **GitHub Repository:** To be added.

## Known Limitations and Trade-offs

- Movie availability and search results depend on the third-party API and its subscription limits.
- The movie list uses session storage caching, which lasts for the browser tab's session and is not a permanent movie database.
- Local sample data is used as a fallback when the Top 250 request fails.
- The frontend and backend must be configured with the correct URLs and CORS settings for deployment.
- OTP delivery depends on Brevo configuration, sender verification, and service availability.
- Database schema changes are managed through Mongoose models rather than a dedicated migration system.
- The application requires a working network connection for API requests, email verification, and database access.

## Future Improvements

- **Advanced Movie Filters:** Allow users to filter movies by genre, rating, and language.
- **TV Series:** Extend MovieVault to include TV series alongside movies.
- **Admin Panel:** Add an admin dashboard to manage users and oversee movie-related content.
- **AI Movie Recommendations:** Add an assistant that lets users ask for movie recommendations based on their interests, preferred genres, mood, or favorite movies.

---

MovieVault is a learning project focused on building a full-stack movie application with authentication, external API integration, and personal movie collections.