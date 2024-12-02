"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_server_1 = require("../utils/db.server");
db_server_1.db.user.deleteMany({
    where: {
        email: 'ramziwassim2004@gmail.com',
    }
}).then(() => console.log('done 1'));
db_server_1.db.user.delete({
    where: {
        email: 'zch92142@gmail.com',
    }
}).then(() => console.log('done 2'));
