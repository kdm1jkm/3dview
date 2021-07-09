import { Pos3 } from "./commons";

export default class Object3D{
    constructor(
        public points: Pos3[][],
        public color: string
    ){}
}