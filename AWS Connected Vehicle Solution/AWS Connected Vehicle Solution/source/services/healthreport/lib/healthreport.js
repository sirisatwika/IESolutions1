/********************************************************************************************************************* 
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           * 
 *                                                                                                                    * 
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    * 
 *  with the License. A copy of the License is located at                                                             * 
 *                                                                                                                    * 
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    * 
 *                                                                                                                    * 
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES * 
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    * 
 *  and limitations under the License.                                                                                * 
 *********************************************************************************************************************/

/**
 * @author Solution Builders
 */

'use strict';

let shortid = require('shortid');
let moment = require('moment');
let _ = require('underscore');
let AWS = require('aws-sdk');

let creds = new AWS.EnvironmentCredentials('AWS'); // Lambda provided credentials
const dynamoConfig = {
    credentials: creds,
    region: process.env.AWS_REGION
};
const dtcTable = process.env.DTC_TBL;
const tripTable = process.env.VEHICLE_TRIP_TBL;
const ddbTable = process.env.VEHICLE_HEALTH_TBL;

/**
 * Performs operations for health report primiarly with
 * Amazon DynamoDB table.
 *
 * @class healthreport
 */
let healthreport = (function() {

    /**
     * @class healthreport
     * @constructor
     */
    let healthreport = function() {};

    /**
     * Retrieves a vehicle healthreport information.
     * @param {int} page - results page to retrieive
     * @param {getVehicleHealthreport~callback} cb - The callback that handles the response.
     */
    healthreport.prototype.getVehicleHealthreport = function(vin, page, cb) {
        let _page = parseInt(page);
        if (isNaN(_page)) {
            _page = 0;
        }

        getHealthreportPage(vin, null, 0, _page, function(err, data) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            return cb(null, {
                Items: data
            });
        });
    };

    /**
     * Creates a healthreport record for a vehicle.
     * @param {JSON} record - healthreport message
     * @param {createHealthreport~callback} cb - The callback that handles the response.
     */
    healthreport.prototype.createHealthreport = function(record, cb) {

        lookupTrip(record.trip_id, record.vin, function(err, trip_info) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            let healthreport = {
                report_id: shortid.generate(),
                vin: record.vin,
                engine_load: record.engine_load,
                engine_coolant_temp: record.engine_coolant_temp,
                fuel_pressure: record.fuel_pressure,
                intake_manifold_absolute_pressure: record.intake_manifold_absolute_pressure,
                engine_rpm: record.engine_rpm,
                intake_air_temperature: record.intake_air_temperature,
                MAF_air_flowrate: record.MAF_air_flowrate,
                vehicle_speed_mean: 0,
                trip_id: record.trip_id,
                dtcs: [],
                generated_at: moment.utc(record.timestamp, 'YYYY-MM-DD HH:mm:ss.SSSSSSSSS').format(),
                created_at: moment().utc().format(),
                updated_at: moment().utc().format()
            };

            lookupDtcs(record.trip_id, record.vin, function(err, dtc_info) {
                if (err) {
                    console.log(err);
                    return cb(err, null);
                }
            
                if (!_.isEmpty(dtc_info)) {

                    for( var dtc_i in dtc_info.Item.dtc_id){
                         healthreport.dtcs.push(dtc_i);
                    }
                }
            });

            if (!_.isEmpty(trip_info)) {
                healthreport.vehicle_speed_mean = trip_info.Item.vehicle_speed_mean;
            }

            let params = {
                TableName: ddbTable,
                Item: healthreport
            };

            let docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
            docClient.put(params, function(err, data) {
                if (err) {
                    console.log(err);
                    return cb(err, null);
                }

                let _mobile = [
                    'Connected Car Notification. Your vehicle health report generated ',
                    healthreport.report_id, 'for trip [', healthreport.trip_id, '].'
                ].join(' ');

                let _hud = [
                    'A vehicle health report was generated with \'',
                    healthreport.report_id, '\'  for trip [', healthreport.trip_id, '].'
                ].join('');

                let _message = {
                    type: 'healthreport',
                    mobile: _mobile,
                    mqtt: _hud
                }

                sendNotification(record.vin, _message, function(err, msg_data) {
                    if (err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    console.log(msg_data);
                    return cb(null, healthreport);

                });

            });

        });

    };

    /**
     * Get a vehicle healthreport record.
     * @param {string} id - report record id
     * @param {string} vin - vin of vehicle to delete
     * @param {gethealthreport~callback} cb - The callback that handles the response.
     */
    healthreport.prototype.getHealthreport = function(id, vin, cb) {

        let params = {
            TableName: ddbTable,
            Key: {
                report_id: id,
                vin: vin
            }
        };

        let docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        docClient.get(params, function(err, report) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            return cb(null, report);

        });

    };

    /**
     * Deletes a vehicle health report record.
     * @param {string} id - healthreport record id
     * @param {string} vin - vin of vehicle to delete
     * @param {deletehealthreport~callback} cb - The callback that handles the response.
     */
    healthreport.prototype.deletehealthreport = function(id, vin, cb) {

        let params = {
            TableName: ddbTable,
            Key: {
                report_id: id,
                vin: vin
            }
        };

        let docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        docClient.get(params, function(err, report) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            if (!_.isEmpty(report)) {
                docClient.delete(params, function(err, data) {
                    if (err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    return cb(null, data);
                });
            } else {
                return cb({
                    error: {
                        message: 'The health report record requested to update does not exist.'
                    }
                }, null);
            }

        });

    };

    /**
     * Updates a health report record for a vehicle.
     * @param {JSON} reportinfo - updated information for report record
     * @param {updateVehicleHealth~callback} cb - The callback that handles the response.
     */
    healthreport.prototype.updateVehicleHealth = function(reportinfo, cb) {

        let params = {
            TableName: ddbTable,
            Key: {
                report_id: reportinfo.healthreport_id,
                vin: reportinfo.vin
            }
        };

        let docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        docClient.get(params, function(err, report) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            if (!_.isEmpty(report)) {

                report.Item.updated_at = moment().utc().format();

                let updateparams = {
                    TableName: ddbTable,
                    Item: report.Item
                };

                docClient.put(updateparams, function(err, data) {
                    if (err) {
                        console.log(err);
                        return cb(err, null);
                    }

                    return cb(null, data);

                });
            } else {
                return cb({
                    error: {
                        message: 'The healthreport record requested to update does not exist.'
                    }
                }, null);
            }

        });

    };

    let getHealthreportPage = function(vin, lastevalkey, curpage, targetpage, cb) {

        let params = {
            TableName: ddbTable,
            KeyConditionExpression: 'vin = :vin',
            ExpressionAttributeValues: {
                ':vin': vin
            },
            Limit: 20
        };

        if (lastevalkey) {
            params.ExclusiveStartKey = lastevalkey;
        }

        let docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        docClient.query(params, function(err, result) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            if (curpage === targetpage) {
                return cb(null, result.Items);
            } else if (result.LastEvaluatedKey) {
                curpage++;
                getVehiclePage(ticket, result.LastEvaluatedKey, curpage, targetpage, cb);
            } else {
                return cb(null, []);
            }

        });

    };

    /**
     * Get a vehicle healthreport record.
     * @param {string} code - healthreport
     * @param {lookuphealthreport~callback} cb - The callback that handles the response.
     */

    let lookupTrip = function(search_trip_id, search_vin, cb) {

        let params = {
            TableName: tripTable,
            Key: {
                vin: search_vin,
                trip_id: search_trip_id
            }
        };

        let docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        docClient.get(params, function(err, trip) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            return cb(null, trip);

        });

    };

    let lookupDtcs = function(search_trip_id, search_vin, cb) {

        let params = {
            TableName: dtcTable,
            Key: {
                vin: search_vin,
                trip_id: search_trip_id
            }
        };

        let docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        docClient.get(params, function(err, dtcs) {
            if (err) {
                console.log(err);
                return cb(err, null);
            }

            return cb(null, dtcs);

        });

    };

    let sendNotification = function(vin, message, cb) {
        let _payload = {
            vin: vin,
            message: message
        };

        let params = {
            FunctionName: process.env.NOTIFICATION_SERVICE,
            InvocationType: 'Event',
            LogType: 'None',
            Payload: JSON.stringify(_payload)
        };
        let lambda = new AWS.Lambda();
        lambda.invoke(params, function(err, data) {
            if (err) {
                console.log('Error occured when triggering access logging service.', err);
            }

            return cb(null, 'notification transmission triggered');
        });
    };

    return healthreport;

})();

module.exports = healthreport;
