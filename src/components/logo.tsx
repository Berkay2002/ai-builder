import Image from 'next/image';
import Link from 'next/link';
import { APP_DISPLAY_NAME } from '@/config/app-config';

export function Logo() {
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
      <span className='font-alt text-xl text-white'>{APP_DISPLAY_NAME}</span>
    </Link>
  );
}
