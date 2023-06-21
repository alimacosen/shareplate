import { EnumDB, EnumError } from "../constants/enum.js";
import CustomError from "../constants/errors.js";
import AuthHandler from "../middlewares/handlers/authHandler.js";
import Fake from "./fake.js";
import jwt from "jsonwebtoken";
import ProfileDataHandler from "../middlewares/handlers/profileDataHandler.js";
import MatchIdHandler from "../middlewares/handlers/matchIdHandler.js";
import CrossTypeHandler from "../middlewares/handlers/crossTypeHandler.js";
import OrderQueryHandler from "../middlewares/handlers/orderQueryHandler.js";
import ValidOrderHandler from "../middlewares/handlers/validOrderHandler.js";
import IdExistHandler from "../middlewares/handlers/idExistHandler.js";

const MockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const MockRequest = (headers, body = {}) => ({
    header: (name) => headers[name],
    body: body,
});

jest.mock("jsonwebtoken", () => ({
    ...jest.requireActual("jsonwebtoken"),
    sign: jest.fn().mockReturnValue("thisIsFakeJWT"),
}));

jest.mock("bcrypt", () => ({
    ...jest.requireActual("bcrypt"),
    compareSync: jest.fn(),
}));

describe("Auth related Handlers tests", () => {
    it("AuthHandler should authenticate the request", async () => {
        var fakeCustomer = Fake.getFakeCustomer();

        const headers = {
            Authorization: "Bearer thisIsAToken",
        };
        var userReq = MockRequest(headers);
        jwt.verify = jest.fn().mockReturnValue({
            id: fakeCustomer._id,
            type: fakeCustomer.type,
        });
        var userResp = MockResponse();
        const authHandler = new AuthHandler();
        authHandler.verifyAuth(userReq, userResp);
        expect(userReq.id).toEqual(fakeCustomer._id);
        expect(userReq.type).toEqual(fakeCustomer.type);
    });

    it("ProfileDataHandler Should throw error if email is empty", async () => {
        var fakeCustomer = Fake.getFakeCustomer();

        const headers = {
            Authorization: "Bearer thisIsAToken",
        };
        const body = {
            password: fakeCustomer.password,
        };
        // Mock the request
        var userReq = MockRequest(headers, body);
        var userResp = MockResponse();
        const profileDataHandler = new ProfileDataHandler();
        // Should throw error if email is empty
        expect(async () => {
            profileDataHandler.validate(userReq, userResp);
        }).rejects.toThrow(new CustomError(EnumError.BAD_REQUEST));
    });

    it("ProfileDataHandler Should throw error if password is empty", async () => {
        var fakeCustomer = Fake.getFakeCustomer();

        const headers = {
            Authorization: "Bearer thisIsAToken",
        };
        const body = {
            email: fakeCustomer.email,
        };
        // Mock the request
        var userReq = MockRequest(headers, body);
        var userResp = MockResponse();
        const profileDataHandler = new ProfileDataHandler();
        // Should throw error if email is empty
        expect(async () => {
            profileDataHandler.validate(userReq, userResp);
        }).rejects.toThrow(new CustomError(EnumError.BAD_REQUEST));
    });

    it("MatchIdHandler Should not throw error if the id is matched", async () => {
        var fakeCustomer = Fake.getFakeCustomer();

        const headers = {
            Authorization: "Bearer thisIsAToken",
        };
        // Mock the request
        var userReq = MockRequest(headers);
        userReq.params = {
            id: fakeCustomer._id,
        };
        userReq.id = fakeCustomer._id;
        var userResp = MockResponse();
        const matchIdHandler = new MatchIdHandler();
        // Should throw error if email is empty
        expect(async () => {
            matchIdHandler.matchParamId(userReq, userResp);
        }).not.toThrow();
    });

    // Test cross type handler
    it("CrossTypeReviewHandler should throw error if the type is the same", async () => {
        // Mock the model class
        const MockModel = {
            getById: jest.fn(),
        };

        // Mock the target object with the same type as req.type
        const targetType = "sameType";
        const targetId = "fakeTargetId";
        const target = { type: targetType };

        MockModel.getById.mockResolvedValue(target);

        // Mock the request
        const headers = {
            Authorization: "Bearer thisIsAToken",
        };
        const userReq = MockRequest(headers);
        userReq.params = { id: targetId };
        userReq.type = targetType;
        const userResp = MockResponse();

        // Initialize CrossTypeHandler with the MockModel
        const crossTypeHandler = new CrossTypeHandler(MockModel);

        // Expect CrossTypeReviewHandler to throw an error when the types are the same
        await expect(async () => {
            await crossTypeHandler.verifyCrossType(userReq, userResp);
        }).rejects.toThrow(new CustomError(EnumError.PERMISSION_DENIED, "Can only refer to a review from different type"));
    });
});

