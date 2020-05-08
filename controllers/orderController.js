const db = require('../models')
exports.addOrder = (req, res) => {
    let userId = req.user.id
    let guest = req.body.guest
    let orderdate = req.body.orderdate
    let restaurantId = req.body.restaurantId
    console.log(userId, guest, orderdate, restaurantId)
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

    db.Order.findAll({
            where:{
                userId:userId,
            },
        attributes: ['id','orderdate','guest'],
        include:[{
            model: db.Restaurant,
            attributes:['name','image'],
        }]
    })
        .then(order=>{
            res.send(order)
        }).catch(err=>{
        res.status(500).send({error:err})
    })
}


