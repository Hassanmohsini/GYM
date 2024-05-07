import { Schema, model } from "mongoose";

const rulesSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
    title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      }
    }, { timestamps: true });

const Rules = model("Rules", rulesSchema);

export default Rules;


