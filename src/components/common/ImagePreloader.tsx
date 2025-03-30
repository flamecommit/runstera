import Head from 'next/head';

export default function ImagePreloader() {
  return (
    <>
      <Head>
        <link rel="preload" href="/images/icons/play.svg" as="image" />
        <link rel="preload" href="/images/icons/lock.svg" as="image" />
        <link rel="preload" href="/images/icons/unlock.svg" as="image" />
        <link rel="preload" href="/images/icons/pause.svg" as="image" />
        <link rel="preload" href="/images/icons/stop.svg" as="image" />
      </Head>
    </>
  );
}
