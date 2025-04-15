import Leave from "../models/leaveModel.js"; 

export const requestLeave = async (req, res) => {
  try {
    const { reason, from, to, employeeId, fullName } = req.body;

    if (!reason || !from || !to || !employeeId || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLeave = await Leave.create({
      reason,
      from,
      to,
      employeeId,
      fullName,
      status: "Pending",
      user: req.user._id,
      email: req.user.email,
    });

    res.status(201).json(newLeave);
  } catch (error) {
    res.status(500).json({ message: "Leave request failed", error: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = status;
    await leave.save();

    res.json({ message: `Leave request ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update leave status" });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ email: req.user.email }); // or userId, depending on your model
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching my leaves:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
