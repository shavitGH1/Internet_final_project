import mongoose, { Schema, Document, Query } from 'mongoose'; 

export interface IComment extends Document {
    comment: string;
    createdAt: Date;
    user: mongoose.Schema.Types.ObjectId;
    recipe: mongoose.Schema.Types.ObjectId;
}

interface ICommentDocument extends IComment, Document {}

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

commentSchema.pre(/^find/, function(this: Query<any, ICommentDocument>, next) {
    this.populate({
        path: 'user',
        select: 'username email profilePic'
    });
    next();
});

const Comment = mongoose.model<ICommentDocument>('Comment', commentSchema);

export default Comment;