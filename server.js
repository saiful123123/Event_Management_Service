const express = require('express');
const app = express();
const config = require('dotenv').config({ path: ".env" })
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const helmet = require('helmet')
const RateLimit = require('express-rate-limit');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes.js');
const workshopRoutes = require('./routes/workshopRoutes.js');
const reservationRoutes = require('./routes/reservationRoutes.js');
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");


app.get('/', (req, res) => {
    res.send('API is running...');
});
// IMPLEMENTED SOME OF APIs SECURITY STEPS FROM HERE
const limit = RateLimit({
    max: 100, // max requests
    windowMs: 1000, // per second
    message: 'Too many requests' // message to send
});

app.use(helmet());
app.use(express.json({ limit: '10kb' })); // Body limit is 10
app.use(cors());

// DEFINE ROUTING FILES
app.use('/api/events', limit, eventRoutes);
app.use('/api/workshops', limit, workshopRoutes);
app.use('/api/reservations', limit, reservationRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
// DEFINE MIDDLEWARE ROUTES
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server started on port:${PORT}`)
}
)
