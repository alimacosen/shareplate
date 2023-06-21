import { initializeDbs } from "../app/models/db.js";
import { EnumDB, EnumError, EnumOrderType, EnumType } from "../constants/enum.js";
import FoodController from "../app/controllers/foodController.js";
import FoodModel from "../app/models/foodModel.js";
import OrderController from "../app/controllers/orderController.js";
import OrderModel from "../app/models/orderModel.js";
import CustomError from "../constants/errors.js";
import Fake from "./fake.js";
import bcrypt from "bcrypt";

/*
 ** Global Mocks
 */
const MockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const MockRequest = (options) => {
    const { headers, body } = options;
    return {
        headers: headers || {},
        body: body || {},
        get: (key) => headers[key],
    };
};

jest.mock("jsonwebtoken", () => ({
    ...jest.requireActual("jsonwebtoken"),
    sign: jest.fn().mockReturnValue("thisIsFakeJWT"),
}));

jest.mock("bcrypt", () => ({
    ...jest.requireActual("bcrypt"),
    compareSync: jest.fn(),
}));

/*
 ** Order tests
 */
describe("Order tests", () => {
    let orderModel, orderController;
    let foodModel, foodController;
    let totalFoodNum;
    let requiredFoodNum;
    let totalFoods; // treat it as food DB
    let items;
    let io = null;
    beforeEach(() => {
        const { customerDBs, foodDBs, orderDBs, shopDBs } = initializeDbs();
        foodModel = new FoodModel(foodDBs, EnumDB.mock);
        foodController = new FoodController(foodModel);
        orderModel = new OrderModel(orderDBs, EnumDB.mock);
        orderController = new OrderController(io, orderModel, foodModel);

        totalFoodNum = Fake.getRandomInt(10, 20);
        requiredFoodNum = Fake.getRandomInt(1, totalFoodNum);
        totalFoods = [];
        items = [];
        for (let i = 0; i < totalFoodNum; i++) {
            const food = Fake.getFakeFood();
            totalFoods.push(food);
        }
        // TODO currently get first n foods, later try to randomly get
        for (let i = 0; i < requiredFoodNum; i++) {
            const item = { foodId: totalFoods[i]._id, quantity: Fake.getRandomInt(1, totalFoods[i].quantity) };
            items.push(item);
        }
    });

    describe("Create order tests", () => {
        it("successfully create basic order", async () => {
            let fakeBasicOrder = Fake.getFakeOrder(EnumOrderType.BASIC);
            fakeBasicOrder.items = items;
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });

            jest.spyOn(orderModel.orderModel.prototype, "save").mockImplementation(() => {
                return Promise.resolve(fakeBasicOrder);
            });

            var req = {
                type: EnumType.CUSTOMER,
                body: {
                    userId: fakeBasicOrder.userId,
                    shopId: fakeBasicOrder.shopId,
                    items: fakeBasicOrder.items,
                    linkedReviews: fakeBasicOrder.linkedReviews,
                    type: fakeBasicOrder.type,
                },
            };
            var resp = MockResponse();
            await orderController.createOrder(req, resp);
            expect(resp.json).toHaveBeenCalledWith({
                orderId: fakeBasicOrder._id,
            });
        });

        it("successfully create togo box order", async () => {
            let fakeTogoOrder = Fake.getFakeOrder(EnumOrderType.TOGO_BOX);
            fakeTogoOrder.items = items;
            fakeTogoOrder.boxNum = Fake.getRandomInt(1, 5);
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });

            jest.spyOn(orderModel.orderModel.prototype, "save").mockImplementation((order) => {
                return Promise.resolve(fakeTogoOrder);
            });

            var req = {
                type: EnumType.CUSTOMER,
                body: {
                    userId: fakeTogoOrder.userId,
                    shopId: fakeTogoOrder.shopId,
                    items: fakeTogoOrder.items,
                    linkedReviews: fakeTogoOrder.linkedReviews,
                    type: fakeTogoOrder.type,
                    boxNum: fakeTogoOrder.boxNum,
                },
            };
            var resp = MockResponse();
            await orderController.createOrder(req, resp);
            expect(resp.json).toHaveBeenCalledWith({
                orderId: fakeTogoOrder._id,
            });
        });

        it("successfully create curbside order", async () => {
            let fakeCurbOrder = Fake.getFakeOrder(EnumOrderType.CURBSIDE);
            fakeCurbOrder.items = items;
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });

            jest.spyOn(orderModel.orderModel.prototype, "save").mockImplementation(() => {
                return Promise.resolve(fakeCurbOrder);
            });

            var req = {
                type: EnumType.CUSTOMER,
                body: {
                    userId: fakeCurbOrder.userId,
                    shopId: fakeCurbOrder.shopId,
                    items: fakeCurbOrder.items,
                    linkedReviews: fakeCurbOrder.linkedReviews,
                    type: fakeCurbOrder.type,
                    pickupLocation: fakeCurbOrder.pickupLocation,
                    carInfo: fakeCurbOrder.carInfo,
                },
            };
            var resp = MockResponse();
            await orderController.createOrder(req, resp);
            expect(resp.json).toHaveBeenCalledWith({
                orderId: fakeCurbOrder._id,
            });
        });

        it("unsuccessfully create basic order: out of stock", async () => {
            let fakeBasicOrder = Fake.getFakeOrder(EnumOrderType.BASIC);
            fakeBasicOrder.items = items;
            fakeBasicOrder.items[0].quantity += totalFoods[0].quantity;

            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });

            jest.spyOn(orderModel.orderModel.prototype, "save").mockImplementation(() => {
                return Promise.resolve(fakeBasicOrder);
            });

            var req = {
                type: EnumType.CUSTOMER,
                body: {
                    userId: fakeBasicOrder.userId,
                    shopId: fakeBasicOrder.shopId,
                    items: fakeBasicOrder.items,
                    linkedReviews: fakeBasicOrder.linkedReviews,
                    type: fakeBasicOrder.type,
                },
            };
            var resp = MockResponse();
            expect(orderController.createOrder(req, resp)).rejects.toThrow("" + EnumError.OUT_OF_STOCK);
        });
    });

    describe("get orders tests", () => {
        it("successfully get basic order by userId", async () => {
            let fakeBasicOrder = Fake.getFakeOrder(EnumOrderType.BASIC);
            fakeBasicOrder.items = items;
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });
            jest.spyOn(orderModel.orderModel, "find").mockImplementation(() => {
                return Promise.resolve([fakeBasicOrder]);
            });

            var req = {
                id: fakeBasicOrder.userId,
                type: EnumType.CUSTOMER,
                query: { userId: fakeBasicOrder.userId },
            };
            var resp = MockResponse();
            await orderController.getOrderByUserId(req, resp);

            fakeBasicOrder.foods = [];
            for (let i = 0; i < fakeBasicOrder.items.length; i++) {
                let foodDetail = totalFoods.find((food) => food._id == fakeBasicOrder.items[i].foodId);
                foodDetail.quantity = fakeBasicOrder.items[i].quantity;
                delete foodDetail.__v;
                delete foodDetail._id;
                fakeBasicOrder.foods.push(foodDetail);
            }
            delete fakeBasicOrder.items;
            fakeBasicOrder._id = fakeBasicOrder._id.toString();
            fakeBasicOrder.userId = fakeBasicOrder.userId.toString();
            fakeBasicOrder.shopId = fakeBasicOrder.shopId.toString();
            expect(resp.json).toHaveBeenCalledWith({
                orders: [fakeBasicOrder],
            });
        });

        it("successfully get basic orders by shopId", async () => {
            let fakeBasicOrder = Fake.getFakeOrder(EnumOrderType.BASIC);
            fakeBasicOrder.items = items;
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });
            jest.spyOn(orderModel.orderModel, "find").mockImplementation(() => {
                return Promise.resolve([fakeBasicOrder]);
            });

            var req = {
                id: fakeBasicOrder.shopId,
                type: EnumType.CUSTOMER,
                query: { userId: fakeBasicOrder.userId },
            };
            var resp = MockResponse();
            await orderController.getOrderByUserId(req, resp);

            fakeBasicOrder.foods = [];
            for (let i = 0; i < fakeBasicOrder.items.length; i++) {
                let foodDetail = totalFoods.find((food) => food._id == fakeBasicOrder.items[i].foodId);
                foodDetail.quantity = fakeBasicOrder.items[i].quantity;
                delete foodDetail.__v;
                delete foodDetail._id;
                fakeBasicOrder.foods.push(foodDetail);
            }
            delete fakeBasicOrder.items;
            fakeBasicOrder._id = fakeBasicOrder._id.toString();
            fakeBasicOrder.userId = fakeBasicOrder.userId.toString();
            fakeBasicOrder.shopId = fakeBasicOrder.shopId.toString();
            expect(resp.json).toHaveBeenCalledWith({
                orders: [fakeBasicOrder],
            });
        });

        it("successfully get togo orders by userId", async () => {
            let fakeTogoOrder = Fake.getFakeOrder(EnumOrderType.TOGO_BOX);
            fakeTogoOrder.items = items;
            fakeTogoOrder.boxNum = Fake.getRandomInt(1, 5);
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });
            jest.spyOn(orderModel.orderModel, "find").mockImplementation(() => {
                return Promise.resolve([fakeTogoOrder]);
            });

            var req = {
                id: fakeTogoOrder.userId,
                type: EnumType.SHOP,
                query: { userId: fakeTogoOrder.userId },
            };
            var resp = MockResponse();
            await orderController.getOrderByUserId(req, resp);

            fakeTogoOrder.foods = [];
            for (let i = 0; i < fakeTogoOrder.items.length; i++) {
                let foodDetail = totalFoods.find((food) => food._id == fakeTogoOrder.items[i].foodId);
                foodDetail.quantity = fakeTogoOrder.items[i].quantity;
                delete foodDetail.__v;
                delete foodDetail._id;
                fakeTogoOrder.foods.push(foodDetail);
            }
            delete fakeTogoOrder.items;
            fakeTogoOrder._id = fakeTogoOrder._id.toString();
            fakeTogoOrder.userId = fakeTogoOrder.userId.toString();
            fakeTogoOrder.shopId = fakeTogoOrder.shopId.toString();
            expect(resp.json).toHaveBeenCalledWith({
                orders: [fakeTogoOrder],
            });
        });

        it("successfully get togo orders by shopId", async () => {
            let fakeTogoOrder = Fake.getFakeOrder(EnumOrderType.TOGO_BOX);
            fakeTogoOrder.items = items;
            fakeTogoOrder.boxNum = Fake.getRandomInt(1, 5);
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });
            jest.spyOn(orderModel.orderModel, "find").mockImplementation(() => {
                return Promise.resolve([fakeTogoOrder]);
            });

            var req = {
                id: fakeTogoOrder.shopId,
                type: EnumType.SHOP,
                query: { userId: fakeTogoOrder.userId },
            };
            var resp = MockResponse();
            await orderController.getOrderByUserId(req, resp);

            fakeTogoOrder.foods = [];
            for (let i = 0; i < fakeTogoOrder.items.length; i++) {
                let foodDetail = totalFoods.find((food) => food._id == fakeTogoOrder.items[i].foodId);
                foodDetail.quantity = fakeTogoOrder.items[i].quantity;
                delete foodDetail.__v;
                delete foodDetail._id;
                fakeTogoOrder.foods.push(foodDetail);
            }
            delete fakeTogoOrder.items;
            fakeTogoOrder._id = fakeTogoOrder._id.toString();
            fakeTogoOrder.userId = fakeTogoOrder.userId.toString();
            fakeTogoOrder.shopId = fakeTogoOrder.shopId.toString();
            expect(resp.json).toHaveBeenCalledWith({
                orders: [fakeTogoOrder],
            });
        });

        it("successfully get curbside orders by userId", async () => {
            let fakeCurbOrder = Fake.getFakeOrder(EnumOrderType.CURBSIDE);
            fakeCurbOrder.items = items;
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });
            jest.spyOn(orderModel.orderModel, "find").mockImplementation(() => {
                return Promise.resolve([fakeCurbOrder]);
            });

            var req = {
                id: fakeCurbOrder.userId,
                type: EnumType.SHOP,
                query: { userId: fakeCurbOrder.userId },
            };
            var resp = MockResponse();
            await orderController.getOrderByUserId(req, resp);

            fakeCurbOrder.foods = [];
            for (let i = 0; i < fakeCurbOrder.items.length; i++) {
                let foodDetail = totalFoods.find((food) => food._id == fakeCurbOrder.items[i].foodId);
                foodDetail.quantity = fakeCurbOrder.items[i].quantity;
                delete foodDetail.__v;
                delete foodDetail._id;
                fakeCurbOrder.foods.push(foodDetail);
            }
            delete fakeCurbOrder.items;
            fakeCurbOrder._id = fakeCurbOrder._id.toString();
            fakeCurbOrder.userId = fakeCurbOrder.userId.toString();
            fakeCurbOrder.shopId = fakeCurbOrder.shopId.toString();
            expect(resp.json).toHaveBeenCalledWith({
                orders: [fakeCurbOrder],
            });
        });

        it("successfully get curbside orders by shopId", async () => {
            let fakeCurbOrder = Fake.getFakeOrder(EnumOrderType.CURBSIDE);
            fakeCurbOrder.items = items;
            jest.spyOn(foodModel.model, "find").mockImplementation((filter) => {
                const searchResult = totalFoods.find((food) => food._id == filter._id);
                return Promise.resolve([searchResult]);
            });
            jest.spyOn(orderModel.orderModel, "find").mockImplementation(() => {
                return Promise.resolve([fakeCurbOrder]);
            });

            var req = {
                id: fakeCurbOrder.shopId,
                type: EnumType.SHOP,
                query: { userId: fakeCurbOrder.userId },
            };
            var resp = MockResponse();
            await orderController.getOrderByUserId(req, resp);

            fakeCurbOrder.foods = [];
            for (let i = 0; i < fakeCurbOrder.items.length; i++) {
                let foodDetail = totalFoods.find((food) => food._id == fakeCurbOrder.items[i].foodId);
                foodDetail.quantity = fakeCurbOrder.items[i].quantity;
                delete foodDetail.__v;
                delete foodDetail._id;
                fakeCurbOrder.foods.push(foodDetail);
            }
            delete fakeCurbOrder.items;
            fakeCurbOrder._id = fakeCurbOrder._id.toString();
            fakeCurbOrder.userId = fakeCurbOrder.userId.toString();
            fakeCurbOrder.shopId = fakeCurbOrder.shopId.toString();
            expect(resp.json).toHaveBeenCalledWith({
                orders: [fakeCurbOrder],
            });
        });
    });
});
