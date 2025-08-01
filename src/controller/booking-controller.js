const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../service/index")

const bookingService = new BookingService();

const create = async (req,res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            data: response,
            message: 'Successfully completed Booking',
            success: true,
            err: {}
        })
    } catch (error) {
        return res.status(error.statusCode).json({
            data: {},
            message: error.message,
            success: false,
            err: error.explaination  
        })
    }
}

module.exports = {
    create
}