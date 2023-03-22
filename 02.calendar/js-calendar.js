"use strict";

const dayjs = require("dayjs");
const argv = require("minimist")(process.argv.slice(2));

const year = argv.y || dayjs().year();
const month = argv.m || dayjs().month() + 1;

const specified_date = dayjs(`${year}-${month}-01`);

console.log(`     ${specified_date.format("M月 YYYY")}     `);
console.log("日 月 火 水 木 金 土");

const first_day_of_week = specified_date.day();
const last_day_of_month = specified_date.endOf("month").date();

let week = "";
for (let cnt = 0; cnt < first_day_of_week; cnt++) {
  week += "   ";
}
for (let day = 1; day <= last_day_of_month; day++) {
  if (day < 10) {
    week += ` ${day} `;
  } else {
    week += `${day} `;
  }

  if ((first_day_of_week + day) % 7 === 0) {
    console.log(week);
    week = "";
  }
}
if (week.length > 0) {
  console.log(week);
}
