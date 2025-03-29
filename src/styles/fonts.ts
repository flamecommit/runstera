import localFont from 'next/font/local';

export const Pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

export const Roboto = localFont({
  src: [
    {
      path: '../../public/fonts/Roboto_SemiCondensed-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
});
