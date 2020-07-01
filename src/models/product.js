// 商品的的模型

var model = {}

// 忽略加载
// model._disable = true

model.init = function(sequelize, S) {
  const Model = S.Model
  class Product extends Model {}

  // 定义商品的ORM
  Product.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        comment: 'ID',
        // uuid
        // type: S.UUID,
        // defaultValue: S.UUIDV1,
        // 自增长
        type: S.INTEGER,
        autoIncrement: true,
      },
      // 自动生成的时间戳
      // createdAt: S.DATE,
      // updatedAt: S.DATE,

      name: { type: S.STRING, comment: '名称' },
      imgUrl: { type: S.STRING, comment: '图片url' },
      sku: { type: S.STRING, comment: 'sku' },
      createdBy: { type: S.STRING, comment: '创建人' },
      updateBy: { type: S.STRING, comment: '修改人' },
      remark: { type: S.TEXT, comment: '备注' },
    },

    {
      sequelize,
      tableName: 'product', // 表名
      paranoid: true, // 不删除数据库条目,但将新添加的属性deletedAt设置为当前日期(删除完成时).
      comment: '商品表',
    },
  )
  return Product
}

module.exports = model
