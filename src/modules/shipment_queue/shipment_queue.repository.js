import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToSingleObject } from "../../utils/database_result_converter.js"

export default class ShipmentQueueRepository{
    static #shipmentQueueRepository = null
    #connection = null

    constructor(connection){
        this.#connection = connection
    }

    static async getShipmentQueueRepository(){
        if(this.#shipmentQueueRepository !== null){
            return this.#shipmentQueueRepository
        }
        this.#shipmentQueueRepository = new ShipmentQueueRepository(await DatabaseConnection.getConnection())
        return this.#shipmentQueueRepository
    }

    async createShipmentQueue(shipmentQueueData){
        const sql = `INSERT INTO shipment_queues VALUES(
            :id, :owner_id, :origin_branch,:destination_branch, 
            :item_name, :weight, :address, :created_at, :finished_at, 
            :status, :receiver_name
        )`
        const result = await this.#connection.execute(
            sql,
            {...shipmentQueueData}
        )
        const shipmentQueue = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(shipmentQueue.rows)
    }

    async getShipment(shipment_id){
        console.log(shipment_id)
        const result = await this.#connection.execute(
            "SELECT * FROM shipment_queues WHERE id = :shipment_id",
            {shipment_id}
        )
        return convertToSingleObject(result.rows)
    }

    async getLastRow(id){
        return await this.#connection.execute(
            `SELECT * FROM shipment_queues WHERE ROWID = :id`,
            {id}
        )
    }
}