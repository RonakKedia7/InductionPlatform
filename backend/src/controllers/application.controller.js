import asyncHandler from 'express-async-handler';
import {Resend} from 'resend';

import {ENV} from '../config/env.js';
import Application from '../models/application.model.js';

const resend = new Resend(ENV.RESEND_API_KEY);

export const submitApplication = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    department,
    year,
    preferredTeam,
    reason,
  } = req.body;

  // Validate required fields
  if (!name || !email || !department || !year || !preferredTeam || !reason) {
    return res.status(400).json({
      message: 'All fields are required.',
    });
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({
    user: req.user._id,
  });

  if (existingApplication) {
    return res.status(409).json({
      message: 'You have already submitted an application.',
    });
  }

  // Create application
  const application = await Application.create({
    user: req.user._id,
    name,
    email,
    department,
    year,
    preferredTeam,
    reason,
  });

  // Send notification email
  try {
    const {data, error} = await resend.emails.send({
      from: ENV.RESEND_FROM_EMAIL,
      to: ENV.CLUB_EMAIL,
      subject: 'New Club Recruitment Application',
      html: `
      <h2>New Recruitment Application</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Department:</strong> ${department}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Preferred Team:</strong> ${preferredTeam}</p>
      <p><strong>Reason:</strong> ${reason}</p>
    `,
    });

    if (error) {
      console.error('Resend Error:', error);
    } else {
      console.log('Email sent successfully:', data.id);
    }
  } catch (error) {
    console.error('Email sending failed:', error);
  }

  return res.status(201).json({
    success: true,
    message: 'Application submitted successfully.',
    application,
  });
});


export const getMyApplication = asyncHandler(async (req, res) => {
  console.log('CHECKING APPLICATION FOR:', {
    id: req.user._id,
    email: req.user.email,
  });

  const application = await Application.findOne({
    user: req.user._id,
  });

  console.log('APPLICATION FOUND:', application?._id || 'NONE');

  if (!application) {
    return res.status(404).json({
      message: 'No application found.',
    });
  }

  return res.status(200).json({
    application,
  });
});
