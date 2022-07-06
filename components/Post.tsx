import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { IPost } from './Posts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

type Formdata = {
  comment: string;
};

/**
 * 포스트 컴포넌트
 * @param param0
 * @returns
 */
export default function Post({
  id,
  caption,
  image,
  profileImg,
  username,
}: IPost) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]); //? 댓글 리스트

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Formdata>();

  /**
   ** 댓글 등록 핸들러
   */
  const onValid: SubmitHandler<Formdata> = async ({ comment }) => {
    if (!comment || comment.trim() === '') return;
    setLoading(true);

    if (session) {
      await addDoc(collection(db, 'posts', id, 'comments'), {
        comment: comment,
        username: session.user?.username,
        profileImg: session.user?.image,
        createdAt: serverTimestamp(),
      });
    }

    setLoading(false);
    setValue('comment', '');
  };

  /**
   *? 댓글 데이터를 감시하는 리스너
   *? 리스너가 unsubscribe 함수를 리턴하기 때문에 cleanup 함수 처리부분에 위치시켰다.
   */
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('createdAt', 'desc')
        ),
        (snapshot) => {
          setComments(snapshot.docs);
        }
      ),
    [id]
  );

  /**
   ** 좋아요 버튼 핸들러
   */
  const toggleLikePost = async () => {
    if (session?.uid) {
      if (hasLiked) {
        // 좋아요 취소
        await deleteDoc(doc(db, 'posts', id, 'likes', session.uid));
      } else {
        // 좋아요 성공
        await setDoc(doc(db, 'posts', id, 'likes', session?.uid), {
          username: session.user.username,
        });
      }
    }
  };

  /**
   *? 해당 게시물의 좋아요 목록을 가져오는 리스너
   */
  useEffect(
    () =>
      onSnapshot(query(collection(db, 'posts', id, 'likes')), (snapshot) => {
        setLikes(snapshot.docs);
      }),
    [id]
  );

  /**
   *? 본인이 이 게시물을 좋아요를 눌렀는지 확인
   */
  useEffect(() => {
    const idx = likes.findIndex((item) => item.id === session?.uid);
    setHasLiked(idx !== -1);
  }, [likes, session?.uid]);

  return (
    <article
      aria-label="게시물"
      className="my-7 rounded-sm border bg-white shadow-md"
    >
      <header aria-label="게시물 헤더" className="flex items-center p-5">
        <figure className="relative mr-3 h-12 w-12 rounded-full ">
          <Image
            src={profileImg}
            layout="fill"
            className="rounded-full"
            alt="avatar_image"
          />
        </figure>
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5 cursor-pointer" />
      </header>

      <figure
        aria-label="게시물 이미지"
        className="relative h-[480px] before:absolute before:inset-0 before:animate-[pulse_3s_ease-in-out_infinite] before:bg-gray-300 before:content-['']"
      >
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          alt="Post_Image"
          loading="lazy"
        />
      </figure>

      {session && (
        <section
          aria-label="게시물 관련 버튼"
          className="flex items-center justify-between px-4 pt-4"
        >
          <div className="flex items-center space-x-4">
            <HeartIcon
              onClick={toggleLikePost}
              className={`postBtn ${hasLiked && 'fill-current text-red-500'}`}
            />
            <ChatIcon className="postBtn" />
            <PaperAirplaneIcon className="postBtn" />
          </div>
          <BookmarkIcon className="postBtn" />
        </section>
      )}

      {/* 캡션 */}
      <section className="truncate p-5">
        <p className="mb-1 -mt-3 font-bold">
          좋아요 {Number(1557).toLocaleString()}개
        </p>
        <span className="mr-1 font-bold">{username}</span>
        {caption}
      </section>

      {/* 댓글 */}
      <section aria-label="댓글 목록">
        <ul className="ml-4 h-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700">
          {comments?.map((comment) => (
            <li key={comment.id}>
              <article className="mb-3 flex items-center space-x-2">
                <figure className="relative h-8 w-8">
                  <Image
                    src={comment.data().profileImg}
                    className="rounded-full"
                    objectFit="contain"
                    alt="avatar_image"
                    layout="fill"
                  />
                </figure>

                <p className="flex-1 text-sm">
                  <span className="mr-3 font-bold">
                    {comment.data().username}
                  </span>
                  {comment.data().comment}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {session && (
        <section aria-label="댓글 입력창">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex items-center space-x-2 p-4"
          >
            <EmojiHappyIcon className="h-8" />
            <input
              type="text"
              {...register('comment', { required: true })}
              placeholder="댓글 달기..."
              className="form-input flex-1 border-none outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={!watch('comment')?.trim()}
              className="font-semibold text-blue-400 disabled:text-blue-100"
            >
              <svg
                role="status"
                className={`mr-2 h-4 w-4 animate-spin text-gray-200 dark:text-gray-600 ${
                  loading ? 'inline' : 'hidden'
                }`}
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
              {loading ? 'Loading' : 'Post'}
            </button>
          </form>
        </section>
      )}
    </article>
  );
}
