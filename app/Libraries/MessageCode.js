'use strict'

class MessageCode {

	static respondWithSuccess(response , data = [], msg = "Action Successfull!"){
		return response.status(200).json({
			'status_code' : 200,
			'status' : 'success',
			'message' : msg,
			'data' : data
		})
	}

	static respondWithError(response ,msg = "Action Successfull!" ,  data = []){
		return response.status(500).json({
			'status_code' : 404,
			'status' : 'failed',
			'message' : msg,
			'data' : data
		})
	}
}
module.exports = MessageCode
