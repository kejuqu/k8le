# How to run the project

1. Clone the project
2. [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
3. Run `uv run main.py`



WITH 
-- 步骤1: 获取最新商品详情（使用窗口函数优化）
latest_detail AS (
    SELECT 
        plat_goods_id,
        shop_id,
        goods_detail_knowledge,
        goods_size_chart_knowledge,
        ROW_NUMBER() OVER (
            PARTITION BY plat_goods_id, shop_id 
            ORDER BY update_time DESC
        ) AS rn
    FROM goods_detail_info
    WHERE shop_id = '613b09a81477d40018cc23f1' AND platform = 'tb'
),
-- 步骤2: 获取分页商品
paginated_goods AS (
    SELECT 
        kg.id,
        kg.name,
        kg.plat_goods_id,
        kg.tenant_id,
        kg.plat_sku_id,
        kg.goods_type,
        kg.status,
        kg.shop_id  -- 添加shop_id用于连接
    FROM knowledge_goods kg
    WHERE 
        shop_id = '613b09a81477d40018cc23f1' AND platform = 'tb' AND goods_type in (1,2)
    ORDER BY kg.create_time DESC
    LIMIT 10
    OFFSET 1
),
-- 步骤3: 预聚合商品属性（新增 tenant_id 关联条件）
goods_attrs AS (
    SELECT
        ga.goods_id,
        ga.tenant_id,  -- 新增 tenant_id 字段
        json_agg(
            json_build_object(
                'id', ga.id,
                'name', ga.name,
                'value', ga.value,
                'source', ga.source
            )
        ) AS attributes
    FROM goods_attr ga
    WHERE 
        ga.goods_id IN (SELECT id::text FROM paginated_goods)
        AND ga.tenant_id IN (SELECT tenant_id FROM paginated_goods)  -- 新增 tenant_id 条件
    GROUP BY ga.goods_id, ga.tenant_id  -- 按 goods_id + tenant_id 分组
)
-- 步骤4: 组装最终结果（新增 tenant_id 关联条件）
SELECT
    json_agg(
        json_build_object(
            'id', pg.id,
            'name', pg.name,
            'plat_goods_id', pg.plat_goods_id,
            'plat_sku_id', pg.plat_sku_id,
            'goods_type', pg.goods_type,
            'tenant_id', pg.tenant_id,
            'status', pg.status,
            'goods_detail_knowledge', ld.goods_detail_knowledge,
            'goods_size_chart_knowledge', ld.goods_size_chart_knowledge,
            'goods_attrs', COALESCE(ga.attributes, '[]'::json)
        )
    ) AS goods_data
FROM paginated_goods pg
LEFT JOIN (
    SELECT * FROM latest_detail WHERE rn = 1
) ld ON ld.plat_goods_id = pg.plat_goods_id 
    AND ld.shop_id = pg.shop_id
LEFT JOIN goods_attrs ga ON ga.goods_id = pg.id::text 
AND ga.tenant_id = pg.tenant_id