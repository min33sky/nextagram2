import { faker } from '@faker-js/faker';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { isObject } from 'util';
import { db } from '../firebase';
import Post from './Post';

export interface IPost {
  id: string; //* 게시물의 ID
  username: string;
  profileImg: string;
  image: string;
  caption: string;
  createdAt: string;
}

function Posts() {
  // const [postDatas, setPostDatas] = useState<IPost[]>([]);

  // useEffect(() => {
  //   const fakerData = Array.from({ length: 10 }).map((_) => ({
  //     id: faker.mersenne.rand(),
  //     username: faker.name.findName(),
  //     userImg: faker.image.avatar(),
  //     img: faker.image.city(800, 800, true),
  //     caption: faker.lorem.text(),
  //   }));

  //   setPostDatas(fakerData);
  // }, []);

  const [postDatas, setPostDatas] = useState<IPost[]>([]);
  const [lastDoc, setLastDoc] = useState<any>();
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSnapshot = useCallback(
    (snapshot: QuerySnapshot<DocumentData>, isInit?: boolean) => {
      const data: DocumentData[] = [];

      snapshot.forEach((doc) =>
        data.push({
          id: doc.id,
          ...doc.data(),
        })
      );

      setPostDatas((prev: any) => (isInit ? data : [...prev, ...data]));
      setLastDoc(snapshot.docs.at(-1));

      if (data.length === 0) {
        console.log('데이터 끝');
        setIsLast(true);
      }
    },
    []
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      const snapshot = await getDocs(
        query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3))
      );

      handleSnapshot(snapshot, true);
      setLoading(false);
    })();
  }, [handleSnapshot]);

  const fetchMore = async () => {
    if (isLast) return;

    setLoading(true);
    const snapshot = await getDocs(
      query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(3)
      )
    );

    handleSnapshot(snapshot, false);
    setLoading(false);
  };

  // console.log('postDatas: ', postDatas);
  // console.log('마지막: ', lastDoc);

  // console.log('PostDatas: ', postDatas);

  return (
    <ul>
      {postDatas.length > 0 &&
        postDatas.map((item) => (
          <li key={item.id}>
            <Post
              id={item.id}
              image={item.image}
              caption={item.caption}
              profileImg={item.profileImg}
              username={item.username}
              createdAt={item.createdAt}
            />
          </li>
        ))}
      <button onClick={fetchMore}>더 가져오기</button>
    </ul>
  );
}

export default Posts;
