import Image from 'next/image';
import { MenuIcon, SearchIcon } from '@heroicons/react/solid';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  HeartIcon,
  HomeIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../store/modalAtom';

function Header() {
  const { data: session } = useSession();
  const setShowModal = useSetRecoilState(modalState);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className=" flex h-16 max-w-6xl items-center justify-between px-2 shadow-sm lg:mx-auto">
        {/* left */}
        <section aria-label="로고">
          <figure className="relative hidden h-10 w-24 cursor-pointer md:inline-block">
            <Image
              src="/assets/Instagram_logo.png"
              objectFit="contain"
              layout="fill"
              alt="Logo Image"
              priority
            />
          </figure>
          <figure className="relative h-10 w-10 flex-shrink-0 cursor-pointer md:hidden">
            <Image
              src="/assets/insta-logo.png"
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
        <nav className="flex items-center justify-between space-x-4">
          <HomeIcon className="navBtn" />
          <MenuIcon className="h-8 cursor-pointer md:hidden" />

          {session ? (
            <>
              <div className="navBtn relative">
                <PaperAirplaneIcon className="navBtn rotate-45" />
                <div
                  className="absolute -top-1 -right-2 grid h-5 w-5 animate-pulse
                  place-items-center rounded-full bg-red-500  text-xs text-white
                "
                >
                  3
                </div>
              </div>
              <PlusCircleIcon
                aria-label="이미지 업로드 버튼"
                onClick={() => setShowModal((prev) => !prev)}
                className="navBtn"
              />
              <UserGroupIcon className="navBtn" />
              <HeartIcon className="navBtn" />

              <figure className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full transition hover:scale-125">
                <Image
                  aria-label="로그아웃 버튼"
                  src={session.user?.image as string}
                  onClick={() => signOut()}
                  objectFit="cover"
                  layout="fill"
                  alt="avatar image"
                />
              </figure>
            </>
          ) : (
            <>
              <button onClick={() => signIn()} className="">
                Sign In
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
