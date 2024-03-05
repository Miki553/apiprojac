export interface TripGetResponse {
  user_id:  number;
  username: string;
  email:    string;
  password: string;
  avatar:   string;
  type:     string;
  avatar_name : string;
}

export interface ImageGetResponse {
  image_id: number;
  Uid:      number;
  title:    string;
  image:    string;
  score:    number;
  img_name : string;
}