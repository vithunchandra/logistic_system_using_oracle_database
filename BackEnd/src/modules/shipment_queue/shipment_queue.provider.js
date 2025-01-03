import { v4 as uuid4 } from "uuid"
import PaymentRepository from "../payment/payment.repository.js"
import ShipmentQueueRepository from "./shipment_queue.repository.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import ShipmentTransitRepository from "../shipment_transit/shipment_transit.repository.js"
import { transitRoute } from "../../utils/transit_route.js"
import ShipmentStatus from "../../constants/shipment_status.js"
import TransitStatus from "../../constants/transit_status.js"

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

        const staff = req.staff
            
        if(parseInt(origin_branch) !== staff.branch_id){
            return res.status(401).json({message: "Staff bukan berasal dari branch tujuan transit"})
        }

        try{
            const payment = await this.#paymentRepository.createPayment({
                id: null, user_id: owner_id, staff_id: 
                staff.id, gross_amount: parseInt(gross_amount), 
                created_at: new Date(), updated_at: null
            })

            const shipmentQueue = await this.#shipmentQueueRepository.createShipmentQueue({
                id: null,
                owner_id,
                receiver_name,
                origin_branch: parseInt(origin_branch),
                destination_branch: parseInt(destination_branch),
                payment_id: payment.id,
                item_name,
                weight: parseInt(weight),
                address,
                created_at: new Date(),
                finished_at: null,
                status: ShipmentStatus.SHIPPING,
                updated_at: null
            })

            const route = transitRoute[origin_branch][destination_branch]
            const routeData = []
            for(let i=0; i<route.length; i++){
                routeData.push({
                    previous_branch: i === 0 ? parseInt(origin_branch) : route[i - 1],
                    next_branch: route[i],
                    status: i === 0 ? TransitStatus.SHIPPING : TransitStatus.PENDING
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
        
        return res.status(200).json({shipment: {...shipment, transit}})
    }

    async getAllShipments(req, res){
        const {origin_id, destination_id, status, order_by} = req.query
        let shipments = await this.#shipmentQueueRepository.getAllShipments(origin_id, destination_id, status, order_by)
        shipments = await Promise.all(
            shipments.map( async shipment => {
                const transit = await this.#shipmentTransitRepository.getShipmentTransit(shipment.id)
                return {
                    ...shipment, transit
                }
            })
        )
        return res.status(200).json({shipments})
    }

    async getShipmentByOwnerId(req, res){
        const {owner_id} = req.query
        console.log("hallo")
        let shipments = await this.#shipmentQueueRepository.getShipmentByOwnerId(owner_id)
        shipments = await Promise.all(
            shipments.map( async shipment => {
                const transit = await this.#shipmentTransitRepository.getShipmentTransit(shipment.id)
                return {
                    ...shipment, transit
                }
            })
        )
        return res.status(200).json({shipments})
    }
}