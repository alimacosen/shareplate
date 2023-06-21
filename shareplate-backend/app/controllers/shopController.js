import express from "express";
import asyncHandler from "express-async-handler";
import login from "../handlers/loginHandler.js";
import signup from "../handlers/signupHandler.js";
import hashPassword from "../utils/hash.js";
import { createReview, updateOrderReviewer } from "../handlers/reviewHandler.js";
import { EnumError, EnumType } from "../../constants/enum.js";
import AuthValidator from "../../middlewares/authValidator.js";
import ProfileDataHandler from "../../middlewares/handlers/profileDataHandler.js";
import EmailPasswordValidator from "../../middlewares/emailPasswordValidator.js";
import SelfUpdateValidator from "../../middlewares/selfUpdateValidator.js";
import CrossTypeReviewValidator from "../../middlewares/crossTypeReviewValidator.js";
import SearchByCategory from "../strategies/searchByCategory.js";
import SearchByAvailability from "../strategies/searchByAvailability.js";
import SearchByRating from "../strategies/searchByRating.js";
import SearchByAll from "../strategies/searchByAll.js";
import SearchByLocation from "../strategies/searchByLocation.js";
import SearchByName from "../strategies/searchByName.js";
import ShopMenuObserver from "../observers/ShopMenuObserver.js";
class ShopController {
    constructor(io, shopModel, orderModel) {
        this.io = io;
        this.shopModel = shopModel;
        this.orderModel = orderModel;
        this.profileDataHandler = new ProfileDataHandler();
        this.emailPasswordValidator = new EmailPasswordValidator().build();
        this.selfUpdateValidator = new SelfUpdateValidator().build();
        this.authValidator = new AuthValidator().build();
        this.crossTypeReviewValidator = new CrossTypeReviewValidator(this.shopModel).build();
        this.router = express.Router();
        this.handleRequests(this.router);
        this.searchStrategy = undefined;
        this.observers = [];
        this.registerObserver(new ShopMenuObserver(io));
    }

    registerObserver = (observer) => {
        this.observers.push(observer);
    };

    notifyObservers = (subscribers, menu) => {
        this.observers.forEach((observer) => observer.update(subscribers, menu));
    };

    updateShop = asyncHandler(async (req, res) => {
        const id = req.params.id;
        var update = req.body;
        if (update.password) {
            update.password = hashPassword(update.password);
        }
        const data = await this.shopModel.updateShop(id, update);
        if (update.menu) {
            const subscribers = data.subscribers;
            // Notify observers of the updated shop
            console.log(this.shopModel);
            this.notifyObservers(subscribers, data);
        }
        res.json({ data });
    });

    handleRequests = (router) => {
        router.get("/me", this.authValidator, this.getByToken);
        router.get("/", this.authValidator, this.getAllShops);
        router.get("/:id", this.authValidator, this.getShopById);

        router.get("/:id/foods", this.getMenu);

        router.post("/", this.emailPasswordValidator, this.createShop);
        router.post("/sessions", this.emailPasswordValidator, this.loginShop);
        router.post("/:id/reviews", this.crossTypeReviewValidator, this.createShopReview);
        router.post("/:id/subscribers", this.authValidator, this.subscribeShop);

        router.patch("/:id", this.selfUpdateValidator, this.updateShop);
        router.delete("/:id/subscribers", this.authValidator, this.removeSubscriber);
    };

    createShop = asyncHandler(async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const data = await signup(this.shopModel, EnumType.SHOP, email, password);
        res.json({ data });
    });

    loginShop = asyncHandler(async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        var data = await login(this.shopModel, EnumType.SHOP, email, password);
        res.json({ data });
    });

    getByToken = asyncHandler(async (req, res) => {
        var data = await this.shopModel.getById(req.id);
        delete data.password;
        data.type = req.type;
        res.json({ data });
    });

    getAllShops = asyncHandler(async (req, res) => {
        const method = req.query.method;
        const condition = req.query.condition;
        let data;
        if (method === undefined) {
            this.searchStrategy = new SearchByAll();
        } else if (method == "category") {
            this.searchStrategy = new SearchByCategory();
        } else if (method == "availability") {
            this.searchStrategy = new SearchByAvailability();
        } else if (method == "rating") {
            this.searchStrategy = new SearchByRating();
        } else if (method == "name") {
            this.searchStrategy = new SearchByName();
        } else if (method == "location") {
            this.searchStrategy = new SearchByLocation();
        }
        data = await this.searchStrategy.search(this.shopModel, condition);
        res.json({ data });
    });

    getShopById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const data = await this.shopModel.getById(id);
        delete data.password;
        res.json({ data });
    });

    getReviewsByShopId = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const shop = await this.shopModel.getById(id);
        const reviews = shop.reviews;
        res.json({ reviews });
    });

    createShopReview = asyncHandler(async (req, res) => {
        const revieweeId = req.params.id;
        const reviewerId = req.id;
        const createdTime = Date.now();
        const content = req.body.content;
        const rating = req.body.rating;
        const orderId = req.body.orderId;
        const data = await createReview(this.shopModel, reviewerId, revieweeId, createdTime, content, rating, orderId);
        const order = await updateOrderReviewer(this.orderModel, req.type, reviewerId, orderId);
        res.json({ data });
    });

    /*
    updateShop = asyncHandler(async (req, res) => {
        const id = req.params.id;
        var update = req.body;
        if (update.password) {
            update.password = hashPassword(update.password);
        }
        const data = await this.shopModel.updateShop(id, update);
        if (update.menu) {
            const subscribers = data.subscribers;
            this.notifyMenuChanged(subscribers, data);
        }
        res.json({ data });
    });
    */

    getMenu = asyncHandler(async (req, res) => {
        const id = req.params.id;
        const shop = await this.shopModel.getById(id);
        const menu = shop.menu;
        res.json({ menu });
    });

    subscribeShop = asyncHandler(async (req, res) => {
        const shopId = req.params.id;
        const customerId = req.id;
        const data = await this.shopModel.subscribeShop(shopId, customerId);
        res.json({ data });
    });

    removeSubscriber = asyncHandler(async (req, res) => {
        const shopId = req.params.id;
        const customerId = req.id;
        const data = await this.shopModel.removeSubscriber(shopId, customerId);
        res.json({ data });
    });

    notifyMenuChanged = (subscribers, data) => {
        for (let i = 0; i < subscribers.length; i++) {
            const subscriberId = subscribers[i];
            this.io.to(subscriberId.toString()).emit("menuChanged", { data });
        }
    };
}

export default ShopController;
