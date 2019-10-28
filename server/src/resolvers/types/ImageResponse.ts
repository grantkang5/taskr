import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ImageResponse {
  @Field()
  public_id: string;
  version: number;
  signature: string;
  @Field()
  width: number;
  @Field()
  height: number;
  @Field()
  format: string;
  @Field()
  created_at: string;
  tags: string[];
  @Field()
  bytes: number;
  type: string;
  etag: string;
  placeholder: string;
  @Field()
  url: string;
  @Field()
  secure_url: string;
  requester_ip: string;
  @Field()
  original_filename: string;
}