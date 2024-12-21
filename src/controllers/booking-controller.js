const {BookingService} = require('../services/index');
const {StatusCodes} = require('http-status-codes');
const booking= new BookingService();
const create = async (req,res) => {
    try {
        console.log("req.body from booking controller ",req.body);
        const response = await booking.createBooking(req.body);
        console.log("response from booking controller ",response);
        return res.status(StatusCodes.OK).json({
            message:'Successfully completed booking',
            success:true,
            err:{},
            data:response
        })
    } catch (error) {
        console.log("error from booking controller ",error);
        return res.status(error.StatusCode).json({
            message:error.message,
            success:false,
            data: {},
            err:error
        })
    }
}
module.exports = {
    create,
}