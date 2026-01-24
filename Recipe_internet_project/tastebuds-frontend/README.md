# TasteBuds Frontend

A React-based frontend application for the TasteBuds recipe sharing platform.

## Features

- **User Authentication**: Register and login with email and password
- **Recipe Management**: View all recipes, add new recipes, edit and delete recipes
- **Protected Routes**: Only authenticated users can access recipe features
- **Responsive Design**: Mobile-friendly interface with beautiful gradient styling
- **API Integration**: Full integration with the TasteBuds backend REST API

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Navigate to the project directory:
   ```bash
   cd tastebuds-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (if not already created):
   ```
   REACT_APP_API_BASE_URL=http://localhost:3000
   ```

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000` (or another port if 3000 is in use).

### Production Build

Create an optimized production build:
```bash
npm run build
```

## Project Structure

```
tastebuds-frontend/
 public/
 src/
    components/
       Navigation.js       # Navigation bar component
       ProtectedRoute.js   # Route protection wrapper
       *.css               # Component styles
    pages/
       Login.js            # Login page
       Register.js         # Registration page
       Recipes.js          # Recipes list page
       AddRecipe.js        # Add recipe form
       *.css               # Page styles
    services/
       api.js              # API integration with axios
    utils/
       auth.js             # Authentication utilities
    App.js                  # Main app component with routing
    App.css                 # Global styles
    index.js                # Entry point
 package.json
```

## API Endpoints

The frontend connects to the backend at `http://localhost:3000` with the following endpoints:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh-token` - Refresh access token

### Recipes
- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get recipe details
- `POST /recipes` - Create a new recipe
- `PATCH /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe

### Comments
- `GET /recipes/:recipeId/comments` - Get recipe comments
- `POST /recipes/:recipeId/comments` - Add a comment

## Pages

### Login Page
- Email and password login form
- Link to registration page
- Form validation and error handling

### Registration Page
- Email and password registration form
- Password confirmation
- Link to login page
- Form validation

### Recipes List
- Display all recipes in a grid layout
- Each recipe card shows:
  - Recipe name
  - Description
  - Ingredients
  - Instructions
  - Cook time
- Action buttons to view, edit, and delete recipes
- Add new recipe button

### Add Recipe Form
- Form fields for:
  - Recipe name
  - Description
  - Ingredients
  - Instructions
  - Cook time (optional)
- Submit and cancel buttons
- Form validation

## Authentication

The application uses JWT tokens for authentication:

1. Tokens are stored in localStorage after login/registration
2. Tokens are automatically added to API requests via axios interceptors
3. Protected routes redirect unauthenticated users to the login page
4. Users can logout to clear their tokens

## Styling

The application uses custom CSS with:
- Gradient color scheme (purple/blue)
- Responsive grid layouts
- Smooth transitions and hover effects
- Mobile-friendly design

## Environment Variables

- `REACT_APP_API_BASE_URL` - Backend API base URL (default: http://localhost:3000)

## Available Scripts

- `npm start` - Run the development server
- `npm build` - Create a production build
- `npm test` - Run tests
- `npm eject` - Eject from create-react-app (not reversible)

## Browser Support

The application supports modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.
