import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.js';

// Built on first use so it picks up the env vars regardless of import order.
let googleClient;
const getGoogleClient = () =>
  (googleClient ??= new OAuth2Client(process.env.GOOGLE_CLIENT_ID));

const TOKEN_EXPIRY = '1h';

const issueToken = (user) =>
  jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = issueToken(existingUser);

    res.status(200).json({ result: existingUser.toJSON(), token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName)
      return res.status(400).json({ message: 'All fields are required.' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match." });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = issueToken(result);

    res.status(201).json({ result: result.toJSON(), token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

// Exchanges a Google ID token for an app token. The credential is verified
// against Google's keys so a forged token can't impersonate a user.
export const googleSignIn = async (req, res) => {
  const { credential } = req.body;

  try {
    if (!credential) return res.status(400).json({ message: 'Missing Google credential.' });

    const ticket = await getGoogleClient().verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, email_verified: emailVerified } = ticket.getPayload();

    if (!emailVerified)
      return res.status(401).json({ message: 'Google account email is not verified.' });

    let user = await User.findOne({ email });

    if (!user) {
      // Google users never sign in with a password; store an unusable random one
      // so the required field is satisfied and password sign-in can't succeed.
      const placeholder = await bcrypt.hash(crypto.randomUUID(), 12);
      user = await User.create({ email, name, password: placeholder });
    }

    const token = issueToken(user);

    res.status(200).json({ result: { ...user.toJSON(), imageUrl: picture }, token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Google sign in failed.' });
  }
};
