import http from "http";
import path from "path";
import YAML from "yamljs";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as dotenv from "dotenv";

import ModelInitializer from "./app/models/modelInitializer.js";

import { Server } from "socket.io";
import { EnumDB, EnumModelType } from "./constants/enum.js";

import ErrorHandler from "./middlewares/errorHandler.js";
import verifyAuthSocket from "./app/utils/authSocket.js";
import CustomerController from "./app/controllers/customerController.js";
import ShopController from "./app/controllers/shopController.js";
import FoodController from "./app/controllers/foodController.js";
import OrderController from "./app/controllers/orderController.js";

// environment configuration
dotenv.config();

// Initialize Server
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// API Documentation
const __dirname = path.resolve();
const swaggerDocument = YAML.load(__dirname + "/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Create Model Initializer
const modelInitializer = new ModelInitializer(EnumDB.production);

// Create Production models
const customerModel = modelInitializer.initializeModel(EnumModelType.CUSTOMER);
const shopModel = modelInitializer.initializeModel(EnumModelType.SHOP);
const foodModel = modelInitializer.initializeModel(EnumModelType.FOOD);
const orderModel = modelInitializer.initializeModel(EnumModelType.ORDER);

// Create Controllers
const customerController = new CustomerController(customerModel, orderModel);
const shopController = new ShopController(io, shopModel, orderModel);
const foodController = new FoodController(foodModel);
const orderController = new OrderController(io, orderModel, foodModel);

// Health Check
app.get("/api/healthcheck", (req, res) => {
    res.send({
        status: "OK",
    });
});

// Application
app.use("/api/customers", customerController.router);
app.use("/api/shops", shopController.router);
app.use("/api/foods", foodController.router);
app.use("/api/orders", orderController.router);

/** SocketIo Authentication middleware */
io.use(verifyAuthSocket).on("connection", async (socket) => {
    console.log("User " + socket.id + " is connected.");
    io.to(socket.id).emit("connected", { data: "You are connected." });
    socket.on("disconnect", () => {
        console.log("User " + socket.id + " is disconnected.");
    });
});

/** These Error handlers must in the bottom of app.js */
app.use(ErrorHandler.invalidReqestHandler);
app.use(ErrorHandler.generalErrorHandler);

// Start Server
server.listen(3000, "0.0.0.0", () => {
    console.log("Server is started.");
});
