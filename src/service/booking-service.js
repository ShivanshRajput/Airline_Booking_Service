const axios = require('axios');
const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors/index');


class BookingService{
    constructor(){
        this.bookingRepositary = new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`
            const response = await axios.get(getFlightRequestURL);
            const flightData =  response.data.data;
            const flightPrice = flightData.price;
            // console.log(flightPrice);
            // return flightData;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError(
                    'Something Went Wrong in Flight Booking',
                    'Insufficient vacant seats available'
                )
            }
            const totalCost = flightPrice * data.noOfSeats;
            const bookingPayload = {...data , totalCost};
            const booking = await this.bookingRepositary.create(bookingPayload);
            // console.log(booking);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL , {
                totalSeats: flightData.totalSeats - booking.noOfSeats
            })
            const finalBooking = await this.bookingRepositary.update(booking.id , {status:'Booked'});
            return finalBooking;

        } catch (error) {
            if(error.name = 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError()
        }
    }
}

module.exports = BookingService;