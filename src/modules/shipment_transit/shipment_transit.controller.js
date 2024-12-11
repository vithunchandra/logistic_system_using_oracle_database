import express from 'express'
import ShipmentTransitProvider from './shipment_transit.provider.js'

const shipmentTransitController = async () => {
    const router = express.Router()
    const shipmentTransitProvider = await ShipmentTransitProvider.getShipmentTransitProvider()

    router.get("/:shipment_id", shipmentTransitProvider.getShipmentTransit.bind(shipmentTransitProvider))
    
    return router
}

export {shipmentTransitController}