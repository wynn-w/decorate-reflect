import "reflect-metadata";
import { Controler, Get, Post } from "./decorator";

@Controler("/person")
class Person {
  constructor(options: { name: string }) {}
  @Get("/type")
  getType() {}
  @Post("/demo")
  demo() {}
}
const person = new Person({ name: "xiaoming" });
