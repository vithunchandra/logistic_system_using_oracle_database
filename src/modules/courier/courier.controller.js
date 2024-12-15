import express from 'express'
import CourierProvider from './courier.provider.js'

const courierController = async () => {
    const router = express.Router()
    const courierProvider = await CourierProvider.getCourierProvider()

    router.post("/create", courierProvider.createCourier.bind(courierProvider))
    router.post("/login", courierProvider.login.bind(courierProvider))

    return router
}

export {courierController}