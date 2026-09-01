const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "schoolos_jwt_secret";

/**
 * Middleware: verifies Bearer JWT token in Authorization header.
 * Attaches decoded payload as req.user = { id, role, email }
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role, email }
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

/**
 * Factory: role guard middleware.
 * Usage: requireRole("admin")  or  requireRole("admin","teacher")
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Not authenticated" });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    };
}

module.exports = { verifyToken, requireRole };
