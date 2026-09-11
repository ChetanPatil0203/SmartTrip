const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePassword = (password) => {
  if (!password || typeof password !== "string") return false;
  return password.length >= 8;
};

const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  if (typeof phone !== "string") return false;
  const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
  return phoneRegex.test(phone.trim());
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
};
