import { faker } from '@faker-js/faker';
import React, { useEffect, useState } from 'react';
import Post from './Post';

export interface IPost {
  id: string | number; //* 게시물의 ID
  username: string;
  userImg: string;
  img: string;
  caption: string;
}

function Posts() {
  const [postDatas, setPostDatas] = useState<IPost[]>([]);

  useEffect(() => {
    const fakerData = Array.from({ length: 10 }).map((_) => ({
      id: faker.mersenne.rand(),
      username: faker.name.findName(),
      userImg: faker.image.avatar(),
      img: faker.image.city(800, 800, true),
      caption: faker.lorem.text(),
    }));

    setPostDatas(fakerData);
  }, []);

  return (
    <ul>
      {postDatas.map((item) => (
        <li key={item.id}>
          <Post {...item} />
        </li>
      ))}
    </ul>
  );
}

export default Posts;
