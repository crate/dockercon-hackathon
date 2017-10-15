import colors from 'colors';

const getDateStr = () => {
  const date = new Date();
  return date.toLocaleString();
};

export default class Logger {
  static log(...message) {
    console.log(colors.green('LOG') + ' | ' + getDateStr() + ' |', ...message);
  }
  static error(...message) {
    console.log(colors.red('ERROR') + ' | ' + getDateStr() + ' |', ...message);
  }
  static info(...message) {
    console.log(colors.blue('INFO') + ' | ' + getDateStr() + ' |', ...message);
  }
}
