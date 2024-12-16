import express from 'express'
import ShipmentTransitProvider from './shipment_transit.provider.js'
import { staffAuthentication } from '../../middleware/authentication.js'

const shipmentTransitController = async () => {
    const router = express.Router()
    const shipmentTransitProvider = await ShipmentTransitProvider.getShipmentTransitProvider()

    router.get("/", shipmentTransitProvider.getShipmentTransit.bind(shipmentTransitProvider))
    router.put("/finish/:transit_id", [staffAuthentication], shipmentTransitProvider.finishTransit.bind(shipmentTransitProvider))
    
    return router
}

export {shipmentTransitController}