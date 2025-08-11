const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;

    console.log("Authorization Header:", req.headers.authorization); // Debug

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract token
            token = req.headers.authorization.split(" ")[1];
            console.log("Extracted Token:", token); // Debug

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); // Debug

            // Fetch user
            req.user = await User.findById(decoded.user.id).select("-password");
            if (!req.user) {
                console.log("User not found in DB");
                return res.status(401).json({ message: "User not found" });
            }

            return next(); // Proceed only if everything is good
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({ message: "Not authorized, invalid or expired token" });
        }
    } else {
        console.log("No Authorization header provided");
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    } else {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
};

module.exports = { protect,admin };
