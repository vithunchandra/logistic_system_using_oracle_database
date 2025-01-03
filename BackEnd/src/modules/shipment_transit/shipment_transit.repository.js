import { DatabaseConnection } from "../../database/database_connection.js"
import {v4 as uuid4} from 'uuid'
import { convertToArray, convertToSingleObject } from "../../utils/database_result_converter.js"

export default class ShipmentTransitRepository{
    static #shipmentTransitRepository = null
    #connection = null
    #conditionKeys = ["shipment_id", "previous_branch", "next_branch", "status"]

    constructor(connection){
        this.#connection = connection
    }

    static async getShipmentTransitRepository(){
        if(this.#shipmentTransitRepository !== null){
            return this.#shipmentTransitRepository
        }
        this.#shipmentTransitRepository = new ShipmentTransitRepository(await DatabaseConnection.getConnection())
        return this.#shipmentTransitRepository
    }

    async createShipmentTransit(transitRoute, shipment_id){
        const sql = `INSERT INTO shipment_transits VALUES(
            :id, :shipment_id, :previous_branch, :next_branch, :status, :updated_at
        )`
        const binds = transitRoute.map(row => ({
            id: null,
            shipment_id: shipment_id,
            previous_branch: row.previous_branch,
            next_branch: row.next_branch,
            status: row.status,
            updated_at: null
        }))
        await this.#connection.executeMany(sql, binds)
        return this.getShipmentTransitByShipmentId(shipment_id)
    }

    async getShipmentTransit(condition){
        let sql = `
            SELECT 
                st.id AS id,
                sq.item_name AS item_name,
                sq.weight AS weight,
                b1.name AS previous_branch,
                b2.name AS next_branch, 
                st.status AS status
            FROM shipment_transits st 
            JOIN branches b1 ON st.previous_branch = b1.id
            JOIN branches b2 ON st.next_branch = b2.id
            JOIN shipment_queues sq ON st.shipment_id = sq.id
        `
        let bind = {}
        let isWhereExists = false
        let isAnotherCondition = false 
        
        for(const key of this.#conditionKeys){
            let conditionValue = condition[key]
            if(!conditionValue) continue
            
            if(!isWhereExists){
                sql += " WHERE"
                isWhereExists = true
            }
            if(isAnotherCondition){
                sql += " AND"
            } else isAnotherCondition = true
            sql += ` st.${key} = :${key}\n`
            bind[key] = conditionValue
        }
        console.log(sql, bind)
        const result = await this.#connection.execute(sql, bind)
        return convertToArray(result.rows)
    }

    async getShipmentTransitByBranch(branch_id){
        const result = await this.#connection.execute(
            "SELECT * FROM shipment_transits WHERE branch_id = :branch_id",
            {branch_id}
        )
        return convertToArray(result.rows)
    }

    async getShipmentTransitByShipmentId(shipment_id){
        const result = await this.#connection.execute(
            "SELECT * FROM shipment_transits WHERE shipment_id = :shipment_id",
            {shipment_id}
        )
        return convertToArray(result.rows)
    }

    async getTransit(transit_id){
        const result = await this.#connection.execute(
            "SELECT * FROM shipment_transits WHERE id = :transit_id",
            {transit_id}
        )
        return convertToSingleObject(result.rows)
    }

    async getNextTransit(previous_transit_id){
        const previousTransit = await this.getTransit(previous_transit_id)
        const sql = `
            SELECT * FROM shipment_transits
            WHERE 
                shipment_id = :shipment_id AND
                previous_branch = :previous_branch
        `
        const nextTransit = await this.#connection.execute(
            sql,
            {
                shipment_id: previousTransit.shipment_id,
                previous_branch: previousTransit.next_branch
            } 
        )

        return convertToSingleObject(nextTransit.rows)
    }

    async getPreviousTransit(next_transit_id){
        const nextTransit = await this.getTransit(next_transit_id)
        const sql = `
            SELECT * FROM shipment_transits
            WHERE 
                shipment_id = :shipment_id AND
                next_branch = :next_branch
        `
        const previousTransit = await this.#connection.execute(
            sql,
            {
                shipment_id: nextTransit.shipment_id,
                next_branch: nextTransit.previous_branch
            } 
        )

        return convertToSingleObject(previousTransit.rows)
    }

    async updateTransitStatus(id, status){
        const result = await this.#connection.execute(
            "UPDATE shipment_transits SET status = :status WHERE id = :id",
            {id, status}
        )
        const transit = await this.getLastRow(result.lastRowid)
        return convertToSingleObject(transit.rows)
    }

    async getLastRow(id){
        return await this.#connection.execute(
            "SELECT * FROM shipment_transits WHERE ROWID = :id",
            {id}
        )
    }
}