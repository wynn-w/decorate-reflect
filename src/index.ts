import "reflect-metadata";
type ClassType<T = any> = new (...args: any[]) => T;
const requestTypeList = ["GET", "POST"] as const;
type RequestType = (typeof requestTypeList)[number];
enum DecoratorTextEnum {
  CONTROL = "CONTROL",
  REQUEST_PATH = "REQUEST_PATH",
  REQUEST_TYPE = "REQUEST_TYPE",
}
// 不带参
function animal(target: ClassType, context?: DecoratorContext) {
  // console.log(target);
  return class extends target {
    code: "" | undefined;
  };
}
// 带参
function animal1<T extends ClassType>(type: string = "") {
  return (target: T, context?: DecoratorContext): T => {
    return class extends target {
      type: string = type;
    };
  };
}
function getter(target: any, key: string): any {
  console.log("getter..", key, target, target[key]); // getter.. name {} undefined
}
function logger(msg: string) {
  return (value: any, key: string): any => {
    return (initialValue: string) => {
      console.log("Hijinking log", msg); // 未执行
      return initialValue;
    };
  };
}
function Controler<T extends ClassType>(rootPath: string) {
  return (target: ClassType, context?: DecoratorContext): void => {
    Reflect.defineMetadata(DecoratorTextEnum.CONTROL, rootPath, target);
  };
}
function Request<T extends ClassType>(type: RequestType) {
  return (path: string): Function => {
    return (target: T, context?: DecoratorContext): void => {
      Reflect.defineMetadata(DecoratorTextEnum.REQUEST_TYPE, type, target);
      Reflect.defineMetadata(DecoratorTextEnum.REQUEST_PATH, path, target);
    };
  };
}
// 失败了，未能在 Provide 中拿到装饰类中方法的 metadata
function Provide() {
  return <T extends ClassType>(target: T, context?: DecoratorContext): any => {
    // 挂载所有方法，做分发器
    // getOwnPropertyDescriptors(target.prototype)
    // {  constructor: {
    //     value: [class Person],
    //     writable: true,
    //     enumerable: false,
    //     configurable: true
    //   },
    //   getType: {
    //     value: [Function: getType],
    //     writable: true,
    //     enumerable: false,
    //     configurable: true
    //   }}
    const methods = Object.getOwnPropertyNames(target.prototype);
    // // console.log(111111111111111, target.prototype, context, methods);
    // methods
    //   .filter((name) => name !== "constructor")
    //   .forEach((name) => {
    //     const descriptor = Object.getOwnPropertyDescriptor(
    //       target.prototype,
    //       name
    //     );
    //     const a = Reflect.getMetadata(
    //       DecoratorTextEnum.REQUEST_TYPE,
    //       target.prototype,
    //       name
    //     );
    //     console.log(name, a);
    //     // if (descriptor && typeof descriptor.value === "function") {
    //     //   const originalMethod = descriptor.value;
    //     //   descriptor.value = function (...args: any[]) {
    //     //     console.log(`Calling method ${name} with args:`, args);
    //     //     const requestTypeMetadata = Reflect.getMetadata(
    //     //       DecoratorTextEnum.REQUEST_TYPE,
    //     //       target.prototype,
    //     //       name
    //     //     );
    //     //     const requestPathMetadata = Reflect.getMetadata(
    //     //       DecoratorTextEnum.REQUEST_PATH,
    //     //       target.prototype,
    //     //       name
    //     //     );
    //     //     console.log(
    //     //       `Request Type for method ${name}:`,
    //     //       requestTypeMetadata
    //     //     );
    //     //     console.log(
    //     //       `Request Path for method ${name}:`,
    //     //       requestPathMetadata
    //     //     );
    //     //     return originalMethod.apply(this, args);
    //     //   };
    //     //   Object.defineProperty(target.prototype, name, descriptor);
    //     // }
    //   });
    // // Object.keys(methods).forEach((key, idx) => {
    // //   //   console.log(idx, key, methods[key]);
    // //   const type = Reflect.getMetadata(
    // //     DecoratorTextEnum.REQUEST_TYPE,
    // //     methods[key]
    // //   );
    // //   if (type) {
    // //     console.log(key, type);
    // //   }
    // // });
    // methods.forEach((methodName) => {
    //   const descriptor = Object.getOwnPropertyDescriptor(
    //     target.prototype,
    //     methodName
    //   );
    //   if (descriptor && typeof descriptor.value === "function") {
    //     const originalMethod = descriptor.value;
    //     descriptor.value = function (...args: any[]) {
    //       console.log(`Calling method ${methodName} with args:`, args);
    //       const requestTypeMetadata = Reflect.getMetadata(
    //         DecoratorTextEnum.REQUEST_TYPE,
    //         target.prototype,
    //         methodName
    //       );
    //       const requestPathMetadata = Reflect.getMetadata(
    //         DecoratorTextEnum.REQUEST_PATH,
    //         target.prototype,
    //         methodName
    //       );
    //       console.log(
    //         `Request Type for method ${methodName}:`,
    //         requestTypeMetadata
    //       );
    //       console.log(
    //         `Request Path for method ${methodName}:`,
    //         requestPathMetadata
    //       );
    //       return originalMethod.apply(this, args);
    //     };
    //     Object.defineProperty(target.prototype, methodName, descriptor);
    //   }
    // });
  };
}
const Get = Request("GET");
const Post = Request("POST");
@Provide()
// @animal1("humanben")
@Controler("/person")
class Person {
  private type: string = "";
  //   @logger("inject")
  //   @getter
  code: number;
  name: string = "init";
  constructor(options: { name: string }) {
    this.name = options.name;
    this.code = 2;
  }
  @Get("/type")
  getType() {
    return this.type;
  }
  @Post("/demo")
  demo() {}
  trust() {}
}
const person = new Person({ name: "xiaoming" });
console.log(person.getType());
console.log("print person.name", person.name);
// console.log(
//   "print ",
//   Object.getOwnPropertyNames(Object.getPrototypeOf(person))
// );