// Test OrderQueryHandler
describe("OrderQueryHandler tests", () => {
    const orderQueryHandler = new OrderQueryHandler();

    const mockRequest = (query, id) => ({
        query: query,
        id: id,
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it("should throw error if both userId and shopId are in the query", () => {
        const req = mockRequest({ userId: "userId", shopId: "shopId" }, "userId");
        const res = mockResponse();

        expect(() => {
            orderQueryHandler.verifyOrderQuery(req, res);
        }).toThrow(new CustomError(EnumError.BAD_REQUEST, "Cannot query by both userId and shopId"));
    });

    it("should throw error if neither userId nor shopId are in the query", () => {
        const req = mockRequest({}, "userId");
        const res = mockResponse();

        expect(() => {
            orderQueryHandler.verifyOrderQuery(req, res);
        }).toThrow(new CustomError(EnumError.BAD_REQUEST, "Query must contain either userId or shopId"));
    });

    it("should throw error if the userId or shopId in the query does not match the req.id", () => {
        const req = mockRequest({ userId: "userId" }, "differentId");
        const res = mockResponse();

        expect(() => {
            orderQueryHandler.verifyOrderQuery(req, res);
        }).toThrow(new CustomError(EnumError.UNAUTHENTICATED));
    });

    it("should not throw an error if the query is valid", () => {
        const req = mockRequest({ userId: "userId" }, "userId");
        const res = mockResponse();

        expect(() => {
            orderQueryHandler.verifyOrderQuery(req, res);
        }).not.toThrow();
    });
});

// Test ValidOrderHandler
describe("ValidOrderHandler tests", () => {
    const MockModel = {
        getOrders: jest.fn(),
    };

    const validOrderHandler = new ValidOrderHandler(MockModel);

    const mockRequest = (params, id) => ({
        params: params,
        id: id,
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it("should throw error if the order is not found", async () => {
        MockModel.getOrders.mockResolvedValue([]);

        const req = mockRequest({ id: "fakeOrderId" }, "userId");
        const res = mockResponse();

        await expect(async () => {
            await validOrderHandler.verifyOrderIsValid(req, res);
        }).rejects.toThrow(new CustomError(EnumError.ORDER_NOT_FOUND, "Order not found"));
    });

    it("should throw error if the user does not have permission to access the order", async () => {
        const orderRaw = {
            _id: "fakeOrderId",
            userId: "userId",
            shopId: "shopId",
        };

        MockModel.getOrders.mockResolvedValue([orderRaw]);

        const req = mockRequest({ id: "fakeOrderId" }, "unauthorizedUserId");
        const res = mockResponse();

        await expect(async () => {
            await validOrderHandler.verifyOrderIsValid(req, res);
        }).rejects.toThrow(new CustomError(EnumError.PERMISSION_DENIED, "You are not allowed to access this order"));
    });

    it("should not throw error if the user is allowed to access the order", async () => {
        const orderRaw = {
            _id: "fakeOrderId",
            userId: "userId",
            shopId: "shopId",
        };

        MockModel.getOrders.mockResolvedValue([orderRaw]);

        const req = mockRequest({ id: "fakeOrderId" }, "userId");
        const res = mockResponse();

        await expect(validOrderHandler.verifyOrderIsValid(req, res)).resolves.not.toThrow();
    });
});

// Test IdExistHandler
describe("IdExistHandler tests", () => {
    const MockModel = {
        getById: jest.fn(),
    };

    const mockRequest = (params, id) => ({
        params: params,
        id: id,
    });

    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it("should not throw if id found", async () => {
        const fakeModel = {
            getById: jest.fn().mockReturnValue({ id: "123", name: "John" }),
        };
        const req = {
            params: { id: "123" },
        };
        const res = {};
        const next = jest.fn();

        const idExistHandler = new IdExistHandler(fakeModel);
        await idExistHandler.handle(req, res, next);

        expect(fakeModel.getById).toHaveBeenCalledWith("123");
        expect(next).toHaveBeenCalled();
        await expect(idExistHandler.checkIdExists(req, res)).resolves.not.toThrow();
    });

    it("should throw error if id not found", async () => {
        const fakeModel = {
            getById: jest.fn().mockReturnValue(null),
        };
        const req = {
            params: { id: "123" },
        };
        const res = {};
        const idExistHandler = new IdExistHandler(fakeModel);
        await expect(async () => {
            await idExistHandler.checkIdExists(req, res);
        }).rejects.toThrow(new CustomError(EnumError.USER_NOT_FOUND, "Cannot find user by id"));
    });
});
