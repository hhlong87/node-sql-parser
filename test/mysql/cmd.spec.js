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
        "CREATE TABLE `table_name` (`id` INT) ENGINE INNODB DEFAULT CHARSET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' COMMENT 'test comment'",
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
    {
      title: 'Alter column drop default',
      sql: [
        "ALTER TABLE table_name ALTER COLUMN column_name DROP DEFAULT, algorithm = inplace, lock = none",
        "ALTER TABLE `table_name` ALTER COLUMN `column_name` DROP DEFAULT, ALGORITHM = INPLACE, LOCK = NONE",
      ],
    },
    {
      title: 'Alter column set default string',
      sql: [
        "ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT 'default_name', algorithm = inplace, lock = none",
        "ALTER TABLE `table_name` ALTER COLUMN `column_name` SET DEFAULT 'default_name', ALGORITHM = INPLACE, LOCK = NONE",
      ],
    },
    {
      title: 'Alter column set default NULL',
      sql: [
        "ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT NULL, algorithm = inplace, lock = none",
        "ALTER TABLE `table_name` ALTER COLUMN `column_name` SET DEFAULT NULL, ALGORITHM = INPLACE, LOCK = NONE",
      ],
    },
    {
      title: 'Insert DEFAULT value',
      sql: [
        "INSERT INTO table_name (col1, col2, col3) VALUES (NOW(), NULL, DEFAULT)",
        "INSERT INTO `table_name` (col1, col2, col3) VALUES (NOW(),NULL,DEFAULT)",
      ],
    },
    {
      title: 'Create table partition by range',
      sql: [
        "CREATE TABLE table_name(id int, partition_date date) PARTITION BY RANGE (to_days(`partition_date`)) (PARTITION p20230803 VALUES LESS THAN (739100) ENGINE = InnoDB, PARTITION pmax VALUES LESS THAN MAXVALUE ENGINE = InnoDB) ENGINE = InnoDB",
        "CREATE TABLE `table_name` (`id` INT, `partition_date` DATE) PARTITION BY RANGE (to_days(`partition_date`)) (PARTITION p20230803 VALUES LESS THAN (739100) ENGINE = InnoDB, PARTITION pmax VALUES LESS THAN MAXVALUE ENGINE = InnoDB) ENGINE = InnoDB",
      ],
    },
    {
      title: 'Create table partition by key',
      sql: [
        "CREATE TABLE table_name(id int, amount INT) PARTITION BY KEY (amount) PARTITIONS 5",
        "CREATE TABLE `table_name` (`id` INT, `amount` INT) PARTITION BY KEY (amount) PARTITIONS 5",
      ],
    },
    {
      title: 'Create table bit',
      sql: [
        "CREATE TABLE table_name(amount1 bit null, amount2 bit(10) not null)",
        "CREATE TABLE `table_name` (`amount1` BIT NULL, `amount2` BIT(10) NOT NULL)",
      ],
    },
    {
      title: 'Insert using a keyword as column name',
      sql: [
        "insert into table_name (`key`, col2, `col3`, `DOUBLE`) values ('3333', 1, 2, 1.5)",
        "INSERT INTO `table_name` (`key`, col2, `col3`, `DOUBLE`) VALUES ('3333',1,2,1.5)",
      ],
    },
    {
      title: 'Rename key',
      sql: [
        'ALTER TABLE table_name RENAME KEY `KEY1` TO `KEY2`;',
        'ALTER TABLE `table_name` RENAME KEY `KEY1` TO `KEY2`'
      ]
    },
    {
      title: 'Rename index',
      sql: [
        'ALTER TABLE table_name RENAME INDEX `IDX1` TO `IDX2`;',
        'ALTER TABLE `table_name` RENAME INDEX `IDX1` TO `IDX2`'
      ]
    },
    {
      title: 'Create table with auto increment 0',
      sql: [
        'CREATE TABLE foo (id int) ENGINE = InnoDB AUTO_INCREMENT = 0 COMMENT="Long";',
        'CREATE TABLE `foo` (`id` INT) ENGINE = INNODB AUTO_INCREMENT = 0 COMMENT = \'Long\''
      ]
    },
    {
      title: 'Set default current_date when alter column',
      sql: [
        'ALTER TABLE foo ALTER COLUMN bar SET DEFAULT (current_date), ALGORITHM=INSTANT;',
        'ALTER TABLE `foo` ALTER COLUMN `bar` SET DEFAULT (CURRENT_DATE), ALGORITHM = INSTANT'
      ]
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
