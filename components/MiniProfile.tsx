import { useSession, signOut, signIn } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

function MiniProfile() {
  const { data: session } = useSession();

  return (
    <section className="mt-14 ml-10 flex items-center justify-between">
      <figure
        aria-label="로그인 한 사용자 아바타"
        className="relative h-16 w-16 overflow-hidden rounded-full"
      >
        <Image
          src={session?.user?.image || 'https://placeimg.com/100/100/any'}
          alt="avatar image"
          objectFit="contain"
          layout="fill"
        />
      </figure>

      <section className="mx-4 flex-1">
        <h2 className="font-bold">{session?.user?.name}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Nextagram</h3>
      </section>

      <button
        aria-label="로그인 / 로그아웃"
        onClick={() => {
          session ? signOut() : signIn();
        }}
        className="text-sm font-semibold text-blue-400"
      >
        {session ? 'Sign Out' : 'Sign In'}
      </button>
    </section>
  );
}

export default MiniProfile;
