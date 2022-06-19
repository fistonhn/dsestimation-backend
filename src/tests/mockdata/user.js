export const validUserLogin = {
  email: "test@test.com",
  password: "12345678",
};

export const validUserSignup = {
  name: "test",
  email: "test@test.com",
  password: "$2a$10$5v6kRiwA/34Qyd5SMdev0OzWsYAsRbR7ylVB9TfNNWt6K77mEsWRK",
  isConfirmed: true,
  role: "admin",
};

export const moderatorSignup = {
  name: "owner",
  email: "moderator@test.com",
  password: "$2a$10$5v6kRiwA/34Qyd5SMdev0OzWsYAsRbR7ylVB9TfNNWt6K77mEsWRK",
  isConfirmed: true,
  role: "owner",
};
export const regularUserSignup = {
  name: "manager",
  email: "regulartest@test.com",
  password: "$2a$10$5v6kRiwA/34Qyd5SMdev0OzWsYAsRbR7ylVB9TfNNWt6K77mEsWRK",
  isConfirmed: true,
  role: "manager",
};
export const regularUserLogin = {
  email: "regulartest@test.com",
  password: "12345678",
};
export const moderatorLogin = {
  email: "moderator@test.com",
  password: "12345678",
};
export const loginWithNoEmail = {
  password: "12345678",
};
export const loginWithNoPassword = {
  email: "test@test.com",
};
export const loginWithWrongPassword = {
  email: "test@test.com",
  password: "1234567",
};
export const loginWithWrongEmail = {
  email: "invalid@test.com",
  password: "12345678",
};

export const signupUser = {
  name: "test",
  email: "testplain@test.com",
  password: "1234567890",
};

export const signupWithNoname = {
  email: "test@test.com",
  password: "12345678",
};

export const signupWithNoEmail = {
  name: "test",
  password: "12345678",
};

export const signupWithNoPassword = {
  name: "test",
  email: "test@test.com",
};
