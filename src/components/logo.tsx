import Image from 'next/image';
import Link from 'next/link';

import { APP_DISPLAY_NAME } from '@/config/app-config';

type LogoProps = {
  variant?: 'light' | 'dark';
};

export function Logo({ variant = 'light' }: LogoProps) {
  return (
    <Link href='/' className='flex w-fit items-center gap-2'>
      <Image
        src='/logo.png'
        width={40}
        height={40}
        priority
        quality={100}
        alt={`${APP_DISPLAY_NAME} logo mark`}
      />
      <span className={`font-alt text-xl ${variant === 'dark' ? 'text-neutral-900' : 'text-white'}`}>
        {APP_DISPLAY_NAME}
      </span>
    </Link>
  );
}
