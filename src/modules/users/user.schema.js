const success = (data) => ({ success: true, data });
const failure = (errors) => ({ success: false, errors });

export const updateAccountSchema = (req) => {
  const fullname = req.body.fullname?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const errors = [];

  if (!fullname) errors.push({ field: "fullname", message: "Fullname is required" });
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      fullname,
      email,
    },
  });
};

export const changePasswordSchema = (req) => {
  const oldPassword = req.body.oldPassword?.trim();
  const newPassword = req.body.newPassword?.trim();
  const errors = [];

  if (!oldPassword) errors.push({ field: "oldPassword", message: "Old password is required" });
  if (!newPassword) errors.push({ field: "newPassword", message: "New password is required" });
  if (newPassword && newPassword.length < 8) {
    errors.push({ field: "newPassword", message: "New password must be at least 8 characters long" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      oldPassword,
      newPassword,
    },
  });
};
