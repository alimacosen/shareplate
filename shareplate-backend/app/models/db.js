import mongoose, { connect } from "mongoose";
import customerSchema from "./schemas/customerSchema.js";
import foodSchema from "./schemas/foodSchema.js";
import orderSchema from "./schemas/orderSchema.js";
import shopSchema from "./schemas/shopSchema.js";
import { EnumDB } from "../../constants/enum.js";

import * as dotenv from "dotenv";
dotenv.config();

class DbFactory {
    constructor(mode) {
        if (mode == EnumDB.production) {
            this.conn = mongoose.createConnection(
                process.env.DB_CONNECTION,
                {
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                },
                (err) => {
                    console.log("db connect error:" + err);
                }
            );
            console.log("db connect success.");
        }
    }
    produceDb = (name, schema) => {
        var model = null;
        if (this.conn) {
            model = this.conn.model(name, schema);
            return model;
        }
        model = mongoose.model(name, schema);
        return model;
    };
}

function initializeDbs() {
    const productionDbFactory = new DbFactory(EnumDB.production);
    const mockDbFactory = new DbFactory(EnumDB.mock);

    const customerDBs = {
        [EnumDB.production]: productionDbFactory.produceDb("customers", customerSchema),
        [EnumDB.mock]: mockDbFactory.produceDb("customers", customerSchema),
    };

    const foodDBs = {
        [EnumDB.production]: productionDbFactory.produceDb("foods", foodSchema),
        [EnumDB.mock]: mockDbFactory.produceDb("foods", foodSchema),
    };

    const orderDBs = {
        [EnumDB.production]: productionDbFactory.produceDb("orders", orderSchema),
        [EnumDB.mock]: mockDbFactory.produceDb("orders", orderSchema),
    };

    const shopDBs = {
        [EnumDB.production]: productionDbFactory.produceDb("shops", shopSchema),
        [EnumDB.mock]: mockDbFactory.produceDb("shops", shopSchema),
    };

    return { customerDBs, foodDBs, orderDBs, shopDBs };
}
export { initializeDbs };
