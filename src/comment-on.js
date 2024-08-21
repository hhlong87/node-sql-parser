import { hasVal, toUpper, literalToSQL } from './util'
import { columnRefToSQL } from './column'

function commentOnColumnToSQL(stmt) {
  const { column, value, keyword } = stmt
  const result = [
    'COMMENT ON',
    toUpper(keyword),
    columnRefToSQL(column),
    'IS',
    literalToSQL(value),
  ]
  return result.filter(hasVal).join(' ')
}

function commentOnToSQL(stmt) {
  /* eslint-disable no-console */
  const { keyword = 'column' } = stmt
  switch (keyword.toLowerCase()) {
    case 'column':
      return commentOnColumnToSQL(stmt)
  }
}

export {
  commentOnToSQL,
}
