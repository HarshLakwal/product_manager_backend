import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../../config/index.js'

class JWTService {
    static signToken(payload, expiry = '1d', secret = JWT_SECRET){
        return jwt.sign(payload, secret, {expiresIn: expiry})
    }
}
export default JWTService