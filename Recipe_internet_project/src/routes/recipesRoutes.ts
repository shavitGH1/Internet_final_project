import express from 'express';
import recipeController from '../controllers/recipeController'; 
import authController from '../controllers/authController'; 
import commentRoutes from './commentRoutes'; // ייבוא הראוטר של התגובות

const router = express.Router();

router.use('/:recipeId/comments', commentRoutes);

router.use(authController.protect);

router
.route('/')
.get(recipeController.get.bind(recipeController)) // שונה מ-getAllRecipes
.post(recipeController.post.bind(recipeController)); // שונה מ-createRecipe

router
.route('/:id')
.get(recipeController.getById.bind(recipeController)) // שונה מ-getRecipe
.patch(recipeController.put.bind(recipeController)) // שונה מ-updateRecipe
.delete(recipeController.del.bind(recipeController)); // שונה מ-deleteRecipe 

// Toggle favorite
router.post('/:id/favorite', authController.protect, recipeController.toggleFavorite.bind(recipeController));

export default router;
