import React, { useRef } from 'react';

function ImageUploadModal({ closeModal }: { closeModal: () => void }) {
  const filePickerRef = useRef(null);

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = URL.createObjectURL(e.target.files[0]);
      console.log(e.target.files[0]);
      console.log(image);
    }
  };

  return (
    <article className="fixed inset-0 z-[100] grid place-items-center">
      <div
        aria-label="백드롭"
        className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50"
        onClick={closeModal}
      ></div>

      <form className="z-[9999] h-fit w-52 bg-white">
        {/* 이미지가 있을때만 보여주기 */}
        <figure>
          <p>이미지 자리</p>
        </figure>

        {/* 이미지 없을때 보여주기 */}
        <label
          onDrag={() => {}}
          onDragEnter={() => {}}
          className="relative flex h-32 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-gray-400 focus:outline-none"
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
              <span className="text-blue-600 underline">browse</span>
            </span>
          </span>
          <input
            type="file"
            ref={filePickerRef}
            onChange={addImageToPost}
            className="absolute -z-10 h-full w-full"
          />
        </label>

        <div>
          <button>UPLOAD</button>
        </div>
      </form>
    </article>
  );
}

export default ImageUploadModal;
