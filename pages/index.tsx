import Head from 'next/head';
import { useRecoilState } from 'recoil';
import Feed from '../components/Feed';
import Header from '../components/Header';
import ImageUploadModal from '../components/ImageUploadModal';
import Portal from '../components/Portal';
import { modalState } from '../store/modalAtom';

export default function Home() {
  const [showModal, setShowModal] = useRecoilState(modalState);

  const closeModal = () => setShowModal(false);

  return (
    <div className="h-screen overflow-y-scroll rounded bg-gray-50 scrollbar-thin scrollbar-thumb-slate-50 hover:scrollbar-thumb-slate-500">
      <Head>
        <title>Nextagram...🚀</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 헤더 */}
      <Header />

      {/* 피드 */}
      <Feed />

      {/* 모달 */}
      {showModal && (
        <Portal>
          <ImageUploadModal closeModal={closeModal} />
        </Portal>
      )}
    </div>
  );
}
