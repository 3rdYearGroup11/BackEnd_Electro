var commonResponseService = require("../../service/responseService");
var SuggestionsModel = require("../../model/monthlyBill/suggestionModel");
var addDeviceModel = require("../../model/monthlyBill/addDevicesModel");
var monthlyBillCalculate = require("../monthlyBill/monthlyBillCalculate");
var calculation = require("../monthlyBill/calculation");

/**
 * View ToU suggestions
 * @param {*} request
 * @param {*} response
 */
async function GetDeviceWiseSuggestions(request, response) {
  try {
    // console.log("inside DeviceWise Suggestions");
    // console.log(request.params.id)
    // console.log(request.body.newBillId)
    var Suggestions = await SuggestionsModel.getSuggestions(
      request.body.newBillId,
      request.params.id
    );

    if (Suggestions.data.length != 0) {
      commonResponseService.responseWithData(response, Suggestions.data);
    } else {
      commonResponseService.errorWithMessage(response, "something went wrong");
    }
  } catch (error) {
    console.log(error);
    commonResponseService.errorWithMessage(response, "something went wrong");
  }
}

/**
 * Applying Suggestions - main controller
 * @param {*} request
 * @param {*} response
 */
async function ApplySuggestions(request, response) {
  try {
    // console.log("inside ApplySuggestions Controller");

    var CustId = request.params.id;
    console.log(request.body);

    var suggestDetails = request.body.suggestDetails;

    var DeviceData = await addDeviceModel.getDeviceDetailsMailBill(
      suggestDetails.bill_id,
      CustId,
      suggestDetails.device_id
    );

    var DeviceDetails = DeviceData.data[0];

    //await suggestionModel.deleteSuggestions(suggestDetails.device_id, CustId, suggestDetails.bill_id);
    // console.log("first -------------------------------------------")
    // console.log(DeviceDetails);
    // console.log(suggestDetails);

    if (suggestDetails.cur_time == "peak") {
      if (suggestDetails.change_time == "off peak") {
        DeviceDetails.hPeak =
          DeviceDetails.hPeak - suggestDetails.can_change_hours;
        DeviceDetails.mPeak =
          DeviceDetails.mPeak - suggestDetails.can_change_minutes;
        DeviceDetails.hOffPeak =
          DeviceDetails.hOffPeak + suggestDetails.can_change_hours;
        DeviceDetails.mOffPeak =
          DeviceDetails.mOffPeak + suggestDetails.can_change_minutes;
      } else if (suggestDetails.change_time == "day") {
        DeviceDetails.hPeak =
          DeviceDetails.hPeak - suggestDetails.can_change_hours;
        DeviceDetails.mPeak =
          DeviceDetails.mPeak - suggestDetails.can_change_minutes;
        DeviceDetails.hDay =
          DeviceDetails.hDay + suggestDetails.can_change_hours;
        DeviceDetails.mDay =
          DeviceDetails.mDay + suggestDetails.can_change_minutes;
      }
    } else if (suggestDetails.cur_time == "day") {
      if (suggestDetails.change_time == "off peak") {
        DeviceDetails.hDay =
          DeviceDetails.hDay - suggestDetails.can_change_hours;
        DeviceDetails.mDay =
          DeviceDetails.mDay - suggestDetails.can_change_minutes;
        DeviceDetails.hOffPeak =
          DeviceDetails.hOffPeak + suggestDetails.can_change_hours;
        DeviceDetails.mOffPeak =
          DeviceDetails.mOffPeak + suggestDetails.can_change_minutes;
      }
    }

    // console.log("end -------------------------------------------")
    // console.log(DeviceDetails);

    await monthlyBillCalculate.updateDeviceWithApplySugestion(
      DeviceDetails,
      CustId
    );

    await calculation.calculatedBillValueUpdateAfterApplySuggest(
      suggestDetails.bill_id,
      CustId
    );

    var Suggestions = await SuggestionsModel.getSuggestions(
      suggestDetails.bill_id,
      CustId
    );

    if (Suggestions.data.length != 0) {
      commonResponseService.responseWithData(response, Suggestions.data);
    } else {
      commonResponseService.errorWithMessage(response, "something went wrong");
    }
  } catch (error) {
    console.log(error);
    commonResponseService.errorWithMessage(response, "something went wrong");
  }
}

module.exports = { GetDeviceWiseSuggestions, ApplySuggestions };
