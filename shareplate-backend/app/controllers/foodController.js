import express from "express";
import asyncHandler from "express-async-handler";
import { EnumError, EnumType } from "../../constants/enum.js";
import AuthValidator from "../../middlewares/authValidator.js";
import FoodHandler from "../handlers/foodHandler/foodHandler.js";

class FoodController {
    constructor(foodModel) {
        this.foodModel = foodModel;
        this.authValidator = new AuthValidator().build();
        this.router = express.Router();
        this.handleRequests(this.router);
        this.foodHandler = null;
    }

    handleRequests = (router) => {
        router.get("/", this.authValidator, this.getAllFood);
        router.get("/:id", this.authValidator, this.getFoodById);

        router.post("/", this.authValidator, this.createFood);

        router.patch("/:id", this.authValidator, this.updateFood);

        router.delete("/:id", this.authValidator, this.deleteFoodById);
    };

    // deprecated?
    getAllFood = asyncHandler(async (req, res) => {
        this.foodHandler = new FoodHandler(req, this.foodModel);
        const foods = await this.foodHandler.getAllFood();
        res.json({ foods });
    });

    getFoodById = asyncHandler(async (req, res) => {
        this.foodHandler = new FoodHandler(req, this.foodModel);
        const food = await this.foodHandler.getFoodById();
        res.json({ food });
    });

    createFood = asyncHandler(async (req, res) => {
        this.foodHandler = new FoodHandler(req, this.foodModel);
        const foodId = await this.foodHandler.createNewFood();

        // TODO call subscription controller to broadcast

        res.json({ foodId });
    });

    updateFood = asyncHandler(async (req, res) => {
        this.foodHandler = new FoodHandler(req, this.foodModel);
        const foodId = await this.foodHandler.updateFoodById();
        res.json({ foodId });
    });

    deleteFoodById = asyncHandler(async (req, res) => {
        this.foodHandler = new FoodHandler(req, this.foodModel);
        const foodId = await this.foodHandler.deleteFoodById();
        res.json({ foodId });
    });
}

export default FoodController;
