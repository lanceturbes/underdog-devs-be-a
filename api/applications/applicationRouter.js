const express = require('express');
const authRequired = require('../middleware/authRequired');
const Application = require('./applicationModel');
const Profile = require('../profile/profileModel');
const router = express.Router();
// const jwt = require('jwt-decode');
const { adminRequired } = require('../middleware/permissionsRequired.js');
const {
  cacheSignUpData,
  checkApplicationExists,
  checkRole,
} = require('../middleware/applicationMiddleware');
const { createProfile } = require('../middleware/profilesMiddleware');

const { registerOktaUser } = require('../middleware/oktaAuth');

/**
 * @swagger
 * components:
 *  schemas:
 *    Application:
 *      type: object
 *      required:
 *        - position
 *        - profile_id
 *      properties:
 *        application_id:
 *          type: integer
 *          description: Unique primary key referencing the application's numeric ID
 *        position:
 *          type: integer
 *          description: Foreign key referencing a numeric role ID for an applicant's desired position
 *        profile_id:
 *          type: string
 *          description: Foreign key referencing the applicant's profile ID
 *        approved:
 *          type: boolean
 *          description: Status of whether or not an application has been approved - defaults to false
 *        created_at:
 *          type: timestamp
 *          description: Record of an application's creation time
 *      example:
 *        application_id: 1
 *        position: 4
 *        profile_id: '10'
 *        approved: false
 *        created_at: "2021-11-01T17:59:02.023Z"
 */

// get all pending application tickets

router.get('/', authRequired, adminRequired, (req, res, next) => {
  Application.getPendingTickets()
    .then((applicationList) => {
      res.status(200).json(applicationList);
    })
    .catch(next);
});

// get pending application tickets by role

router.get('/:role', authRequired, adminRequired, (req, res, next) => {
  Application.getPendingTicketsByRole(req.params.role)
    .then((applicationList) => {
      res.status(200).json(applicationList);
    })
    .catch(next);
});

// get application by profile id

router.get('/profileId/:id', checkApplicationExists, checkRole, (req, res) => {
  res.status(200).json(req.intakeData);
});

// create a new application for user upon completion of /mentor, /mentee signup form

router.post('/new/:role', createProfile, cacheSignUpData, (req, res, next) => {
  const applicationTicket = {
    profile_id: req.body.profile_id,
    position: req.body.position,
  };
  Application.add(applicationTicket)
    .then(() => {
      res.status(201).json({ message: 'Application has been submitted' });
    })
    .catch(next);
});

// update the role_id for the profile of the applicant and update the application approved value to true

router.put('/update-role', authRequired, adminRequired, (req, res, next) => {
  const profile_id = req.body.profile_id;
  const application_id = req.body.application_id;
  const role_id = req.body.position;
  Profile.update(profile_id, { role_id: role_id })
    .then(() => {
      Application.updateTicket(application_id, { approved: true })
        .then(() => {
          res.status(202).json({
            message:
              'This application has been approved, and User role has been updated',
          });
        })
        .catch(next);
    })
    .catch(next);
});

// update applicants approved status and creates new user with okta

router.put(
  '/register/:id',
  authRequired,
  checkApplicationExists,
  checkRole,
  registerOktaUser,
  (req, res, next) => {
    const application_id = req.body.application_id;
    Application.updateTicket(application_id, { approved: true })
      .then(() => {
        res.status(202).json({
          message:
            'This application has been approved and registration process is under way..',
        });
      })
      .catch(next);
  }
);

module.exports = router;
