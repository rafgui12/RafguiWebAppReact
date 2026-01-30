const admin = require('firebase-admin');

// 1. Initialize Firebase Admin
// We expect the service account JSON to be in the FIREBASE_SERVICE_ACCOUNT env var
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error('Error: FIREBASE_SERVICE_ACCOUNT environment variable is missing.');
    process.exit(1);
}

if (!process.env.FIREBASE_DATABASE_URL) {
    console.error('Error: FIREBASE_DATABASE_URL environment variable is missing.');
    process.exit(1);
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (e) {
    console.error('Error: Could not parse FIREBASE_SERVICE_ACCOUNT as JSON.', e);
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();
const BLOG_DATA_PATH = 'blogData';

async function cleanupOldIps() {
    console.log('Starting IP cleanup...');
    const now = Date.now();
    const RETENTION_MS = 72 * 60 * 60 * 1000; // 72 hours
    const cutoffTime = now - RETENTION_MS;

    const updates = {};
    let cleanCount = 0;

    try {
        const snapshot = await db.ref(BLOG_DATA_PATH).once('value');
        const blogData = snapshot.val();

        if (!blogData) {
            console.log('No blog data found.');
            process.exit(0);
        }

        // Iterate through posts
        Object.keys(blogData).forEach(postId => {
            const post = blogData[postId];
            if (post.comments) {
                // Iterate through comments
                Object.keys(post.comments).forEach(commentId => {
                    const comment = post.comments[commentId];

                    if (comment.userIp) {
                        const commentTime = new Date(comment.createdAt).getTime();

                        // Check if older than retention period
                        if (commentTime < cutoffTime) {
                            // Mark IP for deletion (set to null)
                            // Path: blogData/{postId}/comments/{commentId}/userIp
                            const path = `${BLOG_DATA_PATH}/${postId}/comments/${commentId}/userIp`;
                            updates[path] = null;
                            cleanCount++;
                            console.log(`[PLAN] Will delete IP for comment ${commentId} (Age: ${((now - commentTime) / 3600000).toFixed(1)}h)`);
                        }
                    }
                });
            }
        });

        if (cleanCount > 0) {
            console.log(`Executing updates... Removing IPs from ${cleanCount} comments.`);
            await db.ref().update(updates);
            console.log('Cleanup complete.');
        } else {
            console.log('No comments found exceeding the 72h retention period with IPs stored.');
        }

        process.exit(0);

    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

cleanupOldIps();
