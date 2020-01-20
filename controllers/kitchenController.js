const db = require('../models');

exports.addKitchen = (req, res) => {
    let name = req.body.name;
    let newKitchen = {
        name: name,
    };
    db.Kitchen.create(newKitchen)
        .then(kitchen => {
            res.send(kitchen)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new kitchen"});
    })
};

exports.getKitchens = (req,res)=>{
    db.Kitchen.findAll()
        .then(kitchens=>{
            res.send(kitchens)
            console.log(kitchens.length)
        }).catch(err=>{
            res.status(500).send({error:err})
    })
}
exports.updateKitchen = (req,res)=>{
    let kitchenId=req.params.kitchenId;
    let name= req.body.name;
    let updatedKitchen={
        name:name
    }
    db.Kitchen.update(updatedKitchen,{
        where:{
            id:kitchenId
        }
    }).then(updatedRowsCount=>{
        res.send({updated:updatedRowsCount})
    }).catch(err=>{
        res.status(500).send({error:"Error while updating kitchen: "+err})
    })
}
exports.deleteKitchen = (req,res)=>{
    let kitchenId=req.params.kitchenId;
    db.Kitchen.destroy({
        where:{
            id:kitchenId
        }
    }).then(isDeleted=>{
        res.send({deleted:isDeleted})
    }).catch(err=>{
        res.status(500).send({error:"Error while deleting kitchen: "+err})
    })
}