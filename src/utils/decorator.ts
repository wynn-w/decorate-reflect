import { DecoratorTextEnum, IpcEventEnum } from "./enums";
import type { ClassType, ModulePropsType, RequestType } from "./types";

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

export function Controler<T extends ClassType>(rootPath: string) {
  return (target: ClassType, context?: DecoratorContext): void => {
    Reflect.defineMetadata(DecoratorTextEnum.CONTROL, rootPath, target);
  };
}
export function Injectable(name: string): ClassDecorator {
  return (target: object): void => {
    Reflect.defineMetadata(DecoratorTextEnum.SERVICE, name, target);
  };
}
export function IpcInvoke(eventName: IpcEventEnum) {
  return <T extends any>(target: T, propertyName: string): void => {
    // console.log(111, DecoratorTextEnum.IPC_INVOKE, eventName, target, propertyName); // IPC_INVOKE PING {} ping
    Reflect.defineMetadata(
      DecoratorTextEnum.IPC_INVOKE,
      eventName,
      <Object>target,
      propertyName
    );
  };
}

export function Module(metadata: ModulePropsType) {
  return <T extends ClassType>(target: T, context?: DecoratorContext): void => {
    for (const key in metadata) {
      if (metadata.hasOwnProperty(key)) {
        const prop = metadata[key as keyof typeof metadata];
        Array.isArray(prop) && Reflect.defineMetadata(key, prop, target);
      }
    }
  };
  // return <T extends ClassType>(target: T, context?: DecoratorContext): T => {
  //   return class extends target {
  //     constructor(...args: any[]) {
  //       super();
  //       this.init(props);
  //     }
  //     private init(props: ModulePropsType) {
  //       const {
  //         controllers = [],
  //         providers = [],
  //         injects = [],
  //         imports = [],
  //       } = props;
  //       this.controllers = controllers;
  //       this.providers = providers;
  //       this.injects = injects;
  //       this.imports = imports;
  //     }
  //   };
  // };
}
