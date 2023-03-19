declare module "cloudinary" {
  export interface Config {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }
  export function config(options: Config): void;
  export namespace v2 {
    export namespace uploader {
      export namespace express {
        export const multer: any;
      }
    }
  }
}
