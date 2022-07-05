import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';
import React from 'react';
import { IPost } from './Posts';
import { SubmitHandler, useForm } from 'react-hook-form';

type Formdata = {
  comment: string;
};

export default function Post({
  id,
  caption,
  image,
  profileImg,
  username,
}: IPost) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Formdata>();

  const onValid: SubmitHandler<Formdata> = ({ comment }) => {
    console.log('댓글: ', comment);
    setValue('comment', '');
  };

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

      <section
        aria-label="각종 버튼 영역"
        className="flex items-center justify-between px-4 pt-4"
      >
        <div className="flex items-center space-x-4">
          <HeartIcon className="postBtn fill-current text-red-500" />
          <ChatIcon className="postBtn" />
          <PaperAirplaneIcon className="postBtn" />
        </div>
        <BookmarkIcon className="postBtn" />
      </section>

      {/* 캡션 */}
      <section className="truncate p-5">
        <p className="mb-1 -mt-3 font-bold">
          좋아요 {Number(1557).toLocaleString()}개
        </p>
        <span className="mr-1 font-bold">{username}</span>
        {caption}
      </section>

      <section aria-label="댓글 목록">
        <ul className="ml-4 h-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700">
          {Array.from({ length: 5 }).map((_, idx) => (
            <li key={idx}>
              <article className="mb-3 flex items-center space-x-2">
                <figure className="relative h-8 w-8">
                  <Image
                    src={profileImg}
                    className="rounded-full"
                    objectFit="contain"
                    alt="avatar_image"
                    layout="fill"
                  />
                </figure>

                <p className="flex-1 text-sm">
                  <span className="mr-3 font-bold">{username}</span>
                  댓글입니다......🚀
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

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
            게시
          </button>
        </form>
      </section>
    </article>
  );
}
