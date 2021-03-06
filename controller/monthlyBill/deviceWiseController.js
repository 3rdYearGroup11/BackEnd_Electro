var commonResponseService = require("../../service/responseService");
var deviceWiseModel = require("../../model/monthlyBill/deviceWiseModel");

/**
 * get ToU device wise usage
 * @param {*} request
 * @param {*} response
 */
async function getTouDeviceWise(request, response) {
  try {
    // console.log("inside getTouDeviceWise Controller");
    // console.log(request.params.id)
    // console.log(request.body.newBillId)
    var DeviceData = await deviceWiseModel.getDeviceUsageTou(
      request.body.newBillId,
      request.params.id
    );

    if (DeviceData.data.length != 0) {
      commonResponseService.responseWithData(response, DeviceData.data);
    } else {
      commonResponseService.errorWithMessage(response, "something went wrong");
    }
  } catch (error) {
    console.log(error);
    commonResponseService.errorWithMessage(response, "something went wrong");
  }
}

/**
 * Get Device Wise Usage in Fixed model controller
 * @param {*} request
 * @param {*} response
 */

async function getFixedDeviceWise(request, response) {
  try {
    // console.log("inside getFixedDeviceWise Controller");
    // console.log(request.params.id)
    // console.log(request.body.newBillId)
    var DeviceData = await deviceWiseModel.getDeviceUsageFixed(
      request.body.newBillId,
      request.params.id
    );

    if (DeviceData.data.length != 0) {
      commonResponseService.responseWithData(response, DeviceData.data);
    } else {
      commonResponseService.errorWithMessage(response, "something went wrong");
    }
  } catch (error) {
    console.log(error);
    commonResponseService.errorWithMessage(response, "something went wrong");
  }
}

module.exports = { getTouDeviceWise, getFixedDeviceWise };
