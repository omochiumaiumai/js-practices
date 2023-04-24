"use strict";

const fs = require("fs");
const { Select } = require("enquirer");
const { program } = require("commander");

class myMemo {
  create(filepath) {
    let inputStrings = "";

    process.stdin.on("data", (chunk) => {
      inputStrings += chunk;
    });

    process.stdin.on("end", () => {
      fs.readFile(filepath, "utf8", (error, fileData) => {
        if (error) {
          if (error.code === "ENOENT") {
            console.log(error.message);
            const memos = [{ text: inputStrings.trim() }];
            fs.writeFile(filepath, JSON.stringify(memos), (error) => {
              if (error) throw error;
              console.log("New memo added.");
            });
          } else {
            console.error(`Error: ${error.message}`);
          }
        } else {
          let memos = JSON.parse(fileData);
          memos.push({ text: inputStrings.trim() });
          fs.writeFile(filepath, JSON.stringify(memos), (error) => {
            if (error) throw error;
            console.log("New memo added.");
          });
        }
      });
    });
  }

  list(filepath) {
    fs.readFile(filepath, "utf8", (error, fileData) => {
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

  reference(filepath) {
    fs.readFile(filepath, "utf8", async (error, fileData) => {
      if (error) {
        console.error("Memo does not exist.");
        return;
      }

      const memos = JSON.parse(fileData);

      const prompt = new Select({
        message: "Choose a memo you want to see:",
        choices: memos.map((memo) => memo.text.split("\n")[0]),
      });

      try {
        const answer = await prompt.run();
        const targetMemo = memos.find(
          (memo) => memo.text.split("\n")[0] === answer
        );
        console.log(targetMemo.text);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }
  delete(filepath) {
    fs.readFile(filepath, "utf8", async (error, fileData) => {
      if (error) {
        console.error("Memo does not exist.");
        return;
      }

      const memos = JSON.parse(fileData);

      const prompt = new Select({
        message: "Please select the memo you wish to delete:",
        choices: memos.map((memo) => memo.text.split("\n")[0]),
      });

      try {
        const answer = await prompt.run();
        const targetMemoIndex = memos.findIndex(
          (memo) => memo.text.split("\n")[0] === answer
        );
        if (targetMemoIndex !== -1) {
          memos.splice(targetMemoIndex, 1);
          await fs.promises.writeFile(filepath, JSON.stringify(memos));
          console.log("Memo deleted.");
        } else {
          console.error("Cannot find the specified memo.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
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

const filepath = "memo.json";
if (options.list) {
  memo.list(filepath);
} else if (options.reference) {
  memo.reference(filepath);
} else if (options.delete) {
  memo.delete(filepath);
} else {
  memo.create(filepath);
}
