const mongoose = require("mongoose");
const app = require("./app");
const port = 3000;

const dataBaseURI =
  "mongodb+srv://maq:0Jm2YsBBSOGWOhZT@cluster0.gj01oto.mongodb.net/ecommerce?retryWrites=true";

mongoose
  .connect(dataBaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(port, () => {
      console.log(`server is up on ${port}`);
    })
  )
  .catch((error) => console.error(error));
