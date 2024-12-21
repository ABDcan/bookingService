const { BookingRepository } = require('../repository/index');  
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const axios = require('axios');
const { ServiceError } = require('../utils/errors');
const { where } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }
    async createBooking(data) {
        try {
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const Flight = await axios.get(getFlightRequestURL);
            // console.log("From Booking Service",Flight);
            const flightData =  Flight.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient seats in the flight');
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            console.log("total cost of the flight",totalCost);
            const bookingPayload = {...data, totalCost};
            console.log("booking payload from booking service",bookingPayload);
            const booking = await this.bookingRepository.create(bookingPayload);
            console.log("booking from booking service",booking);
          const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
          console.log(updateFlightRequestURL);
          await axios.patch(updateFlightRequestURL,{totalSeats: flightData.totalSeats - booking.noOfSeats});
          const finalBooking = await this.bookingRepository.updateBooking(booking.id,{status: "Booked"});
            return finalBooking;
        } catch (error) {
            if(error.name === 'RepositoryError' || error.name === 'ValidationError') {
                throw error;
            }
           throw new ServiceError();
        }
    }
    async updateBooking(bookingId,data) {
        try {
            const booking = await this.bookingRepository.update(data,{
                where: {
                    id: bookingId
                }
            });
            return true;
        } catch (error) {
            throw new AppError('RepositoryError','Cannot update booking','Something went wrong','There was some issue updating the booking, please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
module.exports = BookingService;