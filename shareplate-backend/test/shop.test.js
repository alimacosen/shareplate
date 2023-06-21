import { initializeDbs } from "../app/models/db.js";
import { EnumDB, EnumError, EnumType } from "../constants/enum.js";
import ShopController from "../app/controllers/shopController.js";
import ShopModel from "../app/models/shopModel.js";
import Fake from "./fake.js";
import OrderModel from "../app/models/orderModel.js";
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

/*
 ** Global Mocks
 */
var fakeShop = Fake.getFakeShop();
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
 ** Shop Login tests
 */
describe("Shop login tests", () => {
    let io, serverSocket, clientSocket;
    let shopModel, orderModel, shopController;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    beforeEach(() => {
        const { customerDBs, foodDBs, orderDBs, shopDBs } = initializeDbs();
        shopModel = new ShopModel(shopDBs, EnumDB.mock);
        orderModel = new OrderModel(orderDBs, EnumDB.mock);
        shopController = new ShopController(io, shopModel, orderModel);
    });

    describe("Shop Signup tests", () => {
        it("successfully create new shop", async () => {
            jest.spyOn(shopModel.model.prototype, "save").mockImplementation(() => ({
                catch: () => fakeShop,
            }));

            var req = {
                body: {
                    email: fakeShop.email,
                    password: fakeShop.password,
                },
            };
            var resp = MockResponse();
            await shopController.createShop(req, resp);
            expect(resp.json).toHaveBeenCalledWith({
                data: {
                    id: fakeShop._id,
                    token: Fake.fakeJWT,
                },
            });
        });

        it("error handling", () => {
            //To do
        });
    });

    describe("get shop by id", () => {
        it("get existing shop", async () => {
            jest.spyOn(shopModel.model, "findOne").mockImplementation(() => ({
                populate: () => ({
                    populate: () => ({
                        catch: () => fakeShop,
                    }),
                }),
            }));
            var req = {
                params: {
                    id: fakeShop._id,
                },
            };
            var resp = MockResponse();
            await shopController.getShopById(req, resp);
            expect(resp.json).toHaveBeenCalledWith({
                data: fakeShop.toObject(),
            });
        });

        it("get non-existing shop", async () => {
            //To do
        });
    });
});
