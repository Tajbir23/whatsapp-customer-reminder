const baseUrl = require("../config/baseUrl")

const saveLogsToDatabase = async(logsType, message) => {
    try {
        await fetch(`${baseUrl}/api/save-logs-to-database`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ logsType, message })
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = saveLogsToDatabase
