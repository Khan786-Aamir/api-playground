const mongoose = require('mongoose');

const endpointSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Endpoint name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    method: {
      type: String,
      required: [true, 'HTTP method is required'],
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: 'GET',
    },
    headers: {
      type: Map,
      of: String,
      default: {},
    },
    body: {
      type: String,
      default: '',
    },
    lastResponse: {
      status: Number,
      data: mongoose.Schema.Types.Mixed,
      testedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Endpoint', endpointSchema);
