import express from 'express'
import { courierAuthentication } from '../../middleware/authentication.js'
import CourierQueueProvider from './courier_queue.provider.js'

const courierQueueController = async () => {
    const router = express.Router()
    const courierQueueProvider = await CourierQueueProvider.getCourierQueueProvider()

    router.put("/assign/:id", [courierAuthentication], courierQueueProvider.assignCourier.bind(courierQueueProvider))
    router.get("/without-courier", courierQueueProvider.getAllCourierQueuesWithoutCourier.bind(courierQueueProvider))
    router.get("/:id", courierQueueProvider.getCourierQueue.bind(courierQueueProvider))
    router.get("/", courierQueueProvider.getAllCourierQueues.bind(courierQueueProvider))
    router.put('/finish/:id', [courierAuthentication], courierQueueProvider.finishCourierQueue.bind(courierQueueProvider))

    return router
}

export {courierQueueController}