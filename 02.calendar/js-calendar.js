"use strict";

const dayjs = require("dayjs");
const argv = require("minimist")(process.argv.slice(2));

const year = argv.y || dayjs().year();
const month = argv.m || dayjs().month() + 1;

const specified_date = dayjs(`${year}-${month}-01`);

console.log(`     ${specified_date.format("M月 YYYY")}     `);
console.log("日 月 火 水 木 金 土");
