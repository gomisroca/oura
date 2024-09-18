import { getServerAuthSession } from '@/server/auth';
import SignInButton from './_components/SignInButton';
import SignOutButton from './_components/SignOutButton';
import { FaGoogle } from 'react-icons/fa6';
import { MdMailOutline } from 'react-icons/md';
import ThemeButton from './_components/ThemeButton';

const providers: Provider[] = [
  {
    name: 'google',
    icon: <FaGoogle className="mr-2 h-5 w-5" />,
  },
  {
    name: 'email',
    icon: <MdMailOutline className="mr-2 h-5 w-5" />,
  },
];

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <ThemeButton />
        {providers.map((provider) => (
          <SignInButton key={provider.name} provider={provider} />
        ))}
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>You are signed in as {session.user.email}</p>
        <SignOutButton />
      </main>
    );
  }
}
