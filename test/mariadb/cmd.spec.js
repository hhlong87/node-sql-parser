const { expect } = require('chai');
const Parser = require('../../src/parser').default

describe('MariaDB Command SQL', () => {
  const parser = new Parser();
  const opt = { database: 'mariadb' }

  function getParsedSql(sql) {
    const ast = parser.astify(sql, opt);
    return parser.sqlify(ast, opt);
  }

  describe('alter', () => {
    const KEYWORDS = ['', 'COLUMN ', 'COLUMN IF NOT EXISTS ', 'IF NOT EXISTS ']
    it(`should support MariaDB alter add column`, () => {
      KEYWORDS.forEach(keyword => {
        expect(getParsedSql(`alter table a add ${keyword}xxx int`))
        .to.equal(`ALTER TABLE \`a\` ADD ${keyword}\`xxx\` INT`);
        expect(getParsedSql(`alter table a add ${keyword}yyy varchar(128)`))
          .to.equal(`ALTER TABLE \`a\` ADD ${keyword}\`yyy\` VARCHAR(128)`);
        expect(getParsedSql(`alter table a add ${keyword}zzz varchar(128), add aaa date`))
          .to.equal(`ALTER TABLE \`a\` ADD ${keyword}\`zzz\` VARCHAR(128), ADD \`aaa\` DATE`);
      })
    });
  })

  const SQL_LIST = [
    {
      title: 'BOOL date type',
      sql: [
        "CREATE TABLE `table_name` (`is_bool` bool) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci",
        "CREATE TABLE `table_name` (`is_bool` BOOL) ENGINE = INNODB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci",
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
