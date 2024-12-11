import express from 'express';
import ShipmentQueueProvider from './shipment_queue.provider.js';
import { staffAuthentication } from '../../middleware/authentication.js';

const shipmentQueueController = async () => {
    const router = express.Router();
    const shipmentQueueProvider = await ShipmentQueueProvider.getShipmentQueueProvider()
    
    router.post("/create", [staffAuthentication], shipmentQueueProvider.createShipmentQueue.bind(shipmentQueueProvider))
    router.get("/:shipment_id", shipmentQueueProvider.getShipment.bind(shipmentQueueProvider))
    
    return router
}

export {shipmentQueueController}