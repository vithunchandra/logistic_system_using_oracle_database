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
            const branch = await this.#branchRepository.createBranch({id, name, location, updated_at: null})
            this.#connection.commit()
            return res.status(201).json({branch})
        }catch(error){
            this.#connection.rollback()
            return res.status(500).json({message: error.message})
        }
    }

    async getAllBranch(req, res){
        const result = await this.#branchRepository.getAllBranch()
        console.log(result)
        return res.status(200).json({branches: result})
    }

    async getBranch(req, res){
        const {id} = req.params
        return res.status(200).json({branch: await this.#branchRepository.getBranch(id)})
    }
}