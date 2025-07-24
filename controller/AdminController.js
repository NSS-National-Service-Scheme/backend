import AdminModule from "../modules/AdminModule.js";
import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
    setResponseBadRequest
} from '../utilites/response.js';
const AdminController = {
    getDepts : async(req,res)=>{
        try{
            const results = await AdminModule.getDepts();
             return res
                .status(results.responseCode)
                .json(results.responseBody);
        }catch(error){
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getSchools : async(req,res)=>{
        try{
            const results = await AdminModule.getSchools();
             return res
                .status(results.responseCode)
                .json(results.responseBody);
        }catch(error){
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    }
}



export default AdminController;