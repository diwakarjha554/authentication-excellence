import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [2, 'Description must be at least 2 characters long'],
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    }
}, {
    timestamps: true
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
export default Todo;