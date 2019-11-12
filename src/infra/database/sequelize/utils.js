const { pipe, split, map } = require('ramda');

const capitalize = (str = '') => str.replace(/^(.)/, (f) => f.toString().toUpperCase());

function modelNameToSingular(str = '') {
  return {
    autores: 'autor',
    emprestimos: 'emprestimo',
    livros: 'livro',
    usuarios: 'usuario',
  }[str.toLowerCase()];
}

function createParseIncludesFn(SequelizeModels) {
  const parseIncludes = (arr, index) => {
    const currentIndex = typeof index === 'number' ? index : -1;

    if (currentIndex === (arr.length - 1)) {
      return undefined;
    }

    const modelKey = arr[currentIndex + 1];
    const model = SequelizeModels[modelKey];
    const include = parseIncludes(arr, currentIndex + 1);

    return {
      model,
      include,
    };
  };

  return (includePaths = []) => {
    const a = includePaths.map(pipe(split('.'), map(pipe(modelNameToSingular, capitalize))));
    const includes = a.map((b) => parseIncludes(b));
    return includes;
  };
}

module.exports = {
  modelNameToSingular,
  createParseIncludesFn,
};
