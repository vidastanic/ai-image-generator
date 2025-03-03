import Router from 'express';
import {registerUser, loginUser, validateToken} from '../controllers';

export const router = Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/validate', validateToken);
