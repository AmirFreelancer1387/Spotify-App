import express from 'express';
import { loginUsers, myProfile, registerUser } from './controller.js';
import isAuth from './middleware.js';
const routes = express.Router();
routes.post('/user/register', registerUser);
routes.post('/user/login', loginUsers);
routes.get('/user/me', isAuth, myProfile);
export default routes;
//# sourceMappingURL=router.js.map