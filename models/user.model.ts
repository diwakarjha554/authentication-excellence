import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: [true, 'Clerk ID is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    photo: {
        type: String,
        required: [true, 'Photo URL is required'],
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;