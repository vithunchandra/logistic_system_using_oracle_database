import { v4 as uuid4 } from "uuid"
import PaymentRepository from "../payment/payment.repository.js"
import ShipmentQueueRepository from "./shipment_queue.repository.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import ShipmentTransitRepository from "../shipment_transit/shipment_transit.repository.js"
import { transitRoute } from "../../utils/transit_route.js"

export default class ShipmentQueueProvider{
    static #shipmentQueueProvider = null
    #paymentRepository = null
    #shipmentQueueRepository = null
    #shipmentTransitRepository = null
    #connection = null

    constructor(paymentRepository, shipmentQueueRepository, shipmentTransitRepository, connection){
        this.#paymentRepository = paymentRepository
        this.#shipmentQueueRepository = shipmentQueueRepository
        this.#shipmentTransitRepository = shipmentTransitRepository
        this.#connection = connection
    }

    static async getShipmentQueueProvider(){
        if(this.#shipmentQueueProvider !== null){
            return this.#shipmentQueueProvider
        }
        this.#shipmentQueueProvider = new ShipmentQueueProvider(
            await PaymentRepository.getPaymentRepository(),
            await ShipmentQueueRepository.getShipmentQueueRepository(),
            await ShipmentTransitRepository.getShipmentTransitRepository(),
            await DatabaseConnection.getConnection()
        )
        return this.#shipmentQueueProvider
    }

    async createShipmentQueue(req, res){
        const {
            owner_id, receiver_name, origin_branch, destination_branch,
            item_name, weight, address, gross_amount
        } = req.body

        if(
            !receiver_name || !origin_branch || !destination_branch ||
            !item_name || !weight || !address || !gross_amount || !owner_id
        ){
            return res.status(401).json({message: "Semua field wajib diisi"})
        }

        try{
            const staff = req.staff

            const payment = await this.#paymentRepository.createPayment({
                id: uuid4(), user_id: owner_id, staff_id: staff.id, gross_amount: parseInt(gross_amount), created_at: new Date()
            })

            const shipmentQueue = await this.#shipmentQueueRepository.createShipmentQueue({
                id: uuid4(),
                owner_id,
                receiver_name,
                origin_branch: parseInt(origin_branch),
                destination_branch: parseInt(destination_branch),
                item_name,
                weight: parseInt(weight),
                address,
                created_at: new Date(),
                finished_at: null,
                status: "Shipping"
            })

            const route = transitRoute[origin_branch][destination_branch]
            const routeData = []
            for(let i=0; i<route.length; i++){
                routeData.push({
                    previous_branch: i === 0 ? parseInt(origin_branch) : route[i - 1],
                    next_branch: route[i]
                })
            }
            const transit = await this.#shipmentTransitRepository.createShipmentTransit(routeData, shipmentQueue.id)
            
            await this.#connection.commit()

            return res.status(201).json({
                shipment: {...shipmentQueue, transit},
                payment: payment
            })
        }catch(error){
            await this.#connection.rollback()
            return res.status(500).json({message: error.toString(), stacktrace: error.stack})
        }
    }

    async getShipment(req, res){
        const {shipment_id} = req.params
        const shipment = await this.#shipmentQueueRepository.getShipment(shipment_id)
        const transit = await this.#shipmentTransitRepository.getShipmentTransit(shipment_id)
        
        return res.status(200).json({data: {...shipment, transit}})
    }
}