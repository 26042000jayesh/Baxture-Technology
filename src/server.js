const {
    APP_PORT
} = require("./config");

const app = require("./app");

const PORT = process.env.PORT || APP_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));