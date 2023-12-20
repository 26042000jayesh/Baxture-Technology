const express = require("express");
const {
    APP_PORT
} = require("./config");
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require("./routes/route");
const CustomErrorHandler = require('./services/CustomErrorHandler')

const app = express();
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.get('/', (req, res) => {
    res.json("Hello, world!");
})
app.use('/api', userRouter);
app.use((req, res, next) => {
    next(CustomErrorHandler.notFound('Route not found'));
});
app.use(errorHandler);
const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));