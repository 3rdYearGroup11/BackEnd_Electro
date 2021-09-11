var commonResponseService = require('../../service/responseService');
var unitChargesModel = require('../../model/cebengineer/unitChargesModel');
var userProfileModel = require('../../model/user/userProfileModel');
var authService = require('../../service/authServices');


/**
 * user Profile 
 * @param {*} request
 * @param {*} response 
 */
async function getUnitChargesData(request, response) {

    try {

        console.log("inside getUnitChargesData Controller");
        console.log(request.params.id);
        var unitChargesData = await unitChargesModel.getUnitChargesDataFun(request.params.id);
        // console.log(profileData.data);
        if (unitChargesData.data.length != 0) {
            commonResponseService.responseWithData(response, unitChargesData.data);
            console.log(unitChargesData.data);
        } else {
            commonResponseService.errorWithMessage(response, "no data");

        }



    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}



/**
 * 
 * @param {*} request
 * @param {*} response 
 */
async function updateUnitChargesData(request, response) {

    try {

        console.log("inside updateUnitChargesData Controller");
        // console.log(request.params.id);
        // console.log(request.body.newPrice);
        var updateUnitChargesData = await unitChargesModel.updateUnitChargesDataFun(request.body, request.params.id);
        // console.log(profileData.data);
        commonResponseService.successWithMessage(response, updateUnitChargesData.mesg);



    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}



/**
 * 
 * @param {*} request
 * @param {*} response 
 */
async function acceptedUnitChargesUpdate(request, response) {

    try {

        console.log("inside acceptedUnitChargesUpdate Controller");
        // console.log(request.params.id);
        // console.log(request.body.newPrice);
        var updateUnitChargesData = await unitChargesModel.acceptedUnitChargesUpdateFun(request.body, request.params.id);
        // console.log(profileData.data);
        commonResponseService.successWithMessage(response, updateUnitChargesData.mesg);
        var allEmails = await userProfileModel.getAllEmailsFunc();
        console.log("all mails", allEmails.data[0]);
        for (let i = 0; i < allEmails.data.length; i++) {

            authService.successWithMail(allEmails.data[i].Email, "electrosysg11@gmail.com", "Unit/Fixed Charges Changed", "<h5>Unit/Fixed charges have been changed, Please Recalculate your bill plans</h5>")

        }




    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}

/**
 * reject unit charges update admin controller
 * @param {*} request 
 * @param {*} response 
 */
async function rejectUnitChargesUpdate(request, response) {

    try {

        console.log("inside rejectUnitChargesUpdate Controller");
        // console.log(request.params.id);
        // console.log(request.body.newPrice);
        var updateUnitChargesData = await unitChargesModel.rejectUnitChargesUpdateFun(request.body, request.params.id);
        // console.log(profileData.data);
        commonResponseService.successWithMessage(response, updateUnitChargesData.mesg);



    } catch (error) {
        console.log(error);
        commonResponseService.errorWithMessage(response, "something went wrong");
    }
}

module.exports = { getUnitChargesData, updateUnitChargesData, acceptedUnitChargesUpdate, rejectUnitChargesUpdate };