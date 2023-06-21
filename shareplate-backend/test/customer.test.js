import { initializeDbs } from "../app/models/db.js";
import { EnumDB, EnumError } from "../constants/enum.js";
import CustomerController from "../app/controllers/customerController.js";
import CustomerModel from "../app/models/customerModel.js";
import CustomError from "../constants/errors.js";
import AuthValidator from "../middlewares/authValidator.js";
import Fake from "./fake.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import OrderModel from "../app/models/orderModel.js";

/*
 ** Global Mocks
 */
const MockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const MockRequest = (headers) => ({
    header: (name) => headers[name],
});

jest.mock("jsonwebtoken", () => ({
    ...jest.requireActual("jsonwebtoken"),
    sign: jest.fn().mockReturnValue("thisIsFakeJWT"),
}));

jest.mock("bcrypt", () => ({
    ...jest.requireActual("bcrypt"),
    compareSync: jest.fn(),
}));

/*
 ** Customer Login tests
 */
describe("Customer login tests", () => {
    let customerModel, orderModel, customerController;
    beforeEach(() => {
        const { customerDBs, orderDBs } = initializeDbs();
        customerModel = new CustomerModel(customerDBs, EnumDB.mock);
        orderModel = new OrderModel(orderDBs, EnumDB.mock);
        customerController = new CustomerController(customerModel, orderModel);
    });

    it("should login a valid customer", async () => {
        var fakeCustomer = Fake.getFakeCustomer();
        jest.spyOn(customerModel.model, "findOne").mockImplementation(() => ({
            catch: () => fakeCustomer,
        }));

        var userReq = {
            body: {
                email: fakeCustomer.email,
                password: fakeCustomer.password,
            },
        };

        bcrypt.compareSync.mockReturnValue(true);

        var userResp = MockResponse();
        await customerController.loginCustomer(userReq, userResp);
        expect(userResp.json).toHaveBeenCalledWith({
            data: {
                id: fakeCustomer._id,
                token: Fake.fakeJWT,
            },
        });
    });

    it("should deny login an invalid customer", async () => {
        var fakeCustomer = Fake.getFakeCustomer();
        jest.spyOn(customerModel.model, "findOne").mockImplementation(() => ({
            catch: () => fakeCustomer,
        }));

        var userReq = {
            body: {
                email: fakeCustomer.email,
                password: fakeCustomer.password,
            },
        };

        bcrypt.compareSync.mockReturnValue(false);

        var userResp = MockResponse();
        await expect(async () => {
            await customerController.loginCustomer(userReq, userResp);
        }).rejects.toThrow(new CustomError(EnumError.PERMISSION_DENIED));
    });
});

/*
 ** Customer Signup tests
 */
describe("Customer Signup tests", () => {
    let customerModel, orderModel, customerController;
    beforeEach(() => {
        const { customerDBs, orderDBs } = initializeDbs();
        customerModel = new CustomerModel(customerDBs, EnumDB.mock);
        orderModel = new OrderModel(orderDBs, EnumDB.mock);
        customerController = new CustomerController(customerModel, orderModel);
    });

    it("should create a new customer with valid email and password", async () => {
        var fakeCustomer = Fake.getFakeCustomer();
        jest.spyOn(customerModel.model.prototype, "save").mockImplementation(() => ({
            catch: () => fakeCustomer,
        }));

        var userReq = {
            body: {
                email: fakeCustomer.email,
                password: fakeCustomer.password,
            },
        };
        var userResp = MockResponse();
        await customerController.createCustomer(userReq, userResp);
        expect(userResp.json).toHaveBeenCalledWith({
            data: {
                id: fakeCustomer._id,
                token: Fake.fakeJWT,
            },
        });
    });

    it("should throw an error with invalid email", async () => {
        var fakeCustomer = Fake.getFakeCustomer();
        jest.spyOn(customerModel.model.prototype, "save").mockImplementation(() => ({
            populate: () => ({
                catch: () => fakeCustomer,
            }),
        }));

        var userReq = {
            body: {
                password: fakeCustomer.password,
            },
        };
        var userResp = MockResponse();

        await expect(async () => {
            await customerController.emailPasswordValidator(userReq, userResp);
        }).rejects.toThrow(new CustomError(EnumError.BAD_REQUEST));
    });

    it("should throw an error with invalid password", async () => {
        var fakeCustomer = Fake.getFakeCustomer();
        jest.spyOn(customerModel.model.prototype, "save").mockImplementation(() => ({
            populate: () => ({
                catch: () => fakeCustomer,
            }),
        }));

        var userReq = {
            body: {
                email: fakeCustomer.email,
            },
        };
        var userResp = MockResponse();

        await expect(async () => {
            await customerController.emailPasswordValidator(userReq, userResp);
        }).rejects.toThrow(new CustomError(EnumError.BAD_REQUEST));
    });
});

/*
 ** Customer getByToken tests
 */
describe("Customer get endpoint tests", () => {
    let customerModel, orderModel, customerController;
    beforeEach(() => {
        const { customerDBs, orderDBs } = initializeDbs();
        customerModel = new CustomerModel(customerDBs, EnumDB.mock);
        orderModel = new OrderModel(orderDBs, EnumDB.mock);
        customerController = new CustomerController(customerModel, orderModel);
        jwt.verify = jest.fn();
    });

    it("should retrieve information by valid token", async () => {
        var fakeCustomer = Fake.getFakeCustomer();

        jwt.verify = jest.fn().mockReturnValue({
            id: fakeCustomer._id,
            type: fakeCustomer.type,
        });

        jest.spyOn(customerModel.model, "findOne").mockImplementation(() => ({
            populate: () => ({
                catch: () => fakeCustomer,
            }),
        }));

        delete fakeCustomer.password;

        var userReq = {};
        var userResp = MockResponse();
        await customerController.getByToken(userReq, userResp);
        expect(userResp.json).toHaveBeenCalledWith({
            data: {
                _id: fakeCustomer._id,
                email: fakeCustomer.email,
                name: fakeCustomer.name,
                subscribedShops: fakeCustomer.subscribedShops,
                reviews: fakeCustomer.reviews,
            },
        });
    });

    it("should be unauthenticated by invalid token", async () => {
        var fakeCustomer = Fake.getFakeCustomer();
        jwt.verify = jest.fn(() => {
            throw new jwt.JsonWebTokenError("Invalid token");
        });

        const authValidator = new AuthValidator().build();

        delete fakeCustomer.password;

        const headers = {
            Authorization: "Bearer thisIsAnInvalidtoken",
        };

        var userReq = MockRequest(headers);
        var userResp = MockResponse();

        await expect(async () => {
            await authValidator(userReq, userResp);
        }).rejects.toThrow(new CustomError(EnumError.UNAUTHENTICATED));
    });
});
