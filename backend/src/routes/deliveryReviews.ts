import { Router } from 'express';
import { submitDeliveryReview ,getDeliveryReview} from '../controllers/deliveryReviews';

const router = Router();
router.post('/delivery-reviews', submitDeliveryReview);
router.get('/delivery-reviews/:orderId', getDeliveryReview);
export default router;
