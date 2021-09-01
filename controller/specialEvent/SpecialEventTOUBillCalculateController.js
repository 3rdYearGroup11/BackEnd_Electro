var commonResponseService = require('../../service/responseService');
var addSpecialEventDeviceModel = require('../../model/specialEvent/SpecialEventDeviceTOUModel');
var unitChargesModel = require('../../model/cebengineer/unitChargesModel');


function calculateTOUBill(TOU_bill_sum, fixed_charge){
    var billValue = parseFloat(TOU_bill_sum) + parseFloat(fixed_charge);
    return billValue.toFixed(2);
}

function CalculateUnits(power, minutes,quantity) {

    var numOfUnits = quantity * power * minutes * 60 / 3600000;
    console.log("Calculate Units:",numOfUnits);
    return parseFloat(numOfUnits);

}

function CalculateNumberOfMinutes(hors, minutes) {

    var numOfMinutes = parseInt(hors * 60) + parseInt(minutes);
    console.log("Number Of Minutes : ",numOfMinutes);
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
        console.log("device data",Device_details_TOU);
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
        Device_details_TOU.units_peak_time = await CalculateUnits(Device_details_TOU.power, Device_details_TOU.using_minutes_peak_time,Device_details_TOU.quantity);
        Device_details_TOU.units_off_peak_time = await CalculateUnits(Device_details_TOU.power, Device_details_TOU.using_minutes_off_peak_time,Device_details_TOU.quantity);
        Device_details_TOU.units_day_time = await CalculateUnits(Device_details_TOU.power, Device_details_TOU.using_minutes_day_time,Device_details_TOU.quantity);
        Device_details_TOU.cost_peak_time = await CalculateCost(PeakUnitCost, Device_details_TOU.units_peak_time);
        Device_details_TOU.cost_off_peak_time = await CalculateCost(OffPeakUnitCost, Device_details_TOU.units_off_peak_time);
        Device_details_TOU.cost_day_time = await CalculateCost(DayUnitCost, Device_details_TOU.units_day_time);
        Device_details_TOU.total_cost_TOU = Device_details_TOU.cost_peak_time + Device_details_TOU.cost_off_peak_time + Device_details_TOU.cost_day_time;


        console.log("inside addDeviceDataMain Controller");
        // console.log(request.params.id);
        var DeviceData_TOU = await addSpecialEventDeviceModel.AddSpecialEventDeviceDataTOU(Device_details_TOU, request.params.id);
        // console.log(profileData.data);

        commonResponseService.successWithMessage(response, DeviceData_TOU.mesg);


    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}

// async function AddSpecialEventDeviceDataFixed(request, response) {

//     try {

//         var Device_details_fixed = request.body.data;
        
//         console.log("HYUUUUUUU");
//         console.log(Device_details_fixed);
//         console.log(request.params.id);

        
//         Device_details_fixed.using_minutes_fixed = await CalculateNumberOfMinutes(Device_details_fixed.hfixed, Device_details_fixed.mfixed);
//         Device_details_fixed.total_units_fixed = await CalculateUnits(Device_details_fixed.power, Device_details_fixed.using_minutes_fixed,Device_details_fixed.quantity);


//          console.log(Device_details_fixed.using_minutes_fixed);
//          console.log(Device_details_fixed.total_units_fixed);
//         var DeviceData_fixed = await addSpecialEventDeviceModel.AddSpecialEventDeviceFixed(Device_details_fixed, request.params.id);
//         // console.log(profileData.data);

//         commonResponseService.successWithMessage(response, DeviceData_fixed.mesg);


//     } catch (error) {
//         console.log(error);
//         commonResponseService.errorWithMessage(response, "something went wrong");
//     }
// }


