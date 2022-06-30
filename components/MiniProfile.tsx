import Image from 'next/image';
import React from 'react';

function MiniProfile() {
  return (
    <section className="mt-14 ml-10 flex items-center justify-between">
      <figure
        aria-label="로그인 한 사용자 아바타"
        className="relative h-16 w-16 overflow-hidden rounded-full"
      >
        <Image
          src={'https://placeimg.com/100/100/any'}
          alt="avatar image"
          objectFit="contain"
          layout="fill"
        />
      </figure>

      <div>
        <h2>Name</h2>
        <h3>Welcome to Nextagram</h3>
      </div>

      <button
        aria-label="로그인 / 로그아웃"
        className="text-sm font-semibold text-blue-400"
      >
        Auth
      </button>
    </section>
  );
}

export default MiniProfile;
