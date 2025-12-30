import mongoose, { Schema, Document, Query } from 'mongoose'; // הוספנו כאן את Query

export interface IComment extends Document {
    comment: string;
    createdAt: Date;
    user: mongoose.Schema.Types.ObjectId;
    recipe: mongoose.Schema.Types.ObjectId;
}

// הגדרת טיפוס עבור המסמך המלא
interface ICommentDocument extends IComment, Document {}

const commentSchema: Schema = new mongoose.Schema({
    // ... (שאר הסכימה נשארת ללא שינוי)
    comment: {
        type: String,
        required: [true, 'Comment can not be empty!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Comment must belong to a user!']
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: [true, 'Comment must belong to a recipe!']
    }
});

commentSchema.pre(/^find/, function(this: Query<any, ICommentDocument>, next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

const Comment = mongoose.model<ICommentDocument>('Comment', commentSchema);

export default Comment;
