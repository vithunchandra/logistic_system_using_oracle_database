import ShipmentStatus from "../../constants/shipment_status.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToArray, convertToSingleObject } from "../../utils/database_result_converter.js"

export default class ShipmentQueueRepository{
    static #shipmentQueueRepository = null
    #selectStatement = `
        SELECT 
            sq.id AS id, sq.owner_id AS owner_id,
            sq.origin_branch AS origin_id, 
            sq.destination_branch AS destination_id, 
            us.name AS owner, og.name as origin_branch,
            de.name AS destination_branch, sq.item_name AS item_name,
            sq.status AS status, sq.receiver_name AS receiver,
            sq.weight AS weight, sq.address AS address,
            sq.created_at AS created_at, sq.finished_at AS finished_at
        FROM shipment_queues sq JOIN 
        users us ON sq.owner_id = us.id JOIN
        branches og ON sq.origin_branch = og.id JOIN
        branches de ON sq.destination_branch = de.id
    `
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
            :id, :owner_id, :receiver_name, :origin_branch,:destination_branch, 
            :payment_id, :item_name, :weight, :address, :created_at, :finished_at, 
            :status, :updated_at
        )`
        const result = await this.#connection.execute(
            sql,
            {...shipmentQueueData}
        )
        const shipmentQueue = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(shipmentQueue.rows)
    }

    async updateShipmentQueueStatus(id, status){
        let sql = `UPDATE shipment_queues SET status = :status`
        let bind = {id, status}

        if(status === ShipmentStatus.ARRIVED){
            sql += `, finished_at = :finished_at`
            bind = {...bind, finished_at: new Date()}
        }
        sql += ` WHERE id = :id`

        const result = await this.#connection.execute(sql, bind)
        const shipment = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(shipment.rows)
    }

    async getShipment(shipment_id){
        const result = await this.#connection.execute(
            "SELECT * FROM shipment_queues WHERE id = :shipment_id",
            {shipment_id}
        )
        return convertToSingleObject(result.rows)
    }

    async getAllShipments(origin_id, destination_id, status, order_by){
        let sql = this.#selectStatement
        let bind = {}
        let isAnotherCondition = false
        if(origin_id || destination_id || status){
            sql += " WHERE"
        }
        if(origin_id){
            sql += " sq.origin_branch = :origin_id"
            bind = {...bind, origin_id}
            isAnotherCondition = true
        }
        if(destination_id){
            if(isAnotherCondition) sql += " AND"
            sql += " sq.destination_branch = :destination_id"
            bind = {...bind, destination_id}
        }
        if(status){
            if(isAnotherCondition) sql += " AND"
            sql += " status = :status"
            bind = {...bind, status}
        }
        if(order_by){
            sql += `ORDER BY created_at ${order_by}`
        }

        const result = await this.#connection.execute(sql, bind)
        return convertToArray(result.rows)
    }

    async getShipmentByOwnerId(owner_id){
        let sql = `${this.#selectStatement} WHERE sq.owner_id = :owner_id`
        console.log(sql)
        const result = await this.#connection.execute(
            sql,
            {owner_id}
        )
        return convertToArray(result.rows)
    }

    async getLastRow(id){
        return await this.#connection.execute(
            `SELECT * FROM shipment_queues WHERE ROWID = :id`,
            {id}
        )
    }
}