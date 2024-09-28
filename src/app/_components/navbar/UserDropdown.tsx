import Link from 'next/link';
import Image from 'next/image';
import { getServerAuthSession } from '@/server/auth';
import { MdMailOutline } from 'react-icons/md';
import { FaGoogle, FaUser } from 'react-icons/fa6';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import { type Provider } from 'types';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import { type Session } from 'next-auth';

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

const SignedInDropdown = () => {
  return (
    <Dropdown
      button={{
        name: 'Sign In',
        text: <FaUser size={20} />,
      }}
      className="right-0"
      closeOnChildClick={false}>
      {providers.map((provider) => (
        <SignInButton key={provider.name} provider={provider} />
      ))}
    </Dropdown>
  );
};

const SignedOutDropdown = ({ session }: { session: Session }) => {
  return (
    <Dropdown
      button={{
        name: 'Sign Out',
        text: session.user.image ? (
          <Image src={session.user.image} alt="user" width={20} height={20} />
        ) : (
          <FaUser size={20} />
        ),
      }}
      className="right-0 w-max"
      closeOnChildClick={false}>
      {session.user.role === 'ADMIN' && (
        <Link href="/admin" className="w-full">
          <Button name="Admin" className="w-full">
            Admin
          </Button>
        </Link>
      )}
      <SignOutButton />
    </Dropdown>
  );
};

async function UserDropdown() {
  const session = await getServerAuthSession();
  if (!session) {
    return <SignedInDropdown />;
  }
  return <SignedOutDropdown session={session} />;
}

export default UserDropdown;
