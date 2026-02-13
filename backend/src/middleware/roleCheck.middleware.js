export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized. Please login."
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Forbidden. You do not have access to this resource."
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Authorization error",
                error: error.message
            });
        }
    };
};
