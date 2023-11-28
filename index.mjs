#!/usr/bin/env node

import inquirer from 'inquirer';
import degit from 'degit';

async function main() {
  const answers = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'path',
        message: 'What folder would you like to create the files in?',
        default: 'my-new-project',
      },
    ]);

  try {
    await clone(answers.path, {});
  } catch (err) {
    if (err && typeof err.message === "string" && err.message.includes('destination directory is not empty')) {
      const shouldOverwriteAnswer = await inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'The destination directory is not empty. Would you like to overwrite it?',
            default: false,
          },
        ]);
      if (shouldOverwriteAnswer.overwrite) {
        await clone(answers.path, { force: true });
      } else {
        console.log('Aborting.');
        process.exit(1);
      }
    } else {
      throw err;
    }

    console.log('Done. Have fun!');
    console.log('Be sure to check out the documentation:');
    console.log('  https://n2d4.github.io/frontend-starter/');
  }
}
main();


async function clone(path, options) {
  const emitter = degit('N2D4/frontend-starter', {
    verbose: process.env.NODE_ENV === 'development',
    ...options,
  });
  emitter.on('info', info => {
    console.log(info.message);
  });

  await emitter.clone(path);
}
