const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const resolvers = {
  Query: {
    getAllEmployees: async () => await Employee.find(),

    getEmployeeById: async (_, { id }) => await Employee.findById(id),

    searchEmployee: async (_, { designation, department }) => {
      let filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;
      return await Employee.find(filter);
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Incorrect credentials");

      return jwt.sign(
        { id: user.id, username: user.username },
        "supersecretkey",
        { expiresIn: "1h" }
      );


    },

    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exists");
      }
    
      const user = new User({ username, email, password });
    
      await user.save();
    
      // return token
      return jwt.sign({ id: user.id }, "supersecretkey", { expiresIn: "1h" });
    },

    


    addEmployee: async (_, args) => {
      const employee = new Employee(args);
      return await employee.save();
    },

    updateEmployee: async (_, { id, ...args }) => {
      return await Employee.findByIdAndUpdate(id, args, { new: true });
    },

    deleteEmployee: async (_, { id }) => {
      await Employee.findByIdAndDelete(id);
      return "Employee deleted correctly";
    },
  },
};


module.exports = resolvers;