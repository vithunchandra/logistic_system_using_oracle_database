import CourierQueueStatus from "../../constants/courier_queue_status.js"
import { DatabaseConnection } from "../../database/database_connection.js"
import { convertToArray, convertToSingleObject } from "../../utils/database_result_converter.js"

export default class CourierQueueRepository{
    static #courierQueueRepository = null
    #connection = null
    #selectStatement = `
        SELECT
            cq.id AS id, cq.shipment_id AS shipment_id,
            sq.owner_id, ow.name AS owner, sq.receiver_name AS receiver,
            cq.courier_id AS courier_id, co.name AS courier,
            sq.destination_branch AS branch_id, br.name AS branch,
            sq.item_name AS item_name, sq.weight AS weight, 
            sq.address AS address, cq.status AS status
        FROM courier_queues cq LEFT JOIN
        shipment_queues sq ON cq.shipment_id = sq.id LEFT JOIN
        branches br ON sq.destination_branch = br.id LEFT JOIN
        couriers co ON cq.courier_id = co.id LEFT JOIN
        users ow ON sq.owner_id = ow.id
    `

    constructor(connection){
        this.#connection = connection
    }

    static async getCourierQueueRepository(){
        if(this.#courierQueueRepository !== null){
            return this.#courierQueueRepository
        }
        this.#courierQueueRepository = new CourierQueueRepository(await DatabaseConnection.getConnection())
        return this.#courierQueueRepository
    }

    async createCourierQueue(courierQueueData){
        const result = await this.#connection.execute(
            `
                INSERT INTO courier_queues VALUES(
                    :id, :shipment_id, :courier_id, 
                    :created_at, :finished_at, :status, 
                    :updated_at
                )
            `,
            {...courierQueueData}
        )
        const courierQueue = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(courierQueue.rows)
    }

    async assignCourier(id, courier_id){
        const result = await this.#connection.execute(
            `UPDATE courier_queues SET courier_id = :courier_id WHERE id = :id`,
            {id, courier_id}
        )
        const courierQueue = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(courierQueue.rows)
    }

    async updateCourierQueueStatus(id, status){
        let sql = `UPDATE courier_queues SET status = :status`
        let bind = {id, status}

        if(status === CourierQueueStatus.ARRIVED){
            sql += ", finished_at = :finished_at"
            bind = {...bind, finished_at: new Date()}
        }
        sql += " WHERE id = :id"
        
        const result = await this.#connection.execute(sql, bind)
        const courierQueue = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(courierQueue.rows)
    }

    async getAllCourierQueuesWithoutCourier(branch_id){
        const sql = `
            ${this.#selectStatement}
            WHERE cq.courier_id IS null AND sq.destination_branch = :branch_id
        `
        console.log(sql)
        const result = await this.#connection.execute(sql, {branch_id})
        return convertToArray(result.rows)
    }

    async getCourierQueue(id){
        const sql = `
            ${this.#selectStatement}
            WHERE cq.id = :id
        `
        const result = await this.#connection.execute(sql, {id})
        return convertToSingleObject(result.rows)
    }

    async getAllCourierQueues(courier_id, status){
        let sql = this.#selectStatement
        let bind = {}
        let isAnotherCondition = false
        if(courier_id || status) sql += "\nWHERE "
        if(courier_id){
            sql += " cq.courier_id = :courier_id"
            bind = {...bind, courier_id}
            isAnotherCondition = true
        }
        if(status){
            if(isAnotherCondition) sql += " AND"
            bind = {...bind, status}
            sql += " cq.status = :status"
        }

        const result = await this.#connection.execute(sql, bind)
        return convertToArray(result.rows)
    }

    async getCourierCourierQueues(id, courier_id){
        const sql = `
            ${this.#selectStatement}
            WHERE cq.id = :id, cq.courier_id = :courier_id
        `
        const result = await this.#connection.execute(sql, {id, courier_id})
        return convertToSingleObject(result.rows)
    }

    async getLastRow(id){
        return await this.#connection.execute(
            "SELECT * FROM courier_queues WHERE ROWID = :id",
            {id}
        )
    }
}