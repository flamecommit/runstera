export interface IRun {
  uuid: string;
  user_uuid: string;
  title: string;
  started_at: string;
  ended_at: string;
  duration: number;
  route: TLatLng[][];
  distance_m: string;
  created_at: string;
  updated_at: string;
}
