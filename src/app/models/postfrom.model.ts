// post.model.ts ya component ke upar
export interface PostModel {
  title: string;
  busoperator: string;
  routefrom: string;
  routeto: string;
  rating: number;
  highlight: string;
  pitshops: string[];
  fullstory: string;
  image: string[];
  authorId: string;
  logindetails: string;
  postUUID?:string;
}

