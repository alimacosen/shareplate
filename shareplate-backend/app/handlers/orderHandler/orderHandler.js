import { EnumError, EnumType, EnumOrderType, EnumOrderStatus, EnumInventoryOps } from "../../../constants/enum.js";
import BasicOrder from "../orderHandler/orderTypes/basicOrder.js";
import BaseDecorator from "../orderHandler/orderTypes/baseDecorator.js";
import CurbsideDecorator from "./orderTypes/curbSideDecorator/curbsideDecorator.js";
import ToGoBoxDecorator from "./orderTypes/toGoBoxDecorator.js";
import OwnBowlDecorator from "./orderTypes/ownBowlDecorator.js";
import Food from "../foodHandler/food.js";
import CustomError from "../../../constants/errors.js";

const QUERY_KEYS = {
    USER_ID: "userId",
    SHOP_ID: "shopId",
};

class OrderHandler {
    constructor(metaInfo, orderModel, foodModel) {
        this.metaInfo = metaInfo;
        this.orderDecorator = null;
        this.orderModel = orderModel;
        this.foodModel = foodModel;
    }

    getOrderByUserIdOrShopId = async () => {
        const query = this.metaInfo.query;
        const orderRawList = await this.orderModel.getOrders(query);
        if (orderRawList.length == 0) {
            return [];
        }
        const orders = this.assembleOrders(orderRawList);
        return orders;
    };

    getOrderById = async () => {
        const orderRaw = this.metaInfo.orderRaw;
        const order = this.assembleOrders([orderRaw]);
        return order;
    };

    assembleOrders = async (ordersRaw) => {
        let orders = [];
        for (let i = 0; i < ordersRaw.length; i++) {
            let order = JSON.parse(JSON.stringify(ordersRaw[i]));
            order.foods = [];
            for (let i = 0; i < order.items.length; i++) {
                const foodId = order.items[i].foodId;
                const quantity = order.items[i].quantity;
                const foodDataList = await this.foodModel.getFood({ _id: foodId });
                const foodData = foodDataList[0];
                let foodInfo = new Food(foodData.foodName, foodData.price, quantity, foodData.description, foodData.image);
                foodInfo = JSON.parse(JSON.stringify(foodInfo));
                order.foods.push(foodInfo);
            }
            delete order.items;
            orders.push(order);
        }
        return orders;
    };

    createNewOrder = async () => {
        if (this.metaInfo.type != EnumType.CUSTOMER) {
            throw new CustomError(EnumError.UNAUTHENTICATED);
        }
        const orderId = this.genNewOrder();
        return orderId;
    };

    genNewOrder = async () => {
        let basicOrder = new BasicOrder();
        basicOrder.parseMetaInfo(this.metaInfo);
        await basicOrder.getItems(this.foodModel);
        basicOrder.getPrice();
        switch (basicOrder.type) {
            case EnumOrderType.BASIC:
                this.orderDecorator = basicOrder;
                break;
            case EnumOrderType.TOGO_BOX:
                this.orderDecorator = new ToGoBoxDecorator(basicOrder);
                this.orderDecorator.setBoxNum(this.metaInfo.body.boxNum).getPrice();
                break;
            case EnumOrderType.CURBSIDE:
                this.orderDecorator = new CurbsideDecorator(basicOrder);
                this.orderDecorator.setPickUPSpot(this.metaInfo.body.pickupLocation).setCarInfo(this.metaInfo.body.carInfo).getPrice();
                break;
            default:
                throw new CustomError();
        }
        const orderId = this.placeOrder();
        return orderId;
    };

    changeStatus = async () => {
        const nextStatus = this.metaInfo.body.nextStatus;
        const id = this.metaInfo.params.id;
        const orderRawList = await this.orderModel.getOrders({ _id: id });
        const orderRaw = orderRawList[0];

        let order = null;
        if (this.metaInfo.cancelOrder) {
            order = this.cancelOrder(orderRaw);
        } else {
            order = await this.orderModel.updateOrder({ _id: id }, { status: nextStatus });
        }
        return order;
    };

    placeOrder = async () => {
        const basicOrder = this.orderDecorator.basicOrder || this.orderDecorator; // get basicOrder
        if (!(await this.checkInventory())) {
            throw new CustomError(EnumError.OUT_OF_STOCK);
        }
        this.updateInventory(basicOrder, EnumInventoryOps.SUBTRACTION);
        const orderObj = JSON.parse(JSON.stringify(this.orderDecorator));
        const orderId = await this.orderModel.creatOrder(orderObj);
        return orderId;
    };

    checkInventory = async () => {
        const basicOrder = this.orderDecorator.basicOrder || this.orderDecorator; // get basicOrder
        for (let i = 0; i < basicOrder.items.length; i++) {
            const foodId = basicOrder.items[i].foodId;
            const quantity = basicOrder.items[i].quantity;
            const foodDataList = await this.foodModel.getFood({ _id: foodId });
            const food = foodDataList[0];
            if (food.quantity < quantity) {
                return false;
            }
        }
        return true;
    };

    updateInventory = async (order, op) => {
        for (let i = 0; i < order.items.length; i++) {
            const foodId = order.items[i].foodId;
            const quantity = order.items[i].quantity;
            let updates = {
                $inc: { quantity: op * quantity },
            };
            this.foodModel.updateById({ _id: foodId }, updates);
        }
    };

    cancelOrder = async (orderRaw) => {
        const id = orderRaw._id;
        this.updateInventory(orderRaw, EnumInventoryOps.ADDITION);
        const orderId = await this.orderModel.updateOrder({ _id: id }, { status: EnumOrderStatus.CANCELED });
        return orderId;
    };
}

export default OrderHandler;
