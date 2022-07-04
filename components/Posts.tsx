import { faker } from '@faker-js/faker';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
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

  const [posts, setPosts] = useState<any>([]);

  useEffect(() => {
    const queryOptions = [
      orderBy('timestamp', 'desc'),
      startAfter('u2M145NnUjJ6PASD6iZ9'),
      limit(100),
    ];

    const unSubscirbed = onSnapshot(
      query(collection(db, 'posts'), ...queryOptions),
      (snapshot) => {
        setPosts(snapshot.docs);
        console.log(snapshot.docs[1].id);
      }
    );

    return unSubscirbed;
  }, []);

  console.log('포스트: ', posts);

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
