const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../service/index");
const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");
const service = require("../service/index");

const bookingService = new BookingService();

class BookingController{

    constructor(){
    }

    async sendMsgToQueue(req,res){
        const channel = await createChannel();
        const messegePayload = {       // test msg
            data:{
                subject:'This is a TEST MAIL',
                content:'this mail is been sent from booking service to reminder service, the message queue is setup which can handle multiple services using services data',
                recepientEmail:'photos01.ashu@gmail.com',
                notificationTime: '2025-08-17 22:00:00'
            },
            service:'CREATE_TICKET'
        };  
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(messegePayload)); 
        return res.status(200).json({
            message: 'Successfully published the event'
        })
    }

    async create(req,res){
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
}


module.exports = BookingController;