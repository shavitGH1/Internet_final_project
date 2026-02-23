import express from 'express';
import recipeController from '../controllers/recipeController'; 
import authController from '../controllers/authController'; 

const router = express.Router();

router.get('/', recipeController.get.bind(recipeController));
router.get('/:id', recipeController.getById.bind(recipeController));

router.use(authController.protect);

router.post('/:id/favorite', recipeController.toggleFavorite.bind(recipeController));
router.post('/', recipeController.post.bind(recipeController));

router
  .route('/:id')
  .patch(recipeController.put.bind(recipeController))
  .delete(recipeController.del.bind(recipeController));

export default router;