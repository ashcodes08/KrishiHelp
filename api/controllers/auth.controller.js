import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  // Hash the password before saving
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Set isFarmer based on the role
  const isFarmerOrNot = role === "Farmer";

  // Create a new user with the provided data
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isFarmer: isFarmerOrNot,
  });

  try {
    // Save the user to the database
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check if all required fields are provided
  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    // Check if the role matches the user's role
    if (role === "farmer" && !validUser.isFarmer) {
      return next(errorHandler(403, "User is not a farmer"));
    } else if (role !== "farmer" && validUser.isFarmer) {
      return next(errorHandler(403, "User is not a distributor"));
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: validUser._id,
        isFarmer: validUser.isFarmer
      },
      process.env.JWT_SECRET
    );

    // Remove password from the response
    const loggedInUser = await User.findById(validUser._id).select("-password");

    // Set the cookie with the token and send response
    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(loggedInUser);

  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Generate a token if the user already exists
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    } else {
      // Generate a random password
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // Hash the generated password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Create a new user
      const isFarmerOrNot = role === "Farmer";
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isFarmer: isFarmerOrNot,
      });

      // Save the new user
      await newUser.save();

      // Generate a token for the new user
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
