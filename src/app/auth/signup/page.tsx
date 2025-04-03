'use client';

import Button from '@/components/common/Button';
import LoadingComment from '@/components/common/LoadingComment';
import { useGlobalSpinner } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { IUser } from '@/types/user';
import request from '@/utils/request';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function AuthSignupPage() {
  const { data: session, status } = useSession();
  const { setData: setUser } = useUserStore();
  const router = useRouter();

  const [readyToSubmit, setReadyToSubmit] = useState(false);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [locationAgreed, setLocationAgreed] = useState(false);
  const allAgreed = termsAgreed && privacyAgreed && locationAgreed;

  const { setPending } = useGlobalSpinner();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setReadyToSubmit(true);
    }
  }, [status, session]);

  const handleSubmit = async () => {
    if (!session?.user || !allAgreed) return;

    setPending(true);

    const { email, name, image } = session.user;

    try {
      const { data, code } = await request<IUser>({
        method: 'POST',
        url: '/api/user',
        body: { email, name, image },
      });

      if (code === 200) {
        setPending(false);
        setUser(data);
        router.push('/tracker');
      }
    } catch (error) {
      console.error('회원가입 실패', error);
    }
  };

  const handleAllAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTermsAgreed(checked);
    setPrivacyAgreed(checked);
    setLocationAgreed(checked);
  };

  useEffect(() => {
    // 개별 약관 3개가 모두 true면 allAgree도 true
    // (모든 약관 동의 상태 동기화)
    const allChecked = termsAgreed && privacyAgreed && locationAgreed;
    setIsAgreed(allChecked);
  }, [termsAgreed, privacyAgreed, locationAgreed]);

  const [isAgreed, setIsAgreed] = useState(false);

  if (!readyToSubmit) {
    return <LoadingComment>단백질바 한 입 먹는 중</LoadingComment>;
  }

  return (
    <StyledAuthSignupPage>
      <h2>Runstera에 오신 것을 환영합니다!</h2>

      <div className="terms-area">
        <label>
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
          />
          <div className="label-text">
            <span className="required">[필수]</span>
            <a
              href="https://www.runstera.com/policy/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              이용약관
            </a>
            에 동의합니다.
          </div>
        </label>
        <label>
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
          />
          <div className="label-text">
            <span className="required">[필수]</span>
            <a
              href="https://www.runstera.com/policy/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              개인정보처리방침
            </a>
            에 동의합니다.
          </div>
        </label>
        <label>
          <input
            type="checkbox"
            checked={locationAgreed}
            onChange={(e) => setLocationAgreed(e.target.checked)}
          />
          <div className="label-text">
            <span className="required">[필수]</span>
            <a
              href="https://www.runstera.com/policy/location"
              target="_blank"
              rel="noopener noreferrer"
            >
              위치정보 이용
            </a>
            에 동의합니다.
          </div>
        </label>
        <div className="all-agree">
          <label>
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={handleAllAgreeChange}
            />
            <div className="label-text">모든 약관에 동의합니다.</div>
          </label>
        </div>
      </div>

      <div className="btn-area">
        <Button
          color={isAgreed ? 'black' : 'gray'}
          onClick={handleSubmit}
          disabled={!isAgreed}
        >
          동의하고 시작하기
        </Button>
      </div>
    </StyledAuthSignupPage>
  );
}

const StyledAuthSignupPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  max-width: 480px;
  margin: 0 auto;
  h2 {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 48px;
  }
  .terms-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
    input[type='checkbox'] {
      width: 24px;
      height: 24px;
    }
    label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .label-text {
      font-size: 20px;
    }
    .required {
      margin-right: 4px;
    }
    a {
      text-decoration: underline;
      color: #0070f3;
    }
    .all-agree {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
    }
  }
  .btn-area {
    text-align: center;
    margin-top: 36px;
  }
`;
