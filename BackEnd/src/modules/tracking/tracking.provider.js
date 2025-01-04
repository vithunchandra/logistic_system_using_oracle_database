import { DatabaseConnection } from "../../database/database_connection.js"
import { TrackingRepository } from "./tracking.repository.js"

export class TrackingProvider{
    static #trackingProvider = null
    #trackingRepository = null
    #connection = null

    constructor(trackingRepository, connection){
        this.#trackingRepository = trackingRepository
        this.#connection = connection
    }

    static async getTrackingProvider(){
        if(this.#trackingProvider !== null){
            return this.#trackingProvider
        }
        this.#trackingProvider = new TrackingProvider(
            await TrackingRepository.getTrackingRepository(),
            await DatabaseConnection.getConnection()
        )
        return this.#trackingProvider
    }

    async getShipmentTrack(req, res){
        console.log('getShipmentTrack')
        const {shipment_id} = req.params
        try{
            const tracks = await this.#trackingRepository.getShipmentTrack(shipment_id)
            console.log(tracks)
            return res.status(200).json({tracks})
        }catch(error){
            return res.status(500).json({message: error.message})
        }
    }
}