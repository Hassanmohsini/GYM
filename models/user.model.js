import { Schema, model } from "mongoose";

// username, email and password

const userSchema = new Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  profilePicture: {type: String, default: " "},
  verified: {type: Boolean, default: false},
  role: {
    type: String,
    enum: ["member", "admin", "trainer"],
    default: "admin",
  },
}, { timestamps: true });

const User = model("user", userSchema);

export default User;



// const userSchema = new Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true },
//   password: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function (value) {
//         // Password must be at least 8 characters long
//         // Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character
//         return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
//       },
//       message: props => `${props.value} is not a valid password. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`
//     }
//   }
// }, { timestamps: true });
