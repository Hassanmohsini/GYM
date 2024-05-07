import User from "../models/user.model.js";
import Rules from "../models/admin.model.js";
import Exercise from "../models/trainer.model.js";
import asyncHandler from "../config/asyncHandler.js";
import bcrypt from "bcrypt";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "uploads/")
	},
	filename: function(req, file, cb) {
		const splitFileName = file.originalname.split(".");
		const extension = splitFileName[splitFileName.length - 1];
		const filename = `${crypto.randomUUID()}.${extension}`;
		cb(null, filename);
	},
});

const app = express();
const upload = multer({ dest: "uploads/" });


const getAdmin = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Hey admin" });
});

const postRuleByAdmin = asyncHandler(async (req, res) => {
  try {
    const { username, title, description } = req.body;
    // Check if the rule already exists
    const existingRule = await Rules.findOne({ username, title, description });
    console.log(existingRule);
    if (existingRule) {
      return res.status(400).json({ message: "The rule already exist" });
    }
    // Extract data from request body

    // Check if required fields are provided
    if (!username || !title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Create a new instance of Rules model
    const newRule = new Rules({ username, title, description });

    // Save the new rule to the database
    await newRule.save();

    // Return success message
    res.status(201).json({ message: "Rule posted successfully" });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const uploadPicture = upload.single("picture"); asyncHandler (async (req, res) => {
  const {username, password} = req.body;
	const picture = req.file.filename;
	await User.create({username, password, picture})
	res.status(201).json({message: "user registered successfully"});
});

const getAllUsersByAdmin = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models
    const allUser = await User.find();
    // Combine all data into a single object or array
    const allData = {
      user: allUser,
    };
    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllRulesByAdmin = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models
    const allRules = await Rules.find();
    // Combine all data into a single object or array
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

const getAllExercisesByAdmin = asyncHandler(async (req, res) => {
  try {
    // Fetch all data from different models
    const allExercise = await Exercise.find();

    // Combine all data into a single object or array
    const allData = {
      exercisr: allExercise,
    };
    // Return all data in the response
    res.status(200).json(allData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getSingleDataByIdViaAdmin = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Fetch data from different models by ID
    const singleUser = await User.findById(id);
    const singleRule = await Rules.findById(id);
    const singleExercise = await Exercise.findById(id);

    // Combine the fetched data into a single object
    const singleDataAdmin = {
      user: singleUser,
      rule: singleRule,
      exercise: singleExercise,
    };

    // Return the combined data in the response
    res.status(200).json(singleDataAdmin);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const putUsersByIdViaAdmin = asyncHandler(async (req, res) => {
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

const putRulesByIdViaAdmin = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const newData = req.body; // Extract the updated data from the request body
    // Update data in different models based on the endpoint
    const updatedRule = await Rules.findByIdAndUpdate(id, newData, {
      new: true,
    });
    // Combine the updated data into a single object
    const allUpdatedData = {
      rule: updatedRule,
    };
    // Return the combined updated data in the response
    res.status(200).json(allUpdatedData);
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
})

const putExercisesByIdViaAdmin = asyncHandler(async (req, res) => {
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
})

const deleteSingleDataByIdViaAdmin = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Delete data in different models based on the endpoint
    const deletedUser = await User.findByIdAndDelete(id);
    const deletedRule = await Rules.findByIdAndDelete(id);
    const deletedExercise = await Exercise.findByIdAndDelete(id);

    // Return success message in the response
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export {
  getAdmin,
  postRuleByAdmin,
  uploadPicture,
  getAllUsersByAdmin,
  getAllRulesByAdmin,
  getAllExercisesByAdmin,
  getSingleDataByIdViaAdmin,
  putUsersByIdViaAdmin,
  putRulesByIdViaAdmin,
  putExercisesByIdViaAdmin,
  deleteSingleDataByIdViaAdmin,
};
