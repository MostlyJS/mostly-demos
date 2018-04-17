import glob from 'glob';
import path from 'path';

// load all models
const modelFiles = glob.sync(path.join(__dirname, './*.model.js'));
export default Object.assign({}, ...modelFiles.map(file => {
  const name = path.basename(file, '.model.js');
  return { name: require(file).default };
}));
