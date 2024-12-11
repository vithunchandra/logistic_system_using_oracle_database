import express, { urlencoded, json } from "express";
import { config } from "dotenv";
import cors from "cors";
import { userController } from "./src/modules/user/user.controller.js";
import { DatabaseConnection } from "./src/database/database_connection.js";
import { branchController } from "./src/modules/branch/branch.controller.js";
import { shipmentQueueController } from "./src/modules/shipment_queue/shipment_queue.controller.js";
import { staffController } from "./src/modules/staff/staff.controller.js";
import { shipmentTransitController } from "./src/modules/shipment_transit/shipment_transit.controller.js";
config();

const app = express();
const port = 3000;

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

const initApp = async () => {
    console.log("Starting the server");
    try {
        app.use("/api/v1/user", await userController())
        app.use('/api/v1/staff', await staffController())
        app.use("/api/v1/branch", await branchController())
        app.use("/api/v1/shipmentqueue", await shipmentQueueController())
        app.use("/api/v1/shipmenttransit", await shipmentTransitController())
        app.get("/helloworld", (req, res) => res.status(200).json({message: "Hello World"}))
        const server = app.listen(port, async () => {
                console.log(`Listening on port ${port}!`)
            }
        )
        process.on('SIGINT', gracefulShutdown)
        process.on('SIGTERM', gracefulShutdown)

        
    } catch (error) {
        console.error("Failed to start the server", error);
    }
};

function gracefulShutdown (signal) {
    if (signal) console.log(`\nReceived signal ${signal}`)
    console.log('Gracefully closing http server')

    try {
        server.close(function (err) {
            DatabaseConnection.closeConnection()
            if (err) {
                console.error('There was an error', err.message)
                process.exit(1)
            } else {
                console.log('http server closed successfully. Exiting!')
                process.exit(0)
            }
        })

        // closeAllConnections() is only available from Node v18.02
        if (server.closeAllConnections) server.closeAllConnections()
        else setTimeout(() => process.exit(0), 5000)

    } catch (err) {
        console.error('There was an error', err.message)
        setTimeout(() => process.exit(1), 500)
    }
}

initApp();
