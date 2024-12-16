import CourierQueueStatus from "../../constants/courier_queue_status.js"
import ShipmentStatus from "../../constants/shipment_status.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import ShipmentQueueRepository from "../shipment_queue/shipment_queue.repository.js"
import CourierQueueRepository from "./courier_queue.repository.js"

export default class CourierQueueProvider{
    static #courierQueueProvider = null
    #courierQueueRepository = null
    #shipmentQueueRepository = null
    #connection = null

    constructor(
        courierQueueRepository,
        shipmentQueueRepository,
        connection
    ){
        this.#courierQueueRepository = courierQueueRepository
        this.#shipmentQueueRepository = shipmentQueueRepository
        this.#connection = connection
    }

    static async getCourierQueueProvider(){
        if(this.#courierQueueProvider !== null){
            return this.#courierQueueProvider
        }
        this.#courierQueueProvider = new CourierQueueProvider(
            await CourierQueueRepository.getCourierQueueRepository(),
            await ShipmentQueueRepository.getShipmentQueueRepository(),
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
            console.log(shipment)
            await this.#connection.commit()
            return res.status(201).json({courierQueue})
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.message, stacktrace: error.stack})
        }
    }
}