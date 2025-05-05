const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
} = require("../models/user");

// JWT Secret - Should be in environment variables in a real application
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUsername = (username) => {
  // Username should be 3-20 characters and contain only letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const validatePassword = (password) => {
  // Check minimum length
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre majuscule";
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre minuscule";
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }

  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Le mot de passe doit contenir au moins un caractère spécial";
  }

  return null; // Password is valid
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Username validation
    if (!validateUsername(username)) {
      return res.status(400).json({
        message:
          "Le nom d'utilisateur doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, chiffres et underscores",
      });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    // Register user
    const newUser = await registerUser(username, email, password);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "Utilisateur enregistré avec succès",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Check for duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      // Check if it's a duplicate username or email
      if (error.message.includes("username")) {
        return res
          .status(409)
          .json({ message: "Ce nom d'utilisateur est déjà pris" });
      } else if (error.message.includes("email")) {
        return res.status(409).json({ message: "Cet email est déjà utilisé" });
      } else {
        return res
          .status(409)
          .json({ message: "Ce nom d'utilisateur ou email existe déjà" });
      }
    }

    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Try to login
    const result = await loginUser(email, password);

    if (!result.success) {
      return res
        .status(401)
        .json({
          message:
            result.message === "User not found"
              ? "Utilisateur non trouvé"
              : "Mot de passe incorrect",
        });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      message: "Connexion réussie",
      user: result.user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Get current user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate username if provided
    if (username && !validateUsername(username)) {
      return res.status(400).json({
        message:
          "Le nom d'utilisateur doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, chiffres et underscores",
      });
    }

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    // Validate password if provided
    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }
    }

    // Update user data
    await updateUser(req.user.id, { username, email, password });

    res.json({ message: "Profil mis à jour avec succès" });
  } catch (error) {
    console.error("Error updating profile:", error);

    // Check for duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("username")) {
        return res
          .status(409)
          .json({ message: "Ce nom d'utilisateur est déjà pris" });
      } else if (error.message.includes("email")) {
        return res.status(409).json({ message: "Cet email est déjà utilisé" });
      } else {
        return res
          .status(409)
          .json({ message: "Ce nom d'utilisateur ou email existe déjà" });
      }
    }

    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du profil" });
  }
});

module.exports = router;
