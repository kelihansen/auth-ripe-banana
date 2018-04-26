module.exports = function(requiredRole) {
    return (req, res, next) => {
        if(!req.account.roles.includes(requiredRole)) {
            next({
                status: 403,
                error: `requires ${requiredRole} role`
            });
        }
        else next();
    };
};