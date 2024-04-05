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
      title: 'Rename column MySQL 5.x',
      sql: [
        "ALTER TABLE `table_name` CHANGE abc xyz VARCHAR(10) NOT NULL, ALGORITHM = INPLACE, LOCK = NONE",
        "ALTER TABLE `table_name` CHANGE `abc` `xyz` VARCHAR(10) NOT NULL, ALGORITHM = INPLACE, LOCK = NONE",
      ],
    },
    {
      title: 'Rename column MySQL 8.x',
      sql: [
        "ALTER TABLE `table_name` RENAME COLUMN abc TO xyz",
        "ALTER TABLE `table_name` RENAME COLUMN `abc` TO `xyz`",
      ],
    },
    {
      title: 'Create table option no quote',
      sql: [
        "CREATE TABLE `table_name` (`id` int) ENGINE InnoDB DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'test comment'",
        "CREATE TABLE `table_name` (`id` INT) ENGINE INNODB DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'test comment'",
      ],
    },
    {
      title: 'Create table option with quote',
      sql: [
        "CREATE TABLE `table_name` (`id` int) ENGINE 'InnoDB' DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' COMMENT 'test comment'",
        "CREATE TABLE `table_name` (`id` INT) ENGINE INNODB DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'test comment'",
      ],
    },
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
