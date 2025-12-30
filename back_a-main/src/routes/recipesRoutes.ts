import express from 'express';
import recipeController from './../controllers/recipeController'; 
import authController from './../controllers/authController'; 
import commentRoutes from './commentRoutes'; // ייבוא הראוטר של התגובות

const router = express.Router();

router.use('/:recipeId/comments', commentRoutes);

router.use(authController.protect);

router
.route('/')
.get(recipeController.get) // שונה מ-getAllRecipes
.post(recipeController.post); // שונה מ-createRecipe

router
.route('/:id')
.get(recipeController.getById) // שונה מ-getRecipe
.patch(recipeController.put) // שונה מ-updateRecipe
.delete(
    authController.restrictTo('user', 'admin'), 
    recipeController.del // שונה מ-deleteRecipe
); 

export default router;
