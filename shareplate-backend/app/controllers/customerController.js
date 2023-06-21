import express from "express";
import asyncHandler from "express-async-handler";
import login from "../handlers/loginHandler.js";
import signup from "../handlers/signupHandler.js";
import { createReview, updateOrderReviewer } from "../handlers/reviewHandler.js";
import { EnumError, EnumType } from "../../constants/enum.js";
import hashPassword from "../utils/hash.js";
import AuthValidator from "../../middlewares/authValidator.js";
import ProfileDataHandler from "../../middlewares/handlers/profileDataHandler.js";
import EmailPasswordValidator from "../../middlewares/emailPasswordValidator.js";
import SelfUpdateValidator from "../../middlewares/selfUpdateValidator.js";
import CustomError from "../../constants/errors.js";
import CrossTypeReviewValidator from "../../middlewares/crossTypeReviewValidator.js";

class CustomerController {
    constructor(customerModel, orderModel) {
        this.customerModel = customerModel;
        this.orderModel = orderModel;
        // this.handlers = compose many handlers
        this.profileDataHandler = new ProfileDataHandler();
        this.emailPasswordValidator = new EmailPasswordValidator().build();
        this.selfUpdateValidator = new SelfUpdateValidator().build();
        this.authValidator = new AuthValidator().build();
        this.crossTypeReviewValidator = new CrossTypeReviewValidator(this.customerModel).build();
        this.router = express.Router();
        this.handleRequests(this.router);
    }

    handleRequests = (router) => {
        router.get("/me", this.authValidator, this.getByToken);
        router.get("/", this.authValidator, this.getAllCustomers);
        router.get("/:id", this.authValidator, this.getCustomerById);

        router.post("/", this.emailPasswordValidator, this.createCustomer);
        router.post("/sessions", this.emailPasswordValidator, this.loginCustomer);
        router.post("/:id/reviews", this.crossTypeReviewValidator, this.createCustomerReview);

        router.patch("/:id", this.selfUpdateValidator, this.updateCustomer);
    };

    createCustomer = asyncHandler(async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const data = await signup(this.customerModel, EnumType.CUSTOMER, email, password);
        res.json({ data });
    });

    loginCustomer = asyncHandler(async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        var data = await login(this.customerModel, EnumType.CUSTOMER, email, password);
        res.json({ data });
    });

    getByToken = asyncHandler(async (req, res) => {
        var data = await this.customerModel.getById(req.id);
        delete data.password;
        data.type = req.type;
        res.json({ data });
    });

    getAllCustomers = asyncHandler(async (req, res) => {
        const data = await this.customerModel.getAll();
        res.json({ data });
    });

    getCustomerById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const data = await this.customerModel.getById(id);
        delete data.password;
        res.json({ data });
    });

    updateCustomer = asyncHandler(async (req, res) => {
        console.log(req.body);
        const id = req.params.id;
        var update = {};
        if (req.body.name) {
            update.name = req.body.name;
        }
        if (req.body.password) {
            update.password = hashPassword(req.body.password);
        }
        const updatedUser = await this.customerModel.updateById(id, update);
        res.json({
            data: {
                id: updatedUser._id,
            },
        });
    });

    getCustomerReviewsById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const customer = await this.customerModel.getById(id);
        const reviews = customer.reviews;
        res.json({ reviews });
    });

    createCustomerReview = asyncHandler(async (req, res) => {
        const revieweeId = req.params.id;
        const reviewerId = req.id;
        const createdTime = Date.now();
        const content = req.body.content;
        const rating = req.body.rating;
        const orderId = req.body.orderId;
        const data = await createReview(this.customerModel, reviewerId, revieweeId, createdTime, content, rating, orderId);
        const order = await updateOrderReviewer(this.orderModel, req.type, reviewerId, orderId);
        res.json({ data });
    });
}

export default CustomerController;
