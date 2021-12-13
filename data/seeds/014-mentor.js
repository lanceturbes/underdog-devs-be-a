const dummyData = [
  {
    name: 'Thomas Delford',
    location: 'Montana',
    email: 'thomasdel@thisemail.gg',
    tech_stack: 'Java',
    experience_level: '5 Years',
  },
  {
    name: 'Fatima Robinson',
    location: 'Argentina',
    email: 'robinsonf@thisemail.gg',
    tech_stack: 'Node',
    experience_level: '2 Years',
  },
];
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('mentor')
    .del()
    .then(function () {
      return knex('mentor').insert(dummyData);
    });
};
