import CourierQueueStatus from "../../constants/courier_queue_status.js"
import TransitStatus from "../../constants/transit_status.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import BranchRepository from "../branch/branch.repository.js"
import CourierQueueRepository from "../courier_queue/courier_queue.repository.js"
import ShipmentQueueRepository from "../shipment_queue/shipment_queue.repository.js"
import { TrackingRepository } from "../tracking/tracking.repository.js"
import ShipmentTransitRepository from "./shipment_transit.repository.js"
import {v4 as uuid4} from 'uuid'

export default class ShipmentTransitProvider{
    static #shipmentTransitProvider = null
    #shipmentTransitRepository = null
    #shipmentQueueRepository = null
    #courierQueueRepository = null
    #trackingRepository = null
    #branchRepository = null
    #connection = null

    constructor(
        shipmentTransitRepository, shipmentQueueRepository, courierQueueRepository, 
        trackingRepository, branchRepository, connection
    ){
        this.#shipmentTransitRepository = shipmentTransitRepository
        this.#shipmentQueueRepository = shipmentQueueRepository
        this.#courierQueueRepository = courierQueueRepository
        this.#trackingRepository = trackingRepository
        this.#branchRepository = branchRepository
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
            await TrackingRepository.getTrackingRepository(),
            await BranchRepository.getBranchRepository(),
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

        const transit = await this.#shipmentTransitRepository.getShipmentTransit({shipment_id})
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
            const branch = await this.#branchRepository.getBranch(transit.next_branch)
            await this.#trackingRepository.createTrack({
                id: null, shipment_id: transit.shipment_id, staff_id: staff.id, 
                message: `Barang sudah sampai pada branch destinasi ${branch.name}`, created_at: new Date()
            })
            if(shipment.destination_branch === transit.next_branch){
                const courierQueue = await this.#courierQueueRepository.createCourierQueue({
                    id: null,
                    shipment_id: shipment.id,
                    courier_id: null,
                    created_at: new Date(),
                    finished_at: null,
                    status: CourierQueueStatus.DELIVERING,
                    updated_at: null
                })
                
                await this.#trackingRepository.createTrack({
                    id: null, shipment_id: transit.shipment_id, staff_id: staff.id, 
                    message: `Barang sudah masuk dalam antrian delivery`, created_at: new Date((new Date()).getTime() + 1)
                })

                await this.#connection.commit()

                return res.status(201).json({transit, courierQueue})
            }else{
                let nextTransit = await this.#shipmentTransitRepository.getNextTransit(transit.id)
                nextTransit = await this.#shipmentTransitRepository.updateTransitStatus(nextTransit.id, TransitStatus.SHIPPING)
                const nextBranch = await this.#branchRepository.getBranch(nextTransit.next_branch)
                await this.#trackingRepository.createTrack({
                    id: null, shipment_id: transit.shipment_id, staff_id: staff.id, 
                    message: `Barang sedang dalam perjalanan transit menuju branch ${nextBranch.name}`, created_at: new Date((new Date()).getTime() + 1)
                })

                await this.#connection.commit()
                
                return res.status(201).json({transit})
            }            
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }
    }
}