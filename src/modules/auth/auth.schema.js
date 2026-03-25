const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

const success = (data) => ({ success: true, data });
const failure = (errors) => ({ success: false, errors });

export const registerSchema = (req) => {
  const fullname = req.body.fullname?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const username = req.body.username?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const errors = [];

  if (!fullname) errors.push({ field: "fullname", message: "Fullname is required" });
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (email && !isEmail(email)) errors.push({ field: "email", message: "Email is invalid" });
  if (!username) errors.push({ field: "username", message: "Username is required" });
  if (!password) errors.push({ field: "password", message: "Password is required" });
  if (password && password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters long" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      fullname,
      email,
      username,
      password,
    },
  });
};

export const loginSchema = (req) => {
  const email = req.body.email?.trim().toLowerCase();
  const username = req.body.username?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const errors = [];

  if (!email && !username) {
    errors.push({ field: "identity", message: "Username or email is required" });
  }

  if (email && !isEmail(email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (errors.length > 0) {
    return failure(errors);
  }

  return success({
    body: {
      email,
      username,
      password,
    },
  });
};
