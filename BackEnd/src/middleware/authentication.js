import jwt from "jsonwebtoken";
import { UserRepository } from "../modules/user/user.repository.js";
import StaffRepository from "../modules/staff/staff.repository.js";
import CourierRepository from "../modules/courier/courier.repository.js";

async function userAuthentication(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  // Slight change because 'bearer' is 'Bearer' on postman
  // based on chatGPT.
  const splitToken = token.split(" ");
  if (splitToken.length < 2) {
    return res.status(401).json({ message: "Token invalid" });
  }

  const jwtToken = splitToken[1];
  if (!jwtToken) {
    return res.status(401).json({ message: "JWT token required" });
  }

  let user;
  try {
    user = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET)["user"];
  } catch (err) {
    return res.status(401).json({ message: "JWT token is invalid" });
  }

  const userRepository = await UserRepository.getRepository();
  // adding await
  user = await userRepository.findOneByEmail(user.email);
  // should not be possible, but to verify again...
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = user;
  next();
}

async function staffAuthentication(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  // Slight change because 'bearer' is 'Bearer' on postman
  // based on chatGPT.
  const splitToken = token.split(" ");
  if (splitToken.length < 2) {
    return res.status(401).json({ message: "Token invalid" });
  }

  const jwtToken = splitToken[1];
  if (!jwtToken) {
    return res.status(401).json({ message: "JWT token required" });
  }

  let staff;
  try {
    staff = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET)["staff"];
  } catch (err) {
    return res.status(401).json({ message: "JWT token is invalid" });
  }

  const staffRepository = await StaffRepository.getStaffRepository();
  // adding await
  staff = await staffRepository.findOneByEmail(staff.email);
  // should not be possible, but to verify again...
  if (!staff) {
    return res.status(404).json({ message: "Staff not found" });
  }

  req.staff = staff;
  next();
}

async function courierAuthentication(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  // Slight change because 'bearer' is 'Bearer' on postman
  // based on chatGPT.
  const splitToken = token.split(" ");
  if (splitToken.length < 2) {
    return res.status(401).json({ message: "Token invalid" });
  }

  const jwtToken = splitToken[1];
  if (!jwtToken) {
    return res.status(401).json({ message: "JWT token required" });
  }

  let courier;
  try {
    courier = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET)["courier"];
  } catch (err) {
    return res.status(401).json({ message: "JWT token is invalid" });
  }

  const courierRepository = await CourierRepository.getCourierRepository();
  // adding await
  courier = await courierRepository.findOneByEmail(courier.email);
  // should not be possible, but to verify again...
  if (!courier) {
    return res.status(404).json({ message: "Courier not found" });
  }

  req.courier = courier;
  next();
}

export {userAuthentication, staffAuthentication, courierAuthentication}