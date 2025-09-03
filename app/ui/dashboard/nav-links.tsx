'use client';

import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation for Course Checksheet App
const links = [
  { name: 'Dashboard', href: '/Dashboard', icon: HomeIcon },
  { name: 'My Courses', href: '/courses', icon: BookOpenIcon },
  { name: 'Progress', href: '/Dashboard/Progress', icon: ChartBarIcon },
  { name: 'Profile', href: '/Dashboard/Profile', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-dark-tertiary p-3 text-sm font-medium hover:bg-accent-50 dark:hover:bg-dark-700 hover:text-accent-600 dark:hover:text-accent-400 text-gray-700 dark:text-gray-300 md:flex-none md:justify-start md:p-2 md:px-3 transition-all duration-200',
              {
                'bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 shadow-sm': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}