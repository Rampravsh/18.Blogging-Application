const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new Schema(
  {
    // User's full name
    fullName: {
      type: String,
      required: true,
    },
    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Salt for password hashing
    salt: {
      type: String,
    },
    // Hashed password
    password: {
      type: String,
      required: true,
    },
    // URL of the user's profile image
    profileImageURL: {
      type: String,
      default: "/images/default.avif",
    },
    // User's role (USER or ADMIN)
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Hash the password before saving the user
userSchema.pre("save", function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // 1. Create a random salt
  const salt = randomBytes(16).toString();
  // 2. Hash the password with the salt
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  // 3. Replace plain password with the salt and hashed password
  this.salt = salt;
  this.password = hashedPassword;

  next();
});

// Static method to match the password
userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found!");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash) {
    throw new Error("Incorrect Password");
  }

  return user;
});

const User = model("user", userSchema);

module.exports = User;