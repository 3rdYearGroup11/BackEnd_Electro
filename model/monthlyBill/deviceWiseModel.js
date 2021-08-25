var db = require('../../database/databaseConnection');

module.exports.getDeviceUsageTou = (billId, userId) => {
    return new Promise(async (resolve, reject) => {




        var selectDeviceWiseTouQuery = `SELECT device_id,appliance, quantity,  cost_day_time, cost_off_peak_time, cost_peak_time ,total_units_fixed, total_cost_TOU FROM electric_device_mplan WHERE Cust_id=${userId} AND bill_id=${billId};`;
        console.log(selectDeviceWiseTouQuery)

        db.query(selectDeviceWiseTouQuery, async function (error, result) {

            if (error) {
                console.log(error);

                reject({ status: false, mesg: "error getting data" });
            } else {
                // console.log(result);

                resolve({ status: true, data: result });

            }

        });
    });

}