import RunDetailPage from '@/components/runs/RunDetailPage';
import { IRun } from '@/types/runs';
import request from '@/utils/request';

interface IParams {
  uuid: string;
}

interface IProps {
  params: Promise<IParams>;
}

export default async function AdminRunningDetailPage({ params }: IProps) {
  const { uuid } = await params;

  const { data } = await request<IRun>({
    method: 'GET',
    url: `/api/runs/${uuid}`,
  });

  return (
    <div>
      <RunDetailPage run={data} />
    </div>
  );
}
