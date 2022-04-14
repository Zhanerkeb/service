const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const user = require('./routers/api/user');
const kitchen = require('./routers/api/kitchen');
const restaurant = require('./routers/api/restaurant');
const review = require('./routers/api/review');
const order = require('./routers/api/order');
const favorite = require('./routers/api/favorite');
const reskit = require('./routers/api/reskit')

const db = require('./models/index');
db.sequelize.sync({logging: false}).then(() => {
    console.log('Drop and Resync with { force: true }');
});
app.use(passport.initialize());
app.use(express.static(__dirname + '/'));

require('./config/passport')(passport);
app.use('/api/users', user.userRouter);
app.use('/api/kitchen', kitchen.kitchenRouter);
app.use('/api/restaurant', restaurant.restaurantRouter);
app.use('/api/review', review.reviewRouter);
app.use('/api/order', order.orderRouter);
app.use('/api/favorite', favorite.favoriteRouter);
app.use('/api/reskit', reskit.reskitRouter)

app.listen(5000, () => console.log(`Server running on port 5000`));