import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe extends Document {
    title: string;
    description: string;
    ingredients: string[];
    steps: string[];
    cookingTime: number;
    imageCover: string;
    createdAt: Date;
    favorites: mongoose.Schema.Types.ObjectId[];
    user: mongoose.Schema.Types.ObjectId;
}

const recipeSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A recipe must have a title'],
        unique: true,
        trim: true,
        maxlength: [40, 'A recipe title must have less or equal than 40 characters']
    },
    description: {
        type: String,
        trim: true
    },
    ingredients: {
        type: [String],
        required: [true, 'A recipe must have ingredients']
    },
    steps: {
        type: [String],
        required: [true, 'A recipe must have steps']
    },
    cookingTime: {
        type: Number,
        required: [true, 'A recipe must have a cooking time']
    },
    imageCover: {
        type: String,
        required: [true, 'A recipe must have a cover image']
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipe must belong to a User']
    }
});

recipeSchema.index({ title: 1, difficulty: 1 });

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;
