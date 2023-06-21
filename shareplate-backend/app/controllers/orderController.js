import express from "express";
import asyncHandler from "express-async-handler";
import AuthValidator from "../../middlewares/authValidator.js";
import OrderHandler from "../handlers/orderHandler/orderHandler.js";
import OrderStatusValidator from "../../middlewares/orderStatusValidator.js";
import GetOrderValidator from "../../middlewares/getOrderValidator.js";
import ValidOrderValidator from "../../middlewares/validOrderValidator.js";
import OrderStatusObserver from "../observers/OrderStatusObserver.js";

class OrderController {
    constructor(io, orderModel, foodModel) {
        this.orderModel = orderModel;
        this.foodModel = foodModel;
        this.authValidator = new AuthValidator().build();
        this.getOrderValidator = new GetOrderValidator().build();
        this.validOrderValidator = new ValidOrderValidator(this.orderModel).build();
        this.orderStatusValidator = new OrderStatusValidator(this.orderModel).build();
        this.router = express.Router();
        this.handleRequests(this.router);
        this.observers = [];
        this.registerObserver(new OrderStatusObserver(io));
    }

    handleRequests = (router) => {
        router.get("/", this.getOrderValidator, this.getOrderByUserId);

        router.get("/:id", this.validOrderValidator, this.getOrderById);

        router.post("/", this.authValidator, this.createOrder);

        router.patch("/:id", this.orderStatusValidator, this.updateOrderStatus);
    };

    registerObserver = (observer) => {
        this.observers.push(observer);
    };

    notifyObservers = (order) => {
        this.observers.forEach((observer) => observer.update(order));
    };

    getOrderByUserId = asyncHandler(async (req, res) => {
        const orderHandler = new OrderHandler(req, this.orderModel, this.foodModel);
        const orders = await orderHandler.getOrderByUserIdOrShopId();
        res.json({ orders });
    });

    getOrderById = asyncHandler(async (req, res) => {
        const orderHandler = new OrderHandler(req, this.orderModel, this.foodModel);
        const order = await orderHandler.getOrderById();
        res.json({ order });
    });

    createOrder = asyncHandler(async (req, res) => {
        const orderHandler = new OrderHandler(req, this.orderModel, this.foodModel);
        const orderId = await orderHandler.createNewOrder();
        res.json({ orderId });
    });

    updateOrderStatus = asyncHandler(async (req, res) => {
        const orderHandler = new OrderHandler(req, this.orderModel, this.foodModel);
        const order = await orderHandler.changeStatus();
        // Notify observers of the updated order
        this.notifyObservers(order);
        res.json({ order });
    });
}

export default OrderController;
