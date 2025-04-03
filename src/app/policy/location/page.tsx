'use client';

import PolicyContent from '@/components/policy/PolicyContent';
import PolicyTitle from '@/components/policy/PolicyTitle';
import PolicyWrapper from '@/components/policy/PolicyWrapper';

export default function PolicyLocationPage() {
  return (
    <PolicyWrapper>
      <PolicyTitle>위치정보 이용 안내</PolicyTitle>
      <PolicyContent>
        최종 수정일: 2025년 4월 3일
        <br />
        <br />
        Runstera(이하 &quot;앱&quot;)는 러닝 경로 기록 및 운동 통계 제공을 위해
        사용자의 위치정보를 수집 및 이용합니다. 본 안내문은 「위치정보의 보호 및
        이용 등에 관한 법률」에 따라 작성되었습니다.
        <br />
        <br />
        1. 수집하는 위치정보의 종류
        <br />
        - 실시간 GPS 정보 (위도, 경도)
        <br />
        - 이동 경로 및 거리
        <br />
        - 러닝 시간 동안의 위치 이력
        <br />
        <br />
        2. 위치정보의 이용 목적
        <br />
        <br />
        - 사용자의 러닝 경로 저장 및 시각화
        <br />
        - 거리, 속도, 페이스 등 운동 통계 산출
        <br />
        - 월별/주별 누적 기록 제공
        <br />
        - 목표 달성 피드백 제공 등 맞춤형 서비스 제공
        <br />
        <br />
        3. 위치정보 수집 방식
        <br />
        - 앱 실행 중 사용자의 명시적 동의 하에 GPS 정보를 수집합니다.
        <br />
        - 선택적으로 백그라운드에서 위치 정보를 수집할 수 있습니다. (백그라운드
        수집 시 별도의 동의 절차 제공)
        <br />
        - Android 운영체제의 위치 권한 설정에 따라, 앱의 위치정보 수집이 제한될
        수 있습니다.
        <br />
        <br />
        4. 보유 및 이용 기간
        <br />
        - 위치정보는 사용자가 앱 내 기록 저장을 선택한 경우에만 저장되며, 사용자
        요청 시 언제든지 삭제할 수 있습니다.
        <br />
        - 탈퇴 시 모든 위치정보 기록은 관련 법령에 따라 안전하게 파기됩니다.
        <br />
        <br />
        5. 제3자 제공
        <br />
        - Runstera는 사용자의 위치정보를 외부 제3자에게 제공하지 않으며,
        사용자의 명시적인 동의 없이 위치정보를 마케팅 등의 용도로 사용하지
        않습니다.
        <br />
        <br />
        6. 동의 거부 권리 및 불이익
        <br />
        - 이용자는 위치정보 제공에 동의하지 않을 수 있습니다.
        <br />
        - 다만, 위치정보를 제공하지 않을 경우 앱의 핵심 기능(러닝 경로 기록 등)
        이용에 제한이 있을 수 있습니다.
        <br />
        <br />
        7. 문의처
        <br />
        앱 운영자: Runstera 팀<br />
        이메일: [runstera0329@gmail.com]
      </PolicyContent>
    </PolicyWrapper>
  );
}
