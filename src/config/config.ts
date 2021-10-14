export default () => ({
  database: {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    name: process.env.DB_NAME || '',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || '',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  },
});
