import express from 'express';
import BranchProvider from './branch.provider.js';

const branchController = async () => {
    const router = express.Router();
    const branchProvider = await BranchProvider.getBranchProvider()
    
    router.post("/create", branchProvider.createBranch.bind(branchProvider))
    router.get("/", branchProvider.getAllBranch.bind(branchProvider))
    router.get("/:id", branchProvider.getBranch.bind(branchProvider))
    return router
}

export {branchController}