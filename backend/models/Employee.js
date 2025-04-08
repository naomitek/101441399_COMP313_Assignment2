const mongoose = require("mongoose");

//regular expressions for validation
const emailRegEx = /^\S+@\S+\.\S+$/;
const nameRegEx = /^[a-zA-Z\s]+$/;

//create schema
const EmployeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First Name is required"],
        maxLength: [50, "First Name cannot be more than 50 characters"]
    },
    last_name: {
        type: String,
        required: [true, "Last Name is required"],
        maxLength: [50, "Last Name cannot be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        maxLength: [100, "Email cannot be more than 100 characters"],
        match: [emailRegEx, "Email format is invalid. Must be XXX@XXX.XXX"]
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender is required"]
    },
    designation: {
        type: String,
        required: [true, "Designation is required"],
        default: "Unknown",
        maxLength: [50, "Designation cannot be more than 50 characters"]
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [1000, "Salary must be at least 1000"]
    },
    date_of_joining: {
        type: Date,
        required: [true, "Date of Joining is required"]
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        maxLength: [50, "Department cannot be more than 50 characters"]
    },
    employee_photo: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

//pre-save hook to check for duplicate email
EmployeeSchema.pre("save", async function (next) {
    try {
        console.log(`Attempting to save employee with email: ${this.email}`);

        //check if email already exists using async/await
        const existingEmployee = await mongoose.model("Employee").findOne({ email: this.email });

        if (existingEmployee) {
            console.log(`Employee with email ${this.email} already exists. Aborting save.`);
            return next(new Error(`Employee with email ${this.email} already exists. Cannot insert.`));
        }

        console.log(`Employee with email ${this.email} does not exist. Proceeding with save.`);
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
        next();
    } catch (err) {
        console.error(`Error while checking existing email: ${err.message}`);
        return next(err);
    }
});

//create and export model
const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
