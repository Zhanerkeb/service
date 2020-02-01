const db =require('../models')
exports.addFavorites = (req, res) => {
    let userId = req.user.id
    let restaurantId = req.body.restaurantId
    let newFavorite = {
        userId:userId,
        restaurantId:restaurantId,
    };
    db.Favorites.create(newFavorite)
        .then(favorite => {
            res.send(favorite)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new favorite"+err});
    })
};
exports.getById = (req,res)=>{
    let userId=req.user.id

    db.Favorites.findAll({
        where:{
            userId:userId,
        },
        attributes:['id'],
        include:[{
            model: db.Restaurant,
            attributes:['name','image'],
        }]
    })
        .then(favorite=>{
            res.send(favorite)
        }).catch(err=>{
        res.status(500).send({error:err})
    })
}

