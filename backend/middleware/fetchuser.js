const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Krupeshisagoodb$oy';


const fetchuser = (req, res, next) => {

    // Get the user from JWT token and add  it toreq project
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })

    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;

        next();

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })

    }

}
module.exports = fetchuser;