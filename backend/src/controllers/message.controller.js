import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketID, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const userID = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userID } }).select(
      "-password"
    );
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Get User For Sidebar Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  const userID = req.user._id;
  const { id: userToChatID } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderID: userID, receiverID: userToChatID },
        { senderID: userToChatID, receiverID: userID },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Get Messages Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  const userID = req.user._id;
  const { id: userToChatID } = req.params;
  const { message, image } = req.body;
  let imageURL;

  try {
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderID: userID,
      receiverID: userToChatID,
      message,
      image: imageURL,
    });

    await newMessage.save();

    console.log("UserID: ", userToChatID);

    const recieverSocketID = getRecieverSocketID(userToChatID);
    console.log("Reciever Socket ID: ", recieverSocketID);

    if (recieverSocketID) {
      io.to(recieverSocketID).emit("getMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Send Message Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
