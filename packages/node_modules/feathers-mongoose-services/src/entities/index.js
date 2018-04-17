import glob from 'glob';
import path from 'path';

// load all entities
const entityFiles = glob.sync(path.join(__dirname, './*.entity.js'));
export default Object.assign({}, ...entityFiles.map(file => {
  const name = path.basename(file, '.entity.js');
  return { name: require(file).default };
}));
