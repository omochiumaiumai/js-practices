"use strict";

const fs = require("fs");
const enquirer = require("enquirer");
const { program } = require("commander");

class myMemo {
  create() {
    let inputStrings = "";

    process.stdin.on("data", (chunk) => {
      inputStrings += chunk;
    });

    process.stdin.on("end", () => {
      fs.readFile("memo.json", "utf8", (error, fileData) => {
        if (error) {
          const memos = [{ text: inputStrings.trim() }];
          fs.writeFile("memo.json", JSON.stringify(memos), (error) => {
            if (error) throw error;
            console.log("New memo added.");
          });
        } else {
          let memos = JSON.parse(fileData);
          memos.push({ text: inputStrings.trim() });
          fs.writeFile("memo.json", JSON.stringify(memos), (error) => {
            if (error) throw error;
            console.log("New memo added.");
          });
        }
      });
    });
  }

  list() {
    fs.readFile("memo.json", "utf8", (error, fileData) => {
      if (error) {
        console.error("Memo does not exist.");
        return;
      }

      const memos = JSON.parse(fileData);

      memos.forEach((memo) => {
        console.log(memo.text.split("\n")[0]);
      });
    });
  }

  reference() {
    fs.readFile("memo.json", "utf8", (error, fileData) => {
      if (error) {
        console.error("Memo does not exist.");
        return;
      }

      const memos = JSON.parse(fileData);

      const prompt = new enquirer.Select({
        message: "Choose a memo you want to see:",
        choices: memos.map((memo) => memo.text.split("\n")[0]),
      });

      prompt
        .run()
        .then((answer) => {
          const targetMemo = memos.find(
            (memo) => memo.text.split("\n")[0] === answer
          );
          console.log(targetMemo.text);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    });
  }
  delete() {
    fs.readFile("memo.json", "utf8", (error, fileData) => {
      if (error) {
        console.error("Memo does not exist.");
        return;
      }

      const memos = JSON.parse(fileData);

      const prompt = new enquirer.Select({
        message: "Please select the memo you wish to delete:",
        choices: memos.map((memo) => memo.text.split("\n")[0]),
      });

      prompt
        .run()
        .then((answer) => {
          const targetMemoIndex = memos.findIndex(
            (memo) => memo.text.split("\n")[0] === answer
          );
          if (targetMemoIndex !== -1) {
            memos.splice(targetMemoIndex, 1);
            fs.writeFile("memo.json", JSON.stringify(memos), (error) => {
              if (error) throw error;
              console.log("Memo deleted.");
            });
          } else {
            console.error("Cannot find the specified memo.");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    });
  }
}

const memo = new myMemo();

program
  .option("-l, --list", "Display a list of memos")
  .option("-r, --reference", "Refer to the memo")
  .option("-d, --delete", "Delete a memo")
  .parse(process.argv);

const options = program.opts();

if (options.list) {
  memo.list();
} else if (options.reference) {
  memo.reference();
} else if (options.delete) {
  memo.delete();
} else {
  memo.create();
}
