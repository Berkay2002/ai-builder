import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { PricingSection } from '@/features/pricing/components/pricing-section';

export default async function HomePage() {
  return (
    <div className='flex flex-col gap-8 lg:gap-32'>
      <HeroSection />
      <PricingSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className='relative overflow-hidden rounded-lg bg-[radial-gradient(80%_120%_at_100%_0%,rgba(255,165,0,0.25),transparent_50%),radial-gradient(80%_120%_at_0%_100%,rgba(147,197,253,0.25),transparent_50%)] py-24 lg:py-40'>
      <Container className='relative z-10 flex flex-col items-center gap-6 text-center'>
        <h1 className='text-5xl leading-tight text-white lg:text-7xl'>
          Let’s make your dream a <span className='text-lime-300'>reality</span>. <br /> Right now.
        </h1>
        <p className='max-w-2xl text-neutral-300'>
          Build fully‑functional apps in minutes with just your words. No coding necessary.
        </p>
        <div className='mt-4 w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur'>
          <div className='flex items-center gap-3 rounded-xl bg-black/50 p-3'>
            <input
              placeholder='What do you want to build?'
              className='flex-1 bg-transparent text-sm text-neutral-200 outline-none placeholder:text-neutral-500'
            />
            <Button asChild variant='sexy'>
              <Link href='/signup' aria-label='Start'>Start</Link>
            </Button>
          </div>
          <div className='mt-3 flex flex-wrap gap-2 text-xs text-neutral-400'>
            <span className='mr-2'>Not sure where to start? Try one of these:</span>
            <Chip>Reporting Dashboard</Chip>
            <Chip>Gaming Platform</Chip>
            <Chip>Onboarding Portal</Chip>
            <Chip>Networking App</Chip>
            <Chip>Room Visualizer</Chip>
          </div>
        </div>
      </Container>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]' />
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-400'>{children}</span>
  );
}
