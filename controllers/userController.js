import User from "../models/user.model.js";
import Rules from "../models/admin.model.js";
import Exercise from "../models/trainer.model.js";
import asyncHandler from "../config/asyncHandler.js";
import bcrypt from "bcrypt";

const getAllRulesByUser = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allRules = await Rules.find({}, "title description -_id"); // Exclude _id field
    // Combine all data into a single object
    const allData = {
      // user: users,
      rules: allRules,
    };
    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllExercisesByUser = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allExercise = await Exercise.find({}, `exercise description -_id`); // Exclude _id field
    // Combine all data into a single object
    const allData = {
      // user: users,
      exercise: allExercise,
    };
    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getUserProfileById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    // Find the user by ID
    const user = await User.findById(id);
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user is a member
    if (user.role !== "member") {
      return res.status(403).json({ message: "Access forbidden" });
    }
    // Return the user profile
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      __v: user.__v,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateUserProfileById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const newData = req.body; // Extract the updated data from the request body

    // Create an object to hold the updated fields
    const updatedFields = {};

    // Check if password is being updated
    if (newData.password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newData.password, 10);
      // Store the hashed password in the updated fields object
      updatedFields.password = hashedPassword;
    }

    // Update other fields (username, email)
    if (newData.username) {
      updatedFields.username = newData.username;
    }
    if (newData.email) {
      updatedFields.email = newData.email;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    // Check if the user exists
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Combine the updated data into a single object
    const allUpdatedData = {
      user: updatedUser,
    };

    // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export {
  getAllRulesByUser,
  getAllExercisesByUser,
  getUserProfileById,
  updateUserProfileById,
};
