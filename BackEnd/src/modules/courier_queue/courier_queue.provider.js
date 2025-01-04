import CourierQueueStatus from "../../constants/courier_queue_status.js"
import ShipmentStatus from "../../constants/shipment_status.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import BranchRepository from "../branch/branch.repository.js"
import ShipmentQueueRepository from "../shipment_queue/shipment_queue.repository.js"
import { TrackingRepository } from "../tracking/tracking.repository.js"
import CourierQueueRepository from "./courier_queue.repository.js"

export default class CourierQueueProvider{
    static #courierQueueProvider = null
    #courierQueueRepository = null
    #shipmentQueueRepository = null
    #trackingRepository = null
    #branchRepository = null
    #connection = null

    constructor(
        courierQueueRepository, shipmentQueueRepository,
        trackingRepository, branchRepository,
        connection
    ){
        this.#courierQueueRepository = courierQueueRepository
        this.#shipmentQueueRepository = shipmentQueueRepository
        this.#trackingRepository = trackingRepository
        this.#branchRepository = branchRepository
        this.#connection = connection
    }

    static async getCourierQueueProvider(){
        if(this.#courierQueueProvider !== null){
            return this.#courierQueueProvider
        }
        this.#courierQueueProvider = new CourierQueueProvider(
            await CourierQueueRepository.getCourierQueueRepository(),
            await ShipmentQueueRepository.getShipmentQueueRepository(),
            await TrackingRepository.getTrackingRepository(),
            await BranchRepository.getBranchRepository(),
            await DatabaseConnection.getConnection()
        )
        return this.#courierQueueProvider
    }

    async getCourierQueue(req, res){
        const {id} = req.params
        const courierQueue = await this.#courierQueueRepository.getCourierQueue(id)
        return res.status(200).json({courierQueue})
    }

    async getAllCourierQueuesWithoutCourier(req, res){
        const result = await this.#courierQueueRepository.getAllCourierQueuesWithoutCourier()
        return res.status(200).json({courierQueues: result})
    }

    async getAllCourierQueues(req, res){
        const {courier_id, status} = req.query
        const result = await this.#courierQueueRepository.getAllCourierQueues(courier_id, status)
        return res.status(200).json({courierQueues: result})
    }

    async assignCourier(req, res){
        const {id} = req.params
        const courier = req.courier
        let courierQueue = await this.#courierQueueRepository.getCourierQueue(id)
        console.log(courierQueue)
        if(!courierQueue){
            return res.status(404).json({message: "Courier queue data tidak ditemukan"})
        }
        if(courier.branch_id !== courierQueue.branch_id){
            return res.status(401).json({message: "Courier queue branch berbeda dengan branch dari courier"})
        }
        if(courierQueue.courier_id != null){
            return res.status(404).json({message: "Courier queue sudah mempunyai kurir"})
        }
        try{
            courierQueue = await this.#courierQueueRepository.assignCourier(id, courier.id)
            await this.#trackingRepository.createTrack({
                id: null, shipment_id: courierQueue.shipment_id, staff_id: null, 
                message: `Barang sedang diantar oleh courier ke tujuan`, created_at: new Date()
            })
            await this.#connection.commit()
            return res.status(201).json({courierQueue})
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }
    }

    async finishCourierQueue(req, res){
        const {id} = req.params
        const courier = req.courier
        let courierQueue = await this.#courierQueueRepository.getCourierQueue(id)

        if(!courierQueue){
            return res.status(404).json({message: "Courier queue data tidak dapat ditemukan"})
        }
        if(courier.id !== courierQueue.courier_id){
            return res.status(401).json({message: "Courier invalid"})
        }
        if(courier.branch_id !== courierQueue.branch_id){
            return res.status(401).json({message: "Courier queue branch berbeda dengan branch dari courier"})
        }
        if(courierQueue.status === CourierQueueStatus.ARRIVED){
            return res.status(401).json({message: "Courier queue sudah selesai diantar"})
        }
        try{
            courierQueue = await this.#courierQueueRepository.updateCourierQueueStatus(id, CourierQueueStatus.ARRIVED)
            const shipment = await this.#shipmentQueueRepository.updateShipmentQueueStatus(courierQueue.shipment_id, ShipmentStatus.ARRIVED)
            await this.#trackingRepository.createTrack({
                id: null, shipment_id: shipment.id, staff_id: null, 
                message: `Barang telah sampai pada tujuan`, created_at: new Date()
            })
            await this.#connection.commit()
            return res.status(201).json({courierQueue})
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }
    }
}