import React from 'react';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import Header from '../../components/Header';
import Image from 'next/image';

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
};

function SignIn({ providers }: SignInProps) {
  return (
    <>
      <Header />

      <section className="mx-2 flex flex-col items-center justify-center space-y-4  py-2">
        <figure className="relative h-20 w-32">
          <Image
            src="/assets/Instagram_logo.png"
            alt="Logo"
            objectFit="contain"
            layout="fill"
          />
        </figure>

        <p className="">
          This is not a Real App. It is built for educational purpose only
        </p>

        <div>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="rounded-lg bg-blue-500 p-3 text-white"
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context: any) {
  // const { req } = context;
  // const session = await getSession({ req });

  // if (session) {
  //   return {
  //     redirect: { destination: "/" },
  //   };
  // }

  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default SignIn;
