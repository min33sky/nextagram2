import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import Story from './Story';

export type Suggestion = {
  id: number;
  name: string;
  image: string;
  company?: string;
};

function Stories() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const fakerMembers = Array.from({ length: 20 }).map((_) => ({
      id: faker.mersenne.rand(),
      name: faker.name.findName(),
      image: faker.image.avatar(),
    }));

    setSuggestions(fakerMembers);
  }, []);

  return (
    <section
      aria-label="추천 회원 목록"
      className="scrollb mt-8 flex space-x-4 overflow-x-scroll rounded-sm border border-gray-200 bg-white p-6 shadow-md scrollbar-thin scrollbar-thumb-gray-100  hover:scrollbar-thumb-gray-800 "
    >
      {suggestions.map((item) => (
        <Story key={item.id} image={item.image} name={item.name} />
      ))}
    </section>
  );
}

export default Stories;
