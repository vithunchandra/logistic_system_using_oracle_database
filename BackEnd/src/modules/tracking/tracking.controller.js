import express from 'express';
import { TrackingProvider } from './tracking.provider.js';

const trackingController = async () => {
    const router = express.Router()
    const trackingProvider = await TrackingProvider.getTrackingProvider()
    
    router.get('/:shipment_id', trackingProvider.getShipmentTrack.bind(trackingProvider))

    return router
}

export {trackingController}