import mongoose from "mongoose";

const chatCollection = "chat";

const chatSchema = new mongoose.Schema({
  user: {
    required: true,
    type: String,
    unique: true,
  },
  message: {
    required: true,
    type: String,
  },
  timestamp: { type: Date, default: Date.now },
});

export const chatModel = new mongoose.model(chatCollection, chatSchema);
