export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-form-submissions/send',
      handler: 'contact-form-submission.send',
      config: {
        auth: false,
      },
    },
  ],
};
