import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import SignOutButton from './SignOutButton';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white dark:bg-dark-secondary border-r border-gray-200 dark:border-dark-primary">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-800 dark:to-accent-900 p-4 md:h-40 shadow-lg hover:shadow-xl transition-all duration-200"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-dark-tertiary md:block"></div>
        <SignOutButton />
      </div>
    </div>
  );
}
