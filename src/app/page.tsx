import { getServerAuthSession } from '@/server/auth';

export default async function Home() {
  const session = await getServerAuthSession();
  return session ? <p>You are signed in as {session.user.name}</p> : <p>You are not signed in</p>;
}
