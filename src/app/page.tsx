import { Poppins } from 'next/font/google'
import FooterCard from '@/components/footer'
import HeroSearch from '@/components/hero-search'
import Navbar from '@/components/navbar'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })

export default function Page() {
  return (
    <main className="relative min-h-screen text-[#111111]">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(135deg,_#b8b6d4_0%,_#b6c0df_35%,_#f6b997_100%)]" />
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:pt-24 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className={`${poppins.className} mx-auto font-normal text-[#111111] tracking-[-0.02em] leading-snug drop-shadow-none text-4xl sm:text-5xl md:text-[3.4rem]`}>
            {"Let's make your dream a "}
            <span className="text-[#E9F599]">reality.</span>
            <br />
            <span className={`${poppins.className} mx-auto font-normal text-[#111111] tracking-[-0.02em] leading-snug text-4xl sm:text-5xl md:text-[3.4rem]`}>
              {"Right now."}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg font-normal text-gray-700 leading-relaxed">
            Novu lets you build fully-functional apps in minutes with just your words. No coding necessary.
            <span className="ml-1 inline-block h-2 w-2 rounded-full bg-violet-400 align-middle animate-pulse" aria-hidden />
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <HeroSearch />
        </div>

        <div className="mt-64 md:mt-80">
          <FooterCard />
        </div>
      </section>
    </main>
  )
}
