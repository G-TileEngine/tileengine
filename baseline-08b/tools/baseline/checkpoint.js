                                                                    
import { openProject } from "../play-stage/project.js";
import project from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/project.json.js";
import slice from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/catalogue/slice.json.js";
import map from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/maps/map_01JDEM00000000000000000002.json.js";
import stage from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/stages/stage_01JDEM00000000000000000003.json.js";
import army from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/setups/setup_01M7XPE6006A10000000000000.json.js";
import shot from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/setups/setup_01M81X2F2HQQ17D2CWYR72DC9B.json.js";
import hero from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/units/unit_01M81X2BX5ANZS5PWVAFHNCASA.json.js";
import raider from "../../handback/step-06c-checkpoint/r1/checkpoint.tileproj/units/unit_01M81X2PKRZ2NQKAHDV247ZRX3.json.js";
import shopProject from "../../fixtures/shop-stairs/project.json.js";
import shopDown from "../../fixtures/shop-stairs/stages/stage_01JDES00000000000000000001.json.js";
import shopUp from "../../fixtures/shop-stairs/stages/stage_01JDES00000000000000000002.json.js";
export function checkpointFiles()               {
  return { "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDEM00000000000000000002.json": map, "stages/stage_01JDEM00000000000000000003.json": stage, "setups/setup_01M7XPE6006A10000000000000.json": army, "setups/setup_01M81X2F2HQQ17D2CWYR72DC9B.json": shot, "units/unit_01M81X2BX5ANZS5PWVAFHNCASA.json": hero, "units/unit_01M81X2PKRZ2NQKAHDV247ZRX3.json": raider };
}
export const openCheckpoint = ()                                 => openProject(checkpointFiles());
export function shopFiles()               {
  const files = { ...checkpointFiles() }; delete files["stages/stage_01JDEM00000000000000000003.json"];
  return { ...files, "project.json": shopProject, "stages/stage_01JDES00000000000000000001.json": shopDown, "stages/stage_01JDES00000000000000000002.json": shopUp };
}
export const openShop = ()                                 => openProject(shopFiles());
