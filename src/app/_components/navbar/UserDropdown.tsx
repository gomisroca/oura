import Image from 'next/image';
import Link from 'next/link';
import { type Session } from 'next-auth';
import { FaGoogle, FaUser } from 'react-icons/fa6';
import { MdMailOutline } from 'react-icons/md';
import { type Provider } from 'types';

import { getServerAuthSession } from '@/server/auth';

import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

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

const SignedOutDropdown = () => {
  return (
    <Dropdown
      button={{
        name: 'Sign In',
        text: <FaUser size={20} />,
      }}
      className="right-0"
      closeOnChildClick={false}>
      {providers.map((provider) => (
        <li key={provider.name}>
          <SignInButton provider={provider} />
        </li>
      ))}
    </Dropdown>
  );
};

const SignedInDropdown = ({ session }: { session: Session }) => {
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
        <li>
          <Link href="/admin" className="w-full">
            <Button name="Admin" className="w-full">
              Admin
            </Button>
          </Link>
        </li>
      )}
      <li>
        <Link href="/order-history" className="w-full">
          <Button name="Orders" className="w-full">
            Orders
          </Button>
        </Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </Dropdown>
  );
};

async function UserDropdown() {
  const session = await getServerAuthSession();
  if (!session) {
    return <SignedOutDropdown />;
  }
  return <SignedInDropdown session={session} />;
}

export default UserDropdown;
