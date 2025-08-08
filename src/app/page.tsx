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
    <section className='relative overflow-hidden rounded-lg bg-gradient-to-br from-[#C8C7E8] via-[#C9D0EE] to-[#F4B08A] py-24 lg:py-40'>
      <div className='absolute inset-0 bg-white/40 mix-blend-overlay' />
      <Container className='relative z-10 flex flex-col items-center gap-6 text-center'>
        <h1 className='text-5xl leading-tight text-white lg:text-7xl'>
          Let’s make your dream a <span className='text-lime-300'>reality</span>. <br /> Right now.
        </h1>
        <p className='max-w-2xl text-neutral-700'>
          Build fully‑functional apps in minutes with just your words. No coding necessary.
        </p>
        <div className='mt-4 w-full max-w-3xl rounded-2xl border border-black/10 bg-white/60 p-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] backdrop-blur'>
          <div className='flex items-center gap-3 rounded-xl bg-white p-3'>
            <input
              placeholder='What do you want to build?'
              className='flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-500'
            />
            <button className='rounded-lg bg-[#FEE4A2] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#ffe08b]'>
              Start Building
            </button>
          </div>
          <div className='mt-3 flex flex-wrap gap-2 text-xs text-neutral-600'>
            <span className='mr-2'>Not sure where to start? Try one of these:</span>
            <Chip>Reporting Dashboard</Chip>
            <Chip>Gaming Platform</Chip>
            <Chip>Onboarding Portal</Chip>
            <Chip>Networking App</Chip>
            <Chip>Room Visualizer</Chip>
          </div>
        </div>
      </Container>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_0%,rgba(255,255,255,0.6),transparent_60%)]' />
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-400'>{children}</span>
  );
}
