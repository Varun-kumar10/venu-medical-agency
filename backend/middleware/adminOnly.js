module.exports = function (req, res, next) {

    // If no user attached from auth middleware
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    // If role is not admin
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }

    next();
};