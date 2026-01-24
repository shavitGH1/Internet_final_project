#  TasteBuds Frontend - Quick Start Guide

##  Project Location
```
c:\Users\shavi\Internet_final_project\Recipe_internet_project\tastebuds-frontend
```

##  Quick Start (3 Steps)

### 1 Start Backend Server
Make sure your backend is running on port 3000:
```bash
cd c:\Users\shavi\Internet_final_project
npm start
```

### 2 Start Frontend Development Server
```bash
cd c:\Users\shavi\Internet_final_project\Recipe_internet_project\tastebuds-frontend
npm start
```

The app will automatically open at `http://localhost:3000` (or next available port)

### 3 Use the Application
- Register a new account or login
- View all recipes
- Add new recipes
- Edit and delete recipes

##  What's Included

 **User Authentication**
- Registration page
- Login page
- JWT token management
- Protected routes

 **Recipe Management**
- View all recipes in grid layout
- Add new recipes with form
- Edit and delete recipes
- Responsive design

 **API Integration**
- Connected to backend on http://localhost:3000
- Axios HTTP client
- Token interceptors
- Error handling

 **Professional UI**
- Modern gradient colors (purple/blue)
- Mobile-responsive design
- Smooth animations
- Professional styling

##  Project Structure

```
src/
 pages/           - Full page components
 components/      - Reusable components
 services/        - API integration
 utils/           - Utility functions
 App.js           - Main app with routing
 index.js         - Entry point
```

##  Available Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server (port 3000) |
| `npm run build` | Create production build |
| `npm test` | Run tests |

##  Backend API Connection

**Base URL**: http://localhost:3000

**Key Endpoints**:
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /recipes` - Get all recipes
- `POST /recipes` - Create recipe
- `PATCH /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe

##  Key Features

### Pages
1. **Login** - Email and password login
2. **Register** - Create new account
3. **Recipes List** - Browse all recipes
4. **Add Recipe** - Create new recipes

### Features
- JWT authentication
- Protected routes
- Form validation
- Error messages
- Responsive design
- Mobile-friendly

##  Configuration

Environment variables in `.env`:
```
REACT_APP_API_BASE_URL=http://localhost:3000
```

##  Troubleshooting

**Can't connect to backend?**
- Check backend is running on port 3000
- Verify CORS is enabled on backend
- Check `.env` file API URL

**Port 3000 already in use?**
- Terminal will show which port is being used
- You can also manually specify: `set PORT=3001 && npm start`

**npm install fails?**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

##  Documentation

Full documentation available in:
- `README.md` - Detailed documentation
- `SETUP_COMPLETE.md` - Setup details and features

##  Next Steps

1. Run the frontend with `npm start`
2. Open http://localhost:3000 in browser
3. Register or login
4. Start adding recipes!

##  Tips

- Recipes are stored in MongoDB backend
- Tokens are stored in localStorage
- All API calls include auth token automatically
- Logout clears the token and redirects to login

---

**That's it!** Your TasteBuds React frontend is ready to use! 
