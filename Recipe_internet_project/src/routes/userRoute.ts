import { Router, Request, Response } from 'express';
import User from '../model/userModel';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware'; 

const router = Router();

// שים לב: שינינו כאן ל- '/update-profile' בלבד
router.put('/update-profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log("Request Body:", req.body); 
    
    // התיקון הקריטי: שולפים את ה-ID בדיוק כמו שהמידלוור שלך שמר אותו!
    const userId = req.user?._id;
    console.log("User ID:", userId); 

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID found' });
    }

    const { profilePic, username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic, username },
      { new: true } // מחזיר את המסמך המעודכן
    ).select('-password'); // עדיף לא להחזיר את הסיסמה ל-Frontend

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update-profile route:", error); 
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;