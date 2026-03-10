const jwt = require("jsonwebtoken");
const redis = require('../config/cache')

const UserMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Token not found" });
        }

        const isBlacklisted = await redis.get(`blacklist:${token}`);

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token is blacklisted"
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = UserMiddleware;
