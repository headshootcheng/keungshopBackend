require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STIPE_KEY);

const bodyParser = require("body-parser");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "hkd",
    receipt_email: "petercheng7788@gmail.com",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post("/create-setup-intent", async (req, res) => {
  // Create or use an existing Customer to associate with the SetupIntent.
  // The PaymentMethod will be stored to this Customer for later use.
  const customer = await stripe.customers.create();
  const paymentIntent = await stripe.setupIntents.create({
    customer: customer.id,
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

app.listen(process.env.PORT, function () {
  console.log("Server Start");
});

// app.use(express.static("."));
