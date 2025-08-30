const jwt = require('jsonwebtoken');
const AppError = require('../Utils/AppError');
const Status = require('../Utils/Status');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // صح

    if (!authHeader) {
        const error = new AppError("token is required"  , 401 , Status.FAIL)
        return next(error);
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken; // تخزين بيانات المستخدم للي بعده
        
        next();
    } catch (err) {
        const error =new  AppError("Invalid or expired token"  , 401 , Status.FAIL)
        return next(error);
    }
    
};

module.exports = verifyToken;