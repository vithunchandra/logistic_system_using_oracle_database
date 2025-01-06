import UserProvider from "./user.provider.js";
import express from 'express';

const userController = async () => {
    const router = express.Router()
    const userProvider = await UserProvider.getUserProvider()
    
    router.post("/auth/signup", userProvider.createUser.bind(userProvider))
    router.post("/auth/signin", userProvider.login.bind(userProvider))
    router.get("/", userProvider.getAllUser.bind(userProvider))
    router.get("/:id", userProvider.getUser.bind(userProvider))
    return router
}

export {userController}