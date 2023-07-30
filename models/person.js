const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const pSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (v) => {
        return /^(\d{2,3}[-]\d+)$/.test(v);
      },
      message: (p) => `${p.value} is not a valid phone number`,
    },
  },
});

pSchema.set("toJSON", {
  transform: (document, rObject) => {
    rObject.id = rObject._id.toString();
    delete rObject._id;
    delete rObject.__v;
  },
});

module.exports = mongoose.model("Person", pSchema);
