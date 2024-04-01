const { expect } = require('chai');
const Parser = require('../../src/parser').default

describe('Mysql Customize', () => {
  const parser = new Parser();
  const opt = {
    database: 'mysql'
  }

  function getParsedSql(sql, opt) {
    const ast = parser.astify(sql, opt);
    return parser.sqlify(ast, opt);
  }

  const SQL_LIST = [
    {
      title: 'BOOL date type',
      sql: [
        "CREATE TABLE `table_name` (`is_bool` bool) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
        "CREATE TABLE `table_name` (`is_bool` BOOL) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci",
      ],
    },
    {
      title: 'Double Precision date type',
      sql: [
        "CREATE TABLE `table_name` (`double_precision_val` DOUBLE PRECISION)",
        "CREATE TABLE `table_name` (`double_precision_val` DOUBLE PRECISION)",
      ],
    },
    {
      title: 'Double date type',
      sql: [
        "CREATE TABLE `table_name` (`double_val` DOUBLE)",
        "CREATE TABLE `table_name` (`double_val` DOUBLE)",
      ],
    },
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
