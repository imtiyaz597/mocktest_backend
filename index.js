const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const authenticate = require('./middleware/auth'); // ✅ Import the middleware
const User = require('./models/User')
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const PasswordResetToken = require("./models/PasswordResetToken");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) =>
    console.error("❌ MongoDB connection error:", error.message)
  );


// ✅ Middleware for verifying JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// ✅ Middleware for Role-Based Access
const verifyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Forbidden" });
  }
  next();
};

//Forgot password logic 
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: remove any existing token for the user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate a new token
    const token = crypto.randomBytes(32).toString("hex");

    // Save to DB with expiration
    await PasswordResetToken.create({
      userId: user._id,
      token,
      createdAt: Date.now(), // Just for clarity
    });

    const resetLink = `https://full-stack-project-1-vwwb.onrender.com/api/auth/reset-password/${token}`;

    // Configure transporter (example with Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Optional: check if transporter is ready
    await transporter.verify();

    // Send the reset email
    await transporter.sendMail({
      from: `"Exam App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      text: `Reset your password using this link: ${resetLink}`,
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Password Reset Request</h2>
    <p>You requested a password reset.</p>
    <p>
      <a href="${resetLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #007BFF;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      " target="_blank">
        Reset Your Password
      </a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>This link will expire in 1 hour.</p>
  </div>
`,


    });
    console.log("Reset link:", resetLink);

    return res.json({ message: "Reset link sent to email" });

  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});


//Reset the password
app.post("/api/auth/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });

    const resetRecord = await PasswordResetToken.findOne({ token });
    if (!resetRecord) return res.status(400).json({ message: "Invalid or expired token" });

    const user = await User.findById(resetRecord.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove the used token
    await PasswordResetToken.deleteOne({ token });

    return res.json({ message: "Password reset successfully" });

  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});



//Sign in
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Sign-in request received:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Count existing users to decide the role
    const userCount = await User.countDocuments();
    let role = "Student"; // default

    if (userCount === 0) {
      role = "Admin"; // First user becomes Admin
    } else if (userCount === 1) {
      role = "Student"; // Second user becomes Student
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // assigned based on count
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// ✅ Admin creating new users
app.post("/api/admin/users", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Normalize role casing: "student" → "Student"
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    const validRoles = ["Student", "Teacher", "Management"];
    if (!validRoles.includes(formattedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: formattedRole, // use the formatted role
    });

    await newUser.save();

    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// Admin can create Teacher/Management users
app.post('/api/admin/create-user', authenticate, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only Admin can create
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!['Teacher', 'Management'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: `${role} account created successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});






// ✅ Get Profile Details
app.get("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Users (Admin-Only)
app.get("/api/admin/users", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Add a User (Admin-Only)
app.post("/api/admin/users", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const validRoles = ["Student", "Teacher", "Management"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Delete a User (Admin-Only)
app.delete("/api/admin/users/:id", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


const mockTestRoutes = require("./routes/admin"); // Adjust file name if needed
app.use("/api/admin", mockTestRoutes); // Correct path


// ✅ Import Routes
const managementRoutes = require("./routes/admin");
app.use("/", managementRoutes); // Correct route setup

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  