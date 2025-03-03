import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true }, // Clerk's user ID
  email: { type: String, required: true, unique: true }, // User's email
  firstName: { type: String }, // User's first name
  lastName: { type: String }, // User's last name
  profileImageUrl: { type: String }, // User's profile image URL
  lastActiveAt: { type: Date, default: Date.now }, // Last active timestamp
});

export const User = mongoose.model('User', userSchema);