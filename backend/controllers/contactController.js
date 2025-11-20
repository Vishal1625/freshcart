import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, company, title, email, phone, comments } = req.body;

    // Save to MongoDB
    const contact = await Contact.create({
      firstName,
      lastName,
      company,
      title,
      email,
      phone,
      comments,
    });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.OWNER_EMAIL,
        pass: process.env.OWNER_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.OWNER_EMAIL,
      subject: `📝 New Retailer Inquiry from ${firstName} ${lastName}`,
      html: `
        <h2>Retailer Inquiry</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Company:</b> ${company}</p>
        <p><b>Title:</b> ${title}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Comments:</b> ${comments}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Inquiry submitted successfully!", contact });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
