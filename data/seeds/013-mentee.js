const dummyData = [
  {
    name: 'Chryselda Ramos',
    location: 'Pennsylvania',
    email: 'cramos@thisemail.gg',
  },
  {
    name: 'Alegra Jefferson',
    location: 'Bangladesh',
    email: 'alegraj@thisemail.gg',
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('mentee')
    .del()
    .then(function () {
      return knex('mentee').insert(dummyData);
    });
};
