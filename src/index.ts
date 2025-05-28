import { readFileSync } from 'fs';
import path from 'path';
import { PackageJson as PJ } from 'type-fest';
import packageJson from 'package-json';

const pathArg = process.argv[2];
const packageJsonPath = path.resolve(pathArg);
const pj = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as PJ;

console.log('Name: ', pj.name);
console.log('Number of dependencies: ', Object.keys(pj.dependencies ?? {}).length);

Object.keys(pj.dependencies ?? {}).forEach(async (packageName) => {
  try {
    let pj = await packageJson(packageName, {fullMetadata: true});
    let own_types = pj.types
    console.log("%s: own_types=%s", packageName, own_types != undefined);
  } catch (e) {
    console.log("%s: cannot find dependency on npm", packageName);
  }
});