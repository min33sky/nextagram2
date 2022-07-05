import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { db, storage } from '../firebase';

type FormData = {
  content: string;
};

/**
 * 이미지 업로드 모달
 * @param closeModal 모달을 종료하는 함수
 * @returns
 */
function ImageUploadModal({ closeModal }: { closeModal: () => void }) {
  const { data: session } = useSession();
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onValid: SubmitHandler<FormData> = async ({ content }) => {
    if (loading) return;
    if (!content || content.trim() === '') return;
    if (!uploadImage) return;

    setLoading(true);
    /**
     ** 1) DB에 'posts' collection을 생성하고 document를 추가한다.
     ** 2) 생성한 document의 reference로부터 id 값을 가져온다.
     ** 3) Storage에 이미지를 업로드 할 때 id값을 경로로 사용한다.
     ** 4) 이미지의 downloadUrl을 가져와서 기존 document를 update한다.
     */

    const docRef = await addDoc(collection(db, 'posts'), {
      username: session?.user.username,
      caption: content,
      profileImg: session?.user.image,
      createdAt: serverTimestamp(),
    });

    // 이미지 업로드
    const imageRef = ref(
      storage,
      `posts/${docRef.id}/image/${uploadImage?.name}`
    );

    const uploadTask = uploadBytesResumable(imageRef, uploadImage);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadUrl,
        });

        setLoading(false);
        closeModal();
        toast.success('Upload Success...🚀');
      }
    );
  };

  /**
   * 클릭으로 이미지 업로드
   * @param e
   */
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      initUploadImage(e.target.files[0]);
    }
  };

  /**
   * 드래그로 이미지 업로드
   * @param e
   */
  const handleDrogImage = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      initUploadImage(e.dataTransfer.files[0]);
    }
  };

  /**
   * 업로드 할 이미지를 삭제
   */
  const deleteImage = () => {
    //* 메모리에서 이미지 제거
    if (thumbnailImage && uploadImage) {
      URL.revokeObjectURL(thumbnailImage);
      setThumbnailImage(null);
      setUploadImage(null);
    }
  };

  /**
   * 이미지를 업로드 준비 함수
   * @param file
   */
  const initUploadImage = (file: File) => {
    const thumbnail = URL.createObjectURL(file);
    setUploadImage(file);
    setThumbnailImage(thumbnail);
  };

  return (
    <article className="fixed inset-0 z-[100] grid place-items-center">
      <div
        aria-label="백드롭"
        className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50"
        onClick={closeModal}
      ></div>

      <form
        aria-label="이미지 업로드 모달"
        className="z-[9999] flex w-full flex-col items-center space-y-5 rounded-md  bg-white p-10 md:w-[500px]"
        onSubmit={handleSubmit(onValid)}
      >
        {uploadImage && (
          <figure className="relative w-full border">
            <div
              aria-label="업로드 할 이미지 썸네일"
              role={'img'}
              className={`relative h-[400px] w-full cursor-pointer bg-contain bg-center bg-no-repeat text-3xl
              before:absolute before:grid before:h-full before:w-full before:place-items-center before:font-bold before:text-transparent
              before:transition-all before:content-['Delete'] before:hover:text-white before:hover:backdrop-brightness-50 before:hover:delay-200 `}
              style={{
                backgroundImage: `url(${thumbnailImage})`,
              }}
              onClick={deleteImage}
            />
          </figure>
        )}

        {!uploadImage && (
          <label
            aria-label="이미지 업로드하는 공간"
            onDrop={handleDrogImage}
            onDragOver={(e) => e.preventDefault()}
            className="relative flex h-44 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-gray-400 focus:outline-none"
          >
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="font-medium text-gray-600">
                Drop files to Attach, or
                <span className="text-blue-600 underline"> browse</span>
              </span>
            </span>
            <input
              type="file"
              onChange={handleChangeImage}
              className="absolute -z-10 h-full w-full"
            />
          </label>
        )}

        <textarea
          {...register('content', { required: true })}
          className="w-full resize-none rounded-lg border border-slate-300"
          placeholder="describe your image"
        />

        <button
          aria-label="업로드 버튼"
          type="submit"
          className="w-full rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white
            hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-500
          disabled:text-white dark:focus:ring-blue-800"
          disabled={!uploadImage}
        >
          <svg
            role="status"
            className={`mr-2 h-4 w-4 animate-spin text-white ${
              loading ? 'inline' : 'hidden'
            }`}
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          {loading ? 'Loading...' : 'Upload'}
        </button>
      </form>
    </article>
  );
}

export default ImageUploadModal;
