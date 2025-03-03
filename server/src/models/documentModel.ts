import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  _id: String,
  name: String,
  data: Object,
  versions: [{
    data: Object, // Content of the document at this version
    createdAt: { type: Date, default: Date.now }, // Timestamp of the version
    updatedBy: String // User ID of the person who made the changes
  }]
});

export const Document = mongoose.model("document", documentSchema);
