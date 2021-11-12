export default () => ({
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  },
  iamport: {
    key: process.env.IAMPORT_KEY || '',
    secret: process.env.IAMPORT_SECRET || '',
  },
});
