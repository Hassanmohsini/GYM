import Rules from "../models/admin.model.js";
import User from "../models/user.model.js";
import Exercise from "../models/trainer.model.js";
import asyncHandler from "../config/asyncHandler.js";
import bcrypt from "bcrypt";

const postExerciseByTrainer = asyncHandler(async (req, res) => {
  try {
    // Extract data from request body
    const { username, exercise, description } = req.body;
    // Check if user with the provided email already exists
    const existingExercise = await Exercise.findOne({ exercise });
    if (existingExercise) {
      return res
        .status(400)
        .json({ message: "Exercise already exists with this description" });
    }
    // Create a new instance of the Data model with the provided data
    const newExercise = new Exercise({ username, exercise, description });
    // Save the new data to the database
    await newExercise.save();
    // Return success message
    res.status(201).json({ message: "Exercise posted successfully" });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllUsersByTrainer = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allUsers = await User.find({});

    // Map through all users
    const users = allUsers.map((user) => {
      // Check if the user is a trainer
      if (user.role === "trainer") {
        // For trainer, include specific fields
        return {
          trainerId: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          __v: user.__v,
        };
      } else {
        // For other users, include only username and email
        return {
          username: user.username,
          email: user.email,
        };
      }
    });

    // Combine all data into a single object
    const allData = {
      user: users,
    };

    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllRulesByTrainer = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allRules = await Rules.find({}, "title description -_id"); // Exclude _id fiel
    // Combine all data into a single object
    const allData = {
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

const getAllExercisesByTrainer = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models with specified fields
    const allExercise = await Exercise.find({}); // Include _id field
    // Combine all data into a single object
    const allData = {
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

const getSingleDataByIdViaTrainer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    // Fetch data from different models by ID
    const singleUser = await User.findById(id);
    // const singleRule = await Rules.findById(id);
    const singleExercise = await Exercise.findById(id);
    // Combine the data into a single object
    const singleData = {
      user: singleUser,
      // rule: singleRule,
      exercise: singleExercise,
    };
    // Return the combined data in the response
    res.status(200).json(singleData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateExerciseByIdViaTrainer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const newData = req.body; // Extract the updated data from the request body
    // Update data in different models based on the endpoint
    const updatedExercise = await Exercise.findByIdAndUpdate(id, newData, {
      new: true,
    });
    // Combine the updated data into a single object
    const allUpdatedData = {
      exercise: updatedExercise,
    };
    // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateProfileByIdViaTrainer = asyncHandler(async (req, res) => {
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
  postExerciseByTrainer,
  getAllUsersByTrainer,
  getAllRulesByTrainer,
  getAllExercisesByTrainer,
  getSingleDataByIdViaTrainer,
  updateExerciseByIdViaTrainer,
  updateProfileByIdViaTrainer,
};
