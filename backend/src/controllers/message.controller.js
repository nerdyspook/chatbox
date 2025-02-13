import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get query parameters for pagination and sorting
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sort || "fullName"; // default sort field
    const sortOrder = req.query.order === "desc" ? -1 : 1; // default ascending order
    const skip = (page - 1) * limit;

    // Find users excluding the logged-in user
    const users = await User.find({
      _id: { $ne: currentUserId },
    })
      .select("-password")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Count total users (excluding the logged-in user) for pagination metadata
    const totalResults = await User.countDocuments({
      _id: { $ne: currentUserId },
    });
    const totalPages = Math.ceil(totalResults / limit);

    res.status(200).json({
      page,
      limit,
      totalPages,
      totalResults,
      users,
    });
  } catch (error) {
    console.error("Error in get users controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatPartnerId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: currentUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in get messages controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: chatPartnerId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Message must include text or an image" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId: chatPartnerId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in new message controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
