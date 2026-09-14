import { Donation } from '../models/donation.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/api-error.js';
import { buildPagination } from '../utils/pagination.js';

// GET /api/users (admin)
export async function listUsers(req, res) {
  const { page, limit } = req.valid.query;

  const [users, total] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(),
  ]);

  // How much each user on this page has given
  const totals = await Donation.aggregate([
    { $match: { user: { $in: users.map((user) => user._id) }, status: 'completed' } },
    { $group: { _id: '$user', totalDonated: { $sum: '$amount' }, donationCount: { $sum: 1 } } },
  ]);
  const totalsByUser = new Map(totals.map((entry) => [entry._id.toString(), entry]));

  res.json({
    users: users.map((user) => ({
      ...user.toJSON(),
      totalDonated: totalsByUser.get(user.id)?.totalDonated ?? 0,
      donationCount: totalsByUser.get(user.id)?.donationCount ?? 0,
    })),
    pagination: buildPagination({ page, limit }, total),
  });
}

// GET /api/users/:id (admin)
export async function getUser(req, res) {
  const user = await User.findById(req.valid.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ user });
}

// DELETE /api/users/:id (admin)
// Donation records are kept for bookkeeping; they show up as "Deleted user".
export async function deleteUser(req, res) {
  const { id } = req.valid.params;

  if (id === req.user.id) {
    throw new ApiError(400, "You can't delete your own account");
  }

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') {
    throw new ApiError(400, "Admin accounts can't be deleted from the dashboard");
  }

  await user.deleteOne();
  res.status(204).end();
}
