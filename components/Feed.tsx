import { useSession } from 'next-auth/react';
import React from 'react';
import MiniProfile from './MiniProfile';
import Posts from './Posts';
import Stories from './Stories';
import Suggestions from './Suggestions';

function Feed() {
  const { data: session } = useSession();
  return (
    <main
      className={`mx-auto grid grid-cols-1 px-4 md:max-w-3xl
      md:grid-cols-2 md:px-0 xl:max-w-6xl xl:grid-cols-3
      ${!session && '!max-w-3xl !grid-cols-1'}
      `}
    >
      {/* 스토리와 게시물들 */}
      <section className="col-span-2">
        <Stories />
        <Posts />
      </section>

      {/* 미니 프로필과 추천목록 (큰 화면에서만 보임) */}
      {session && (
        <aside className="hidden xl:block">
          <div className="sticky top-16 z-50">
            <MiniProfile />
            <Suggestions />
          </div>
        </aside>
      )}
    </main>
  );
}

export default Feed;
