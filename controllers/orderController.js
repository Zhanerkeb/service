const db = require('../models')
exports.addOrder = (req, res) => {
    let userId = req.user.id
    let guest = req.body.guest
    let orderdate = req.body.orderdate
    let restaurantId = req.body.restaurantId
    let newOrder = {
        userId:userId,
        restaurantId:restaurantId,
        guest:guest,
        orderdate:orderdate
    };
    db.Order.create(newOrder)
        .then(order => {
            res.send(order)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new order"+err});
    })
};
exports.getById = (req,res)=>{
    let userId=req.user.id

    db.Restaurant.findAll({
        include:[{
            model:db.Order,
            where:{
                userId:userId,

            }
        }],
    })
        .then(order=>{
            res.send(order)
        }).catch(err=>{
        res.status(500).send({error:err})
    })
}


