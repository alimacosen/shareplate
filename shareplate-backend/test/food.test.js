import { initializeDbs } from "../app/models/db.js";
import { EnumDB, EnumError, EnumType } from "../constants/enum.js";
import FoodController from "../app/controllers/foodController.js";
import FoodModel from "../app/models/foodModel.js";
import CustomError from "../constants/errors.js";
import Fake from "./fake.js";
import bcrypt from "bcrypt";

/*
 ** Global Mocks
 */
const fakeFood = Fake.getFakeFood();
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
 ** Food create tests
 */
describe("Food tests", () => {
    let foodModel, foodController;
    beforeEach(() => {
        const { customerDBs, foodDBs, orderDBs, shopDBs } = initializeDbs();
        foodModel = new FoodModel(foodDBs, EnumDB.mock);
        foodController = new FoodController(foodModel);
    });

    describe("Create food tests", () => {
        it("successfully create new shop", async () => {
            jest.spyOn(foodModel.model.prototype, "save").mockImplementation(() => {
                return Promise.resolve(fakeFood);
            });

            var req = {
                type: EnumType.SHOP,
                body: {
                    foodName: fakeFood.foodName,
                    quantity: fakeFood.quantity,
                    price: fakeFood.price,
                    description: fakeFood.description,
                    image: fakeFood.image,
                },
            };
            var resp = MockResponse();
            await foodController.createFood(req, resp);
            expect(resp.json).toHaveBeenCalledWith({
                foodId: fakeFood._id,
            });
        });
    });

    describe("get food tests", () => {
        it("successfully create new shop", async () => {});
    });
});
