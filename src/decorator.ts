import { DecoratorTextEnum } from "./enums";
import type { ClassType, RequestType } from "./types";

export function Controler<T extends ClassType>(rootPath: string) {
  return (target: ClassType, context?: DecoratorContext): void => {
    Reflect.defineMetadata(DecoratorTextEnum.CONTROL, rootPath, target);
  };
}
export function Request<T extends ClassType>(type: RequestType) {
  return (path: string): Function => {
    return (target: T, context?: DecoratorContext): void => {
      Reflect.defineMetadata(DecoratorTextEnum.REQUEST_TYPE, type, target);
      Reflect.defineMetadata(DecoratorTextEnum.REQUEST_PATH, path, target);
    };
  };
}
export const Get = Request("GET");
export const Post = Request("POST");
