import {databaseLowercaseConfig} from '../utils/database_lowercase_config.js'
import { surabayaConfig } from './database_config.js'

import oracledb from 'oracledb'

oracledb.initOracleClient()
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
oracledb.fetchTypeHandler = databaseLowercaseConfig

class DatabaseConnection{
    static #surabayaConnection = null;

    static async getConnection() {
        if(this.#surabayaConnection !== null){
            return this.#surabayaConnection
        }
        this.#surabayaConnection = await oracledb.getConnection(surabayaConfig);
        return this.#surabayaConnection
    }

    static async closeConnection(){
        if(this.#surabayaConnection !== null){
            this.#surabayaConnection.close()
        }
    }
}



export {DatabaseConnection}