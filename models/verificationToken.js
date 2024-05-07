import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	token: {
		type: String,
		required: true
	}
}, { timestamps: true });

const VerificationToken = model("VerificationToken", tokenSchema);

export default VerificationToken;