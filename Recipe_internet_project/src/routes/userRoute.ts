import { Router, Response } from "express";
import User from "../model/userModel";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /user/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               profilePic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/update-profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized: No user ID found" });

    const { profilePic, username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic, username },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json(updatedUser);
  } catch {
    res.status(500).json({ error: "Server error updating profile" });
  }
});

export default router;