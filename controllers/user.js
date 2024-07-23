const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.signup = (io) => async ( req , res) => {
    const { username , email , number ,password } = req.body;
    try{
        const existinEmail = await User.findOne({ where : { email }});
        if(existinEmail){
            res.status(400).json({error: 'Email already exists'});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ username , email , number ,password:hashedPassword });
        io.emit('userRegistered', newUser);
        res.status(200).json({ newUser, success: true, message: 'New user created' });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Server error while creating new user' })
    }
}

exports.login = async ( req , res) => {
    const  { email , password } = req.body;
    try{ 
        const user = await User.findOne({where:{email}});
        if(!user){
            res.status(404).json({ error: 'User not found!!Please signup' });
        }
        const comparePassword= await bcrypt.compare(password,user.password);
        if(comparePassword){
            const token = generateToken(user.id, user.username);
            res.status(200).json({ success: true, message: 'User logged in successfully', token });
        } else {
            return res.status(401).json({ success: false, message: 'User not authorized' });
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Server error while logging ' })
    }
}

function generateToken(id , name){
    return jwt.sign({userId:id , name:name} , process.env.JWT_SECRET);
}

exports.getProfile = async(req, res) => {
    const {username} = req.user;
    res.status(200).json({username});
};


exports.getAllProfiles = async (req , res) => {
    try{
        const profiles = await User.findAll();
        res.status(200).json({ success: true, message: 'User fetched profiles successfully', profiles });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.updateProfile = (io) => async( req ,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username' , 'email' , 'profilePic'];
    const isValidOperaion = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperaion){
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try{
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        io.emit('profileUpdated', req.user);
        res.status(200).json({message: 'User updated profile successfully', user:req.user });
    }catch (error) {
        res.status(500).send({ error: error.message });
    }
}