const { Booking } = require("../models");
const ValidationError = require("../utils/errors/validation-error");
const { Apperror,ValidationError } = require("../utils/errors");
const {StatusCodes } = require("http-status-codes");
class BookingRepository {
  async createBooking(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
        if (error.name == "SequelizeValidationError") {
          throw new ValidationError(error);
        }
      console.log("Something went wrong in the repository layer");
      throw  new AppError('RepositoryError','Connot create Booking','There was some issue creating the booking, please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async updateBooking(bookingId, data) {
    try {
      const booking = await Booking.findByPk(bookingId);
      if (data.status) {
        booking.status = data.status;
      }
      await booking.save();
      return booking;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw  new AppError('RepositoryError','Connot update Booking','There was some issue updating the booking, please try again later',StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = BookingRepository;