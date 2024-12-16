import UserProvider from "./user.provider.js";
import express from 'express';

const userController = async () => {
    const router = express.Router()
    const userProvider = await UserProvider.getUserProvider()
    
    router.post("/auth/signup", userProvider.createUser.bind(userProvider))
    router.post("/auth/signin", userProvider.login.bind(userProvider))
    return router
}

export {userController}