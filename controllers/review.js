const Review = require("../models/review");
const User = require("../models/user");


exports.addReview = async( req, res) => {
    const {recipeId , comment } = req.body;
    try{
        const newReview = await Review.create({ recipeId , comment , UserId:req.user.id });
        const populatedReview = await Review.findOne({
            where: {id : newReview.id} ,
            include:[{model:User, attributes:['username']}]
        });
        res.status(201).json({ success: true, message: 'Review added successfully', reviews:populatedReview  })
    }catch (error) {
        console.error('Error while adding review:', error);
        res.status(500).json({ error: 'Server error while adding review' });    }
};

exports.getReview = async( req, res) => {
    const { id } = req.params;
    try{
        const reviews = await Review.findAll({
            where: { recipeId: id },
            include: [{ model: User, attributes: ['username'] }]
        });        
        res.status(200).json({ success: true, reviews });
    }catch (error) {
        console.error('Error while fetching reviews:', error);
        res.status(500).json({ error: 'Server error while fetching reviews' });    }
}