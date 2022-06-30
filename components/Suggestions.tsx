import { faker } from '@faker-js/faker';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Suggestion } from './Stories';

function Suggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const fakeDatas = Array.from({ length: 5 }).map((_) => ({
      id: faker.mersenne.rand(),
      name: faker.name.findName(),
      image: faker.image.avatar(),
      company: faker.company.companyName(),
    }));

    setSuggestions(fakeDatas);
  }, []);

  return (
    <section className="mt-4 ml-10">
      <div className="mb-5 flex justify-between text-sm">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <button className="font-semibold text-gray-600">See All</button>
      </div>

      <ul aria-label="추천 사용자 목록">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            className="mt-3 flex items-center justify-between"
          >
            <figure className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image
                src={suggestion.image}
                layout="fill"
                objectFit="contain"
                alt="avatar image"
              />
            </figure>

            <div className="ml-4 flex-1">
              <h2 className="text-sm font-semibold">{suggestion.name}</h2>
              <h3 className="truncate text-xs text-gray-400">
                Works at {suggestion.company}
              </h3>
            </div>

            <button className="cursor-pointer text-sm text-blue-400">
              Follow
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Suggestions;
