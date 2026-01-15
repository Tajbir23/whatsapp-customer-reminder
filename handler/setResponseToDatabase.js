const responseLogsModel = require("../model/responseLogsSchema")


const setResponseToDatabase = async (admin, message) => {
    const responseLog = await responseLogsModel.create({ admin, message })
    responseLog.save()

}

module.exports = setResponseToDatabase
