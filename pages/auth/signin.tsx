import React from 'react';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
};

function SignIn({ providers }: SignInProps) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
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
