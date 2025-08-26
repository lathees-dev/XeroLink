const authorizeRole = (roles) => {
    return (req, res, next) => {
        console.log("User role:", req.user);
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }
        next();
    };
};

export default authorizeRole;