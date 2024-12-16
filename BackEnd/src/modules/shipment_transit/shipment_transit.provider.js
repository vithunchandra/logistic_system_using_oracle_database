import CourierQueueStatus from "../../constants/courier_queue_status.js"
import TransitStatus from "../../constants/transit_status.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import CourierQueueRepository from "../courier_queue/courier_queue.repository.js"
import ShipmentQueueRepository from "../shipment_queue/shipment_queue.repository.js"
import ShipmentTransitRepository from "./shipment_transit.repository.js"
import {v4 as uuid4} from 'uuid'

export default class ShipmentTransitProvider{
    static #shipmentTransitProvider = null
    #shipmentTransitRepository = null
    #shipmentQueueRepository = null
    #courierQueueRepository = null
    #connection = null

    constructor(shipmentTransitRepository, shipmentQueueRepository, courierQueueRepository, connection){
        this.#shipmentTransitRepository = shipmentTransitRepository
        this.#shipmentQueueRepository = shipmentQueueRepository
        this.#courierQueueRepository = courierQueueRepository
        this.#connection = connection
    }

    static async getShipmentTransitProvider(){
        if(this.#shipmentTransitProvider !== null){
            return this.#shipmentTransitProvider
        }
        this.#shipmentTransitProvider = new ShipmentTransitProvider(
            await ShipmentTransitRepository.getShipmentTransitRepository(),
            await ShipmentQueueRepository.getShipmentQueueRepository(),
            await CourierQueueRepository.getCourierQueueRepository(),
            await DatabaseConnection.getConnection() 
        )
        return this.#shipmentTransitProvider
    }

    async getShipmentTransit(req, res){
        const {shipment_id} = req.query
        const shipment = await this.#shipmentQueueRepository.getShipment(shipment_id)
        if(!shipment){
            return res.status(404).json({message: "Data pengiriman tidak ditemukan"})
        }

        const transit = await this.#shipmentTransitRepository.getShipmentTransit(req.query)
        return res.status(200).json({transit})
    }

    async finishTransit(req, res){
        const {transit_id} = req.params
        const staff = req.staff
        let transit = await this.#shipmentTransitRepository.getTransit(transit_id)

        if(!transit){
            return res.status(401).json({message: "Data transit tidak ditemukan"})
        }
        if(transit.status === TransitStatus.ARRIVED){
            return res.status(401).json({message: "Barang sudah sampai"})
        }
        if(transit.next_branch !== staff.branch_id){
            return res.status(401).json({message: "Staff bukan berasal dari branch tujuan transit"})
        }
    
        let shipment = await this.#shipmentQueueRepository.getShipment(transit.shipment_id)

        if(shipment.origin_branch !== transit.previous_branch){
            const previous_transit = await this.#shipmentTransitRepository.getPreviousTransit(transit.id)
            console.log(previous_transit)
            if(previous_transit.status !== TransitStatus.ARRIVED){
                return res.status(401).json({message: "Invalid transit route"})
            }
        }

        try{
            transit = await this.#shipmentTransitRepository.updateTransitStatus(transit.id, TransitStatus.ARRIVED)
            if(shipment.destination_branch === transit.next_branch){
                const courierQueue = await this.#courierQueueRepository.createCourierQueue({
                    id: uuid4(),
                    shipment_id: shipment.id,
                    courier_id: null,
                    created_at: new Date(),
                    finished_at: null,
                    status: CourierQueueStatus.DELIVERING
                })
                await this.#connection.commit()

                return res.status(201).json({transit, courierQueue})
            }else{
                let nextTransit = await  this.#shipmentTransitRepository.getNextTransit(transit.id)
                nextTransit = await this.#shipmentTransitRepository.updateTransitStatus(nextTransit.id, TransitStatus.SHIPPING)
                await this.#connection.commit()
                
                return res.status(201).json({transit})
            }            
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }
    }
}