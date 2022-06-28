import Image from 'next/image';
import React from 'react';

type StoryType = {
  name: string;
  image: string;
};

function Story({ name, image }: StoryType) {
  return (
    <article className="select-none">
      <figure className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-gray-400 ring-offset-2 transition-all  hover:scale-105">
        <Image
          aria-label="추천 회원 아바타"
          className="cursor-pointer rounded-full  "
          src={image}
          objectFit="contain"
          alt="Avatar_Image"
          layout="fill"
        />
      </figure>
      <div className="mt-2 w-12 truncate text-center text-xs font-semibold">
        {name}
      </div>
    </article>
  );
}

export default Story;
