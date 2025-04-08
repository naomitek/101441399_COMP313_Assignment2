const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//expressions for Validation
const emailRegEx = /^\S+@\S+\.\S+$/;
const usernameRegEx = /^[a-zA-Z0-9_]{4,20}$/;

//create Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minLength: [4, "Username must be at least 4 characters"],
        maxLength: [20, "Username cannot be more than 20 characters"],
        match: [usernameRegEx, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        maxLength: [100, "Email cannot be more than 100 characters"],
        match: [emailRegEx, "Email format is invalid. Must be XXX@XXX.XXX"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

//hash password before saving
UserSchema.pre("save", async function (next) {
    // Hasheamos solo si la contraseña fue modificada
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    this.createdAt = Date.now();
    this.updatedAt = Date.now();
    next();
});


//create and export model
const User = mongoose.model("User", UserSchema);
module.exports = User;

