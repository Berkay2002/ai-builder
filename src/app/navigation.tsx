import Link from 'next/link';
import { IoMenu } from 'react-icons/io5';

import { AccountMenu } from '@/components/account-menu';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { getSession } from '@/features/account/controllers/get-session';

import { signOut } from './(auth)/auth-actions';

export async function Navigation() {
  const session = await getSession();

  return (
    <div className='relative flex items-center gap-6'>
      <nav className='hidden items-center gap-6 text-sm text-neutral-300 lg:flex'>
        <Link href='/' className='hover:text-white'>Product</Link>
        <Link href='#' className='hover:text-white'>Resources</Link>
        <Link href='/pricing' className='hover:text-white'>Pricing</Link>
        <Link href='#' className='hover:text-white'>Enterprise</Link>
      </nav>
      {session ? (
        <AccountMenu signOut={signOut} />
      ) : (
        <>
          <Button variant='secondary' className='hidden flex-shrink-0 lg:flex' asChild>
            <Link href='/signup'>Start Building</Link>
          </Button>
          <Sheet>
            <SheetTrigger className='block lg:hidden'>
              <IoMenu size={28} />
            </SheetTrigger>
            <SheetContent className='w-full bg-black'>
              <SheetHeader>
                <Logo />
                <SheetDescription className='py-8'>
                  <div className='flex flex-col gap-4'>
                    <Link href='/' className='text-left text-neutral-200'>Product</Link>
                    <Link href='#' className='text-left text-neutral-200'>Resources</Link>
                    <Link href='/pricing' className='text-left text-neutral-200'>Pricing</Link>
                    <Link href='#' className='text-left text-neutral-200'>Enterprise</Link>
                    <Button variant='secondary' className='flex-shrink-0' asChild>
                      <Link href='/signup'>Start Building</Link>
                    </Button>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
