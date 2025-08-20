const express = require('express');
const { BookingController } = require('../../controller');
// const { createChannel } = require('../../utils/messageQueue');

// const channel = await createChannel();
const bookingController = new BookingController();

const router = express.Router();

router.post('/bookings' , bookingController.create);
router.post('/publish', bookingController.sendMsgToQueue);


module.exports = router;