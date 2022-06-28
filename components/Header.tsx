import Image from 'next/image';
import { HomeIcon, MenuIcon, SearchIcon } from '@heroicons/react/solid';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className=" flex h-16 max-w-6xl items-center justify-between px-2 shadow-sm lg:mx-auto">
        {/* left */}
        <section>
          <figure className="relative hidden h-10 w-24 cursor-pointer md:inline-block">
            <Image
              src={'https://links.papareact.com/ocw'}
              objectFit="contain"
              layout="fill"
              alt="Logo Image"
              loading="lazy"
            />
          </figure>
          <figure className="relative h-10 w-10 flex-shrink-0 cursor-pointer md:hidden">
            <Image
              src="https://links.papareact.com/jjm"
              layout="fill"
              objectFit="contain"
              alt="Logo-small"
              priority
            />
          </figure>
        </section>

        {/* search */}
        <section>
          <form className="relative w-44 md:w-60 ">
            <input
              type="search"
              className="peer form-input block w-full rounded-md border-gray-400 pl-10 outline-none focus:border-gray-400 focus:pl-3  focus:ring-0   "
              placeholder="Search.."
            />
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 w-5 -translate-y-1/2 items-center text-gray-500 peer-focus:hidden" />
          </form>
        </section>

        {/* right */}
        <nav className="flex items-center justify-between">
          <HomeIcon className="navBtn" />
          <MenuIcon className="h-8 cursor-pointer md:hidden" />
        </nav>
      </div>
    </header>
  );
}

export default Header;
