import express from 'express';
import { authenticateToken } from './authRoutes.js'
import {requireAdmin} from '../middleware/auth.js'

const router = express.Router();


// Middleware lock applied to all admin routes
router.use(authenticateToken, requireAdmin);

router.post('/items', async (req, res, next) => { /* Add item logic */
    try {
        const itemData = { ...req.body };
    
        // Generate a custom _id from the name if one wasn't provided
        if (!itemData.title && itemData.name) {
          itemData.title = itemData.name.trim().toLowerCase();
        }
    
        const newitem = new Item(itemData);
        const savedItem = await newItem.save();
        res.status(201).json({ success: true, data: savedItem });
      } catch (err) {
        console.error('Create skill failed:', err.message);
    
        // Duplicate _id or name
        if (err.code === 11000) {
          return res.status(409).json({ success: false, error: 'A skill with that name or ID already exists.' });
        }
    
        next(err);
      }
 });
router.delete('/items/:id', async (req, res, next) => { /* Delete item logic */ 

});
router.patch('/items/:id/approve', async (req, res, next) => { /* Approve logic */ 

});

export default router;