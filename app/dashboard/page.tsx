import { currentUser } from '@clerk/nextjs/server';
import DashboardClient from './DashboardClient'; // No change here

// This remains an async Server Component
export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return <div>You are not logged in.</div>;
  }

  // Access the custom metadata
  const metadata = user.unsafeMetadata || {};
  const age = metadata.age as number || 'Not provided';
  const province = metadata.province as string || 'Not provided';
  const district = metadata.district as string || 'Not provided';
  const program = metadata.program as string || 'Not provided';

  // --- SOLUTION ---
  // Create a new, "plain" object with only the data you need to pass.
  // This object is serializable and safe to send to a Client Component.
  const simpleUser = {
    id: user.id,
    firstName: user.firstName,
    username: user.username,
  };

  return (
    // Pass the new, simple object as the 'user' prop
    <DashboardClient
      user={simpleUser}
      age={age}
      province={province}
      district={district}
      program={program}
    />
  );
}