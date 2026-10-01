export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || !String(value).trim()) {
    return `${fieldName} is required`;
  }

  return '';
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return '';
};
