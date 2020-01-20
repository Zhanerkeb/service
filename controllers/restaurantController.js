const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
let resultsPerPage = {
    product: 6,
};
exports.addRestaurant = (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let location = req.body.location;
    let phone = req.body.phone;
    let averageBill = req.body.averageBill;
    let amountOfPlace = req.body.amountOfPlace;
    let rate = req.body.rate;
    let kitchens=JSON.parse(req.body.kitchens)

    let newRestaurant = {
        name: name,
        image:image,
        location:location,
        phone:phone,
        averageBill:averageBill,
        amountOfPlace: amountOfPlace,
        kitchens:kitchens,
        rate:rate
    };
    db.Restaurant.create(newRestaurant)
        .then(restaurant => {
            kitchens.map((kitchen) => {
                db.ResKitList.create({kitchenId: kitchen, restaurantId: restaurant.id})
            });
            res.send(restaurant)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new restaurant"+err});
    })
};

exports.getRestaurants = (req,res)=>{
    db.Restaurant.findAll()
        .then(restaurants=>{
            res.send(restaurants)
            console.log(restaurants.length)
        }).catch(err=>{
        res.status(500).send({error:err})
    })
}
exports.searchRestaurants = async (req,res)=>{
    try {
        let query = req.query["query"]?req.query["query"]:""

        let page = 1;
        if(parseInt(req.query['page'])) {
            if(parseInt(req.query['page']) > 0) {
                page = parseInt(req.query['page'])
            }
        }


        let restaurants = await db.Restaurant.findAll({
            where: {
                name: {[Op.like]: "%" + query + "%"}
                } ,
            limit: resultsPerPage.product,
            offset: resultsPerPage.product * (page - 1)

        });

        res.send(restaurants);
    }catch (e) {
        console.log(e);
        res.send(e)
    }

}
exports.filterRestaurants = async (req,res)=>{
    console.log("filter")
    try {
        let kitchens;
        try {
            kitchens = JSON.parse(req.body.kitchens);
        } catch (e) {
            throw e;
        }

        console.log(kitchens);
        let restaurants = await db.Restaurant.findAll({
            include:[{
                model:db.ResKitList,
                attributes: [],
                required:true,
                where: {
                    kitchenId: {
                        [sequelize.Op.in]: kitchens
                    }
                }
            }],

        });



        res.send(restaurants);
    }catch (e) {
        console.log(e);
        res.send(e)
    }

}


exports.getById = (req,res)=>{
    db.Restaurant.findByPk(req.params.restaurantId, {
        include: [{
            model: db.ResKitList,
            required: false,
            attributes:['id'],
            include: [{
                model: db.Kitchen,
                required: false
            }]
        },{
            model:db.Review,
            attributes:['id','text'],
            required:false
        }]
    })
        .then(restaurant=>{
            if(!restaurant) {
                res.status(404).send({error: 'There not such restaurant'});
                return;
            }
            res.send(restaurant)
        }).catch(err=>{
        res.status(500).send({error:"no restaurant"+err})
    })
}

exports.updateRestaurant = (req,res)=>{
    let restaurantId=req.params.restaurantId;
    let name = req.body.name;
    let image = req.body.image;
    let location = req.body.location;
    let phone = req.body.phone;
    let averageBill = req.body.averageBill;
    let amountOfPlace = req.body.amountOfPlace;
    let rate = req.body.rate;
    let kitchens=JSON.parse(req.body.kitchens)
    let updatedRestaurant={
        name:name,
        image:image,
        location:location,
        phone:phone,
        averageBill:averageBill,
        kitchens:kitchens,
        amountOfPlace: amountOfPlace,
        rate:rate
    }
    db.Restaurant.update(updatedRestaurant,{
        where:{
            id:restaurantId
        }
    }).then(updatedRowsCount=>{
        res.send({updated:updatedRowsCount})
    }).catch(err=>{
        res.status(500).send({error:"Error while updating restaurant: "+err})
    })
}
exports.deleteRestaurant = (req,res)=>{
    let restaurantId=req.params.restaurantId;
    db.Restaurant.destroy({
        where:{
            id:restaurantId
        }
    }).then(isDeleted=>{
        res.send({deleted:isDeleted})
    }).catch(err=>{
        res.status(500).send({error:"Error while deleting restaurant: "+err})
    })
}