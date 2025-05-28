import { readFileSync } from 'fs';
import path from 'path';
import { PackageJson as PJ } from 'type-fest';
import packageJson from 'package-json';
import { styleText } from 'node:util';

const pathArg = process.argv[2];
const packageJsonPath = path.resolve(pathArg);
const pj = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as PJ;

console.log('Name: ', pj.name);
console.log('Number of dependencies: ', Object.keys(pj.dependencies ?? {}).length);

let deps = Object.keys(pj.dependencies ?? {})
let devDeps = Object.keys(pj.devDependencies ?? {})

deps.concat(devDeps).forEach(async (packageName) => {
  try {
    let pj = await packageJson(packageName, {fullMetadata: true});
    let own_types = pj.types != undefined
    let at_types: boolean
    if(!own_types) {
      at_types = true;
      try {
        let at = await packageJson("@types/" + packageName);
      } catch (e) {
        at_types = false;
      }
    } else {
      at_types = false
    }
    console.log(styleText((own_types || at_types) ? "green" : "red" ,"%s %s: own_types=%s, @types=%s"), packageName, own_types, at_types);
  } catch (e) {
    console.log("%s: cannot find dependency on npm", packageName);
  }
});