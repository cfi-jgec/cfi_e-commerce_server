import express from 'express'; 
import authentication from '../middleware/authentication';
import { addProducts, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/products.controller';
const router = express.Router();

// get all reviews
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/create').post(authentication, addProducts);
router.route('/update/:id').patch(authentication, updateProduct);
router.route('/delete/:id').post(authentication, deleteProduct);

export default router;