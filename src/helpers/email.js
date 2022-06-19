import sgMail from "@sendgrid/mail";
import mailgen from "mailgen";
import dotenv from "dotenv";

dotenv.config();

const template = new mailgen({
  theme: "default",
  product: {
    name: "DS ESTIMATION",
    link: "https://dsestimation.com/",
    logo: "https://dsestimation.com/wp-content/uploads/2021/09/REVISED-WEB-LOGO-scaled-1536x1536.jpg",
  },
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const host = process.env.APP_URL;
const passwordResetURL = (user, token) =>
  `${host}/api/user/reset-password/url?token=${token}&email=${user.email}`;
const emailVerifytURL = (token) =>
  `${host}/api/user/verify/signup?token=${token}`;
const emailVerifytStaffURL = (token) =>
  `${host}/api/user/staff/accept/verify?token=${token}`;
const generateEmail = (name, instructions, link) => ({
  body: {
    name,
    intro: "We're very excited to have you on board.",
    action: {
      instructions,
      button: {
        color: "#22BC66", // Optional action button color
        text: "Confirm your account",
        link,
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
});

const generateInvitationEmail = (name, instructions, link) => ({
  body: {
    name,
    intro: "We're very excited to have you on board.",
    action: {
      instructions,
      button: {
        color: "#22BC66", // Optional action button color
        text: "Accept Invitation",
        link,
      },
    },
    outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
});

const generateforgotPasswordEmail = (name, instructions, link) => ({
  body: {
    name,
    action: {
      instructions,
      button: {
        color: "#FF0000", // Optional action button color
        text: "Change Password",
        link,
      },
    },
  },
});
const confirmUserTemplate = async (user, url, message) => {
  const emailBody = generateEmail(`${user.name}!`, message, `${url}`);
  const emailTemplate = template.generate(emailBody);

  const msg = {
    to: user.email,
    from: "ndatigilbert@gmail.com",
    subject: "Verify Your Email",
    html: emailTemplate,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    return "Internal server error";
  }
};

const confirmStaffTemplate = async (user, url, message) => {
  const emailBody = generateInvitationEmail(`${user.name}!`, message, `${url}`);
  const emailTemplate = template.generate(emailBody);

  const msg = {
    to: user.email,
    from: "ndatigilbert@gmail.com",
    subject: "Accept Invitation",
    html: emailTemplate,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    return "Internal server error";
  }
};

const forgotPasswordTemplate = async (user, url, message) => {
  const emailBody = generateforgotPasswordEmail(
    `${user.name}! You have requested to change your password`,
    message,
    `${url}`
  );
  const emailTemplate = template.generate(emailBody);

  const msg = {
    to: user.email,
    from: "ndatigilbert@gmail.com",
    subject: "Change Password Request",
    html: emailTemplate,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    return "Internal server error";
  }
};


export {
  confirmUserTemplate,
  emailVerifytURL,
  passwordResetURL,
  forgotPasswordTemplate,
  confirmStaffTemplate,
  emailVerifytStaffURL,
};
