import { DatabaseConnection } from "../../database/database_connection.js"
import ShipmentQueueRepository from "../shipment_queue/shipment_queue.repository.js"
import ShipmentTransitRepository from "./shipment_transit.repository.js"

export default class ShipmentTransitProvider{
    static #shipmentTransitProvider = null
    #shipmentTransitRepository = null
    #shipmentQueueRepository = null
    #connection = null

    constructor(shipmentTransitRepository, shipmentQueueRepository, connection){
        this.#shipmentTransitRepository = shipmentTransitRepository
        this.#shipmentQueueRepository = shipmentQueueRepository
        this.#connection = connection
    }

    static async getShipmentTransitProvider(){
        if(this.#shipmentTransitProvider !== null){
            return this.#shipmentTransitProvider
        }
        this.#shipmentTransitProvider = new ShipmentTransitProvider(
            await ShipmentTransitRepository.getShipmentTransitRepository(),
            await ShipmentQueueRepository.getShipmentQueueRepository(),
            await DatabaseConnection.getConnection() 
        )
        return this.#shipmentTransitProvider
    }

    async getShipmentTransit(req, res){
        const {shipment_id} = req.params
        const shipment = await this.#shipmentQueueRepository.getShipment(shipment_id)
        if(!shipment){
            return res.status(404).json({message: "Data pengiriman tidak ditemukan"})
        }

        const transit = await this.#shipmentTransitRepository.getShipmentTransit(shipment_id)
        return res.status(200).json({
            data: transit
        })
    }
}