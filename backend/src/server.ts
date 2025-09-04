import express from 'express';
import routes from '@/routes';
import admin from 'firebase-admin';

const app = express();

app.use(routes());

const PORT = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;