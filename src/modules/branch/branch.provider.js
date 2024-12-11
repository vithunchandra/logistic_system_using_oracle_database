import { DatabaseConnection } from "../../database/database_connection.js"
import BranchRepository from "./branch.repository.js"

export default class BranchProvider{
    static #branchProvider = null
    #branchRepository = null
    #connection = null

    constructor(branchRepository, connection){
        this.#branchRepository = branchRepository
        this.#connection = connection
    }

    static async getBranchProvider(){
        if(this.#branchProvider !== null){
            return this.#branchProvider
        }
        this.#branchProvider = new BranchProvider(
            await BranchRepository.getBranchRepository(), 
            await DatabaseConnection.getConnection()
        )
        return this.#branchProvider
    }

    async createBranch(req, res){
        const {id, name, location} = req.body

        if(!id || !name || !location){
            return res.status(401).json({message: "Semua field wajib diisi"})
        }

        try{
            const result = await this.#branchRepository.createBranch({id, name, location})
            this.#connection.commit()
            return res.status(201).json({data: result})
        }catch(error){
            this.#connection.rollback()
            return res.status(500).json({message: error.message})
        }
    }

    async getAllBranch(req, res){
        return res.status(200).json({data: await this.#branchRepository.getAllBranch()})
    }

    async getBranch(req, res){
        const {id} = req.params
        return res.status(200).json({data: await this.#branchRepository.getBranch(id)})
    }
}