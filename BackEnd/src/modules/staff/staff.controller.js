import express from 'express';
import { StaffProvider } from './staff.provider.js';

const staffController = async () => {
    const router = express.Router()
    const staffProvider = await StaffProvider.getStaffProvider()
    
    router.post('/create', staffProvider.createStaff.bind(staffProvider))
    router.post('/login', staffProvider.login.bind(staffProvider))

    return router
}

export {staffController}