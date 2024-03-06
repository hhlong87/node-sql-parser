const { expect } = require('chai');
const Parser = require('../../src/parser').default

describe('Postgres Customize', () => {
  const parser = new Parser();
  const opt = {
    database: 'postgresql'
  }

  function getParsedSql(sql, opt) {
    const ast = parser.astify(sql, opt);
    return parser.sqlify(ast, opt);
  }

  const SQL_LIST = [
    {
      title: 'alter table alter column',
      sql: [
        'ALTER TABLE address ALTER COLUMN name TYPE VARCHAR(10), ALTER COLUMN age TYPE BOOLEAN;',
        'ALTER TABLE "address" ALTER COLUMN name TYPE VARCHAR(10), ALTER COLUMN age TYPE BOOLEAN'
      ]
    }
  ]

  function neatlyNestTestedSQL(sqlList) {
    sqlList.forEach(sqlInfo => {
      const {title, sql} = sqlInfo
      it(`should support ${title}`, () => {
        expect(getParsedSql(sql[0], opt)).to.equal(sql[1])
      })
    })
  }

  neatlyNestTestedSQL(SQL_LIST)
})