async function getTOUBillId(request, response) {

    try {

        console.log("inside getBillId TOU Controller");
        var Cust_id = request.params.id;
        var bill_id = await addSpecialEventDeviceModel.getTOUBillIdFunc(Cust_id);

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

async function GetSpecialEventDeviceDataTOU(request, response) {

    try {

        console.log("inside get special Event details Controller");
        var Cust_id = request.params.id;
        var Bill_id=request.body.newBillId;
        var bill_id = await addSpecialEventDeviceModel.getSpecialEventDetailsTOU(Cust_id,Bill_id);

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



async function updateDeviceDataSpecialEventTOU(request, response) {

    try {

        console.log("inside update device detail Controller");

        var special_event_deviceTOUDetails = request.body.data;
        var bill_id=request.body.bill_id;
        console.log(special_event_deviceTOUDetails);
        console.log(request.params.id);

        var Cust_id = request.params.id;
        
        var UnitPrice = await unitChargesModel.getUnitChargesDataFun("tou");
        var DayUnitCost = UnitPrice.data[0].Unit_charge;
        var OffPeakUnitCost = UnitPrice.data[1].Unit_charge;
        var PeakUnitCost = UnitPrice.data[2].Unit_charge;




        special_event_deviceTOUDetails.using_minutes_peak_time = await CalculateNumberOfMinutes(special_event_deviceTOUDetails.hPeak,special_event_deviceTOUDetails.mPeak);
        special_event_deviceTOUDetails.using_minutes_off_peak_time = await CalculateNumberOfMinutes(special_event_deviceTOUDetails.hOffPeak, special_event_deviceTOUDetails.mOffPeak);
        special_event_deviceTOUDetails.using_minutes_day_time = await CalculateNumberOfMinutes(special_event_deviceTOUDetails.hDay, special_event_deviceTOUDetails.mDay);
        special_event_deviceTOUDetails.units_peak_time = await CalculateUnits(special_event_deviceTOUDetails.power, special_event_deviceTOUDetails.using_minutes_peak_time, special_event_deviceTOUDetails.quantity);
        special_event_deviceTOUDetails.units_off_peak_time = await CalculateUnits(special_event_deviceTOUDetails.power, special_event_deviceTOUDetails.using_minutes_off_peak_time, special_event_deviceTOUDetails.quantity);
        special_event_deviceTOUDetails.units_day_time = await CalculateUnits(special_event_deviceTOUDetails.power, special_event_deviceTOUDetails.using_minutes_day_time, special_event_deviceTOUDetails.quantity);
        special_event_deviceTOUDetails.cost_peak_time = await CalculateCost(PeakUnitCost, special_event_deviceTOUDetails.units_peak_time);
        special_event_deviceTOUDetails.cost_off_peak_time = await CalculateCost(OffPeakUnitCost, special_event_deviceTOUDetails.units_off_peak_time);
        special_event_deviceTOUDetails.cost_day_time = await CalculateCost(DayUnitCost, special_event_deviceTOUDetails.units_day_time);
        special_event_deviceTOUDetails.total_units = special_event_deviceTOUDetails.units_peak_time + special_event_deviceTOUDetails.units_off_peak_time + special_event_deviceTOUDetails.units_day_time;
        special_event_deviceTOUDetails.total_cost_TOU = special_event_deviceTOUDetails.cost_peak_time + special_event_deviceTOUDetails.cost_off_peak_time + special_event_deviceTOUDetails.cost_day_time;

        
        //special_event_deviceFixedDetails.using_minutes_fixed = await CalculateNumberOfMinutes(special_event_deviceFixedDetails.hfixed, special_event_deviceFixedDetails.mfixed);
        //special_event_deviceFixedDetails.total_units_fixed = await CalculateUnits(special_event_deviceFixedDetails.power, special_event_deviceFixedDetails.using_minutes_fixed);

        var bill_id = await addSpecialEventDeviceModel.updateSpecialEventDetailsTOU(special_event_deviceTOUDetails, Cust_id,bill_id);

        if (bill_id.data != null) {
            //console.log("data null!!");
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

async function calculatedTOUBillValue(request, response){
    try {

        
        var billId = request.body.bill_id;
        console.log("calculateTOU Bill value:",billId);
        var CustId = request.params.id;
        
        var Bill_details = await addSpecialEventDeviceModel.getDeviceDetailsToCalculate(billId, CustId );
        console.log("Bill Details Calculated:",Bill_details);
        //var total_units = Bill_details.data[0].TotalUnits;
        var TOU_bill_cost = calculateTOUBill(Bill_details.data[0].TOU_bill_sum, 540);
       
        Bill_details.data[0].TOU_bill_cost = parseFloat(TOU_bill_cost);
        Bill_details.data[0].billId = parseInt(billId);
       // Bill_details.data[0].additionalUnits = parseInt(Bill_details.data[0].Total_units);
       // Bill_details.data[0].additionalCost = parseInt(Bill_details.data[0].TOU_bill_sum);

       
        
       //await addSpecialEventDeviceModel.setTOUSpecialEventPlan(Bill_details.data[0], CustId);

        

         if (Bill_details.data != null) {
            console.log("The bill details is :",Bill_details);
            commonResponseService.responseWithData(response, Bill_details.data);

        } else {
            console.log("TOU Special Event Saved SuccessFully!!");
            Bill_details.data.TotalCost = 0;
            Bill_details.data.TotalUnits = 0;
            commonResponseService.responseWithData(response, Bill_details.data);

        }
        

    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}





module.exports = { AddSpecialEventDeviceDataTOU , getTOUBillId, GetSpecialEventDeviceDataTOU, updateDeviceDataSpecialEventTOU,deleteSpecialEventDeviceData,calculatedTOUBillValue};
