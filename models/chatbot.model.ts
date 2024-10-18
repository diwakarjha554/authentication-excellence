import mongoose, { Schema, Document } from 'mongoose';

interface IMessage {
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

interface IChatbotSession extends Document {
    userId: string;
    title: string;
    messages: IMessage[];
    lastInteraction: Date;
    status: 'active' | 'archived';
}

const MessageSchema = new Schema<IMessage>({
    role: {
        type: String,
        enum: ['user', 'bot'],
        required: [true, 'Role is required'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatbotSessionSchema = new Schema<IChatbotSession>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            default: 'New Chat',
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        messages: [MessageSchema],
        lastInteraction: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['active', 'archived'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const ChatbotSession =
    mongoose.models.ChatbotSession || mongoose.model<IChatbotSession>('ChatbotSession', ChatbotSessionSchema);

export default ChatbotSession;
