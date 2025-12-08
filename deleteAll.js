import { createClerkClient } from '@clerk/backend';
import 'dotenv/config';

// Initialize Clerk Client
// Make sure CLERK_SECRET_KEY is in your .env file or passed in the environment
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function deleteAllUsers() {
  console.log("Starting deletion process...");
  
  while (true) {
    // 1. Fetch a batch of users (Limit is usually 500 max)
    const response = await clerkClient.users.getUserList({
      limit: 500,
    });
    
    const users = response.data;

    // 2. If no users are left, break the loop
    if (users.length === 0) {
      console.log("No users left to delete.");
      break;
    }

    console.log(`Found batch of ${users.length} users. Deleting...`);

    // 3. Delete each user in the batch
    for (const user of users) {
      try {
        await clerkClient.users.deleteUser(user.id);
        console.log(`Deleted user: ${user.id}`);
      } catch (err) {
        console.error(`Failed to delete user ${user.id}:`, err.errors?.[0]?.message || err.message);
      }
    }
    
    // Optional: Add a small delay to avoid hitting rate limits if you have thousands of users
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("All users deleted.");
}

deleteAllUsers();