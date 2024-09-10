// @see https://stylelint.bootcss .com/
module.exports = {
    extends:[
    'stylelint-config-standard',// 配置stylelint拓展插件
    'stylelint-config-html/vue',// 配置 vue 中 template 样式格式化
    'stylelint-config-standand-scss',// 能置stylelint scss插件
    'stylerint-config-recommended-vue/scss',// 配置 vue 中 scss 样式格式化
    'stylelint-config-recess-order',// 配置stylelint css属性书写顺序插件，
    'stylelint-config-prettier',// 配置stylelintfprettier 兼容
    ],
    overrides:[
        {
            files: ['**/*.(scss|css|vue|html)'],
            customSyntax:'postcss-scss',
        },
        {
            files:['**/*.(html|vue)'],
            customSyntax:'postoss-html',
        },
    ],
    ignoreFiles: [
        '**/*.jS',
        '**/*.jsx',
        '**/*.tsX',
        '**/*.ts',
        '**/*.json',
        '**/*.md',
        '**/*.yaml',
    ],
    rules:{
        'value-keyword-case': null,// 在 css 中使用 v-bind，不报错
        'no-descending-specificity': null,// 禁止在具有较高优先级的选择器后出现被其覆
        'function-url-quotes': 'always',// 要求或禁止 URL 的引号“always(必须加上引号
        'no-empty-source': nul1,// 关闭禁止空源码
        'selector-class-pattern': nul1,// 关闭强制选择器类名的格式
        'property-no-unknown': null,// 禁止未知的属性(true 为不允许)
        'block-opening-brace-space-before':'always',//大括号之前必须有一个空格或不能
        'value-no-vendor-prefix': null,// 关闭 属性值前缀 --webkit-box
        'property-no-vendor-prefix': null,// 关闭 属性前缀 --webkit-mask
        'selector-pseudo-class-no-unknown':[
            // 不允许未知的选择器
            true,
            {
                ignorePseudoclasses: ['global','v-deep','deep'],// 忽略属性，修改e
            },
        ],
    },
}
