import React from 'react';
import Posts from './Posts';
import Stories from './Stories';

function Feed() {
  return (
    <main className="mx-auto grid grid-cols-1 px-4 md:max-w-3xl md:grid-cols-2 md:px-0 xl:max-w-6xl xl:grid-cols-3">
      {/* 스토리와 게시물들 */}
      <section className="col-span-2">
        <Stories />
        <Posts />
      </section>

      {/* 미니 프로필과 추천목록 (큰 화면에서만 보임) */}
      <aside></aside>
    </main>
  );
}

export default Feed;
