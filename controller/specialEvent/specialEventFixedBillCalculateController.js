var commonResponseService = require('../../service/responseService');
var addSpecialEventDeviceModel = require('../../model/specialEvent/SpecialEventDeviceFixedModel');
var unitChargesModel = require('../../model/cebengineer/unitChargesModel');

function CalculateUnits(power, minutes,quantity) {

    var numOfUnits = quantity * power * minutes * 60 / 3600000;
    return parseFloat(numOfUnits*quantity);

}

function CalculateNumberOfMinutes(hors, minutes) {

    var numOfMinutes = parseInt(hors * 60) + parseInt(minutes);
    return numOfMinutes;

}

function CalculateCost(uPrice, Units) {

    var cost = uPrice * Units;
    return cost;

}

/**
 * add device data to main bill plan
 */
async function AddSpecialEventDeviceDataTOU(request, response) {

    try {

        var Device_details_TOU = request.body.data;
        console.log(Device_details_TOU);
        console.log(request.params.id);

        var UnitPrice = await unitChargesModel.getUnitChargesDataFun("tou");
        console.log(UnitPrice.data[0].Unit_charge);
        console.log(UnitPrice.data[1].Unit_charge);
        console.log(UnitPrice.data[2].Unit_charge);

        var DayUnitCost = UnitPrice.data[0].Unit_charge;
        var OffPeakUnitCost = UnitPrice.data[1].Unit_charge;
        var PeakUnitCost = UnitPrice.data[2].Unit_charge;


        Device_details_TOU.using_minutes_peak_time = await CalculateNumberOfMinutes(Device_details_TOU.hPeak, Device_details_TOU.mPeak);
        Device_details_TOU.using_minutes_off_peak_time = await CalculateNumberOfMinutes(Device_details_TOU.hOffPeak, Device_details_TOU.mOffPeak);
        Device_details_TOU.using_minutes_day_time = await CalculateNumberOfMinutes(Device_details_TOU.hDay, Device_details_TOU.mDay);
        Device_details_TOU.units_peak_time = await CalculateUnits(Device_details_TOU.power, Device_details_TOU.using_minutes_peak_time);
        Device_details_TOU.units_off_peak_time = await CalculateUnits(Device_details_TOU.power, Device_details_TOU.using_minutes_off_peak_time);
        Device_details_TOU.units_day_time = await CalculateUnits(Device_details_TOU.power, Device_details_TOU.using_minutes_day_time);
        Device_details_TOU.cost_peak_time = await CalculateCost(PeakUnitCost, Device_details_TOU.units_peak_time);
        Device_details_TOU.cost_off_peak_time = await CalculateCost(OffPeakUnitCost, Device_details_TOU.units_off_peak_time);
        Device_details_TOU.cost_day_time = await CalculateCost(DayUnitCost, Device_details_TOU.units_day_time);
        Device_details_TOU.total_cost_TOU = Device_details_TOU.cost_peak_time + Device_details_TOU.cost_off_peak_time + Device_details_TOU.cost_day_time;


        console.log("inside addDeviceDataMain Controller");
        // console.log(request.params.id);
        var DeviceData_TOU = await addSpecialEventDeviceModel. AddSpecialEventDeviceDataTOU(Device_details_TOU, request.params.id);
        // console.log(profileData.data);

        commonResponseService.successWithMessage(response, DeviceData_TOU.mesg);


    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}

async function AddSpecialEventDeviceDataFixed(request, response) {

    try {

        var Device_details_fixed = request.body.data;
        
        console.log("HYUUUUUUU");
        console.log(Device_details_fixed);
        console.log(request.params.id);

        
        Device_details_fixed.using_minutes_fixed = await CalculateNumberOfMinutes(Device_details_fixed.hfixed, Device_details_fixed.mfixed);
        Device_details_fixed.total_units_fixed = await CalculateUnits(Device_details_fixed.power, Device_details_fixed.using_minutes_fixed,Device_details_fixed.quantity);


         console.log(Device_details_fixed.using_minutes_fixed);
         console.log(Device_details_fixed.total_units_fixed);
        var DeviceData_fixed = await addSpecialEventDeviceModel.AddSpecialEventDeviceFixed(Device_details_fixed, request.params.id);
        // console.log(profileData.data);

        commonResponseService.successWithMessage(response, DeviceData_fixed.mesg);


    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}


async function getFixedBillId(request, response) {

    try {

        console.log("inside getBillId Controller");
        var Cust_id = request.params.id;
        var bill_id = await addSpecialEventDeviceModel.getFixedBillIdFunc(Cust_id);

        if (bill_id.data != null) {
            commonResponseService.responseWithData(response, bill_id.data);

        } else {
           
            bill_id.data = 0;
            commonResponseService.responseWithData(response, bill_id.data);

        }

    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}

async function GetSpecialEventDeviceDataFixed(request, response) {

    try {

        console.log("inside get special Event details Controller");
        var Cust_id = request.params.id;
        var Bill_id=request.body.newBillId;
        var bill_id = await addSpecialEventDeviceModel.getSpecialEventDetailsFixed(Cust_id,Bill_id);

        if (bill_id.data != null) {
           // console.log("data null!!");
           console.log(bill_id.data);
            commonResponseService.responseWithData(response, bill_id.data);

        } else {

            bill_id.data = 0;
            commonResponseService.responseWithData(response, bill_id.data);

        }

    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}



async function updateDeviceDataSpecialEvent(request, response) {

    try {

        console.log("inside update device detail Controller");

        var special_event_deviceFixedDetails = request.body.data;
        var bill_id=request.body.bill_id;
        console.log(special_event_deviceFixedDetails);
        console.log(request.params.id);

        var Cust_id = request.params.id;
        
        
        special_event_deviceFixedDetails.using_minutes_fixed = await CalculateNumberOfMinutes(special_event_deviceFixedDetails.hfixed, special_event_deviceFixedDetails.mfixed);
        special_event_deviceFixedDetails.total_units_fixed = await CalculateUnits(special_event_deviceFixedDetails.power, special_event_deviceFixedDetails.using_minutes_fixed);

        var bill_id = await addSpecialEventDeviceModel.updateSpecialEventDetailsFixed(special_event_deviceFixedDetails, Cust_id,bill_id);

        if (bill_id.data != null) {
           // console.log("data null!!");
           console.log(bill_id.data);
            commonResponseService.responseWithData(response, bill_id.data);

        } else {

            bill_id.data = 0;
            commonResponseService.responseWithData(response, bill_id.data);

        }

    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}





async function deleteSpecialEventDeviceData(request, response) {

    try {

        console.log("inside deleteDeviceDataMain Controller");
        var Cust_id = request.params.id;
        var device_delete = await addSpecialEventDeviceModel.deleteSpecialEventDeviceFunc(Cust_id,request.body);

        commonResponseService.successWithMessage(response, device_delete.mesg);
        

    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}




module.exports = { AddSpecialEventDeviceDataTOU , AddSpecialEventDeviceDataFixed , getFixedBillId, GetSpecialEventDeviceDataFixed, updateDeviceDataSpecialEvent,deleteSpecialEventDeviceData};
