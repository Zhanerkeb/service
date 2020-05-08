const db = require('../models')
exports.addReview = (req, res) => {
    let text = req.body.text;
    let userId = req.user.id
    let restaurantId = req.body.restaurantId
    let newReview = {
        text:text,
        userId:userId,
        restaurantId:restaurantId
    };
    db.Review.create(newReview)
        .then(review => {
            res.send(review)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new review" + err});
    })
};
exports.getReviews = (req,res)=>{
    db.Review.findAll()
        .then(review=>{
            res.send(review)
        }).catch(err=>{
        res.status(500).send({error:err})
    })
}
exports.deleteReview = (req,res)=>{
    let reviewId=req.params.reviewId;
    db.Review.destroy({
        where:{
            id:reviewId
        }
    }).then(isDeleted=>{
        res.send({deleted:isDeleted})
    }).catch(err=>{
        res.status(500).send({error:"Error while deleting review: "+err})
    })
}
