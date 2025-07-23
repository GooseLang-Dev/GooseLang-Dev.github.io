---
title: Iconify 图标组件
sidebar_position: 1
id: iconify
---

# Iconify 组件 & macro

## 📘 概述

`iconify` macro是GooseLang默认UI系统中的可复用UI组件，用于通过Iconify图标库渲染SVG图标。它支持静态/动态图标、悬停状态及灵活的尺寸样式调整。该 macro广泛应用于平台的导航栏、按钮、菜单等需要统一可缩放图标的场景。

## 🔗 依赖项

- **Jinja2 macro**：定义于`components/media.html`，通常以`media`形式导入
- **Iconify库**：用于图标渲染和动画（通过`<iconify-icon>`元素实现）
- **CSS类**：使用`icon-default`和`icon-hover`管理状态
- **上下文**：接收图标选择和样式参数

## 📐 数据结构

###  macro定义

```jinja2
{% macro iconify(default, hover, width=20, height=20, style='', extra='') %}
  <iconify-icon ... icon="{{ default }}" ...></iconify-icon>
  {% if hover %}
    <iconify-icon ... icon="{{ hover }}" ...></iconify-icon>
  {% endif %}
{% endmacro %}
```

- **`iconify(default, hover, width, height, style, extra)`**：渲染一个或两个`<iconify-icon>`元素（默认状态+悬停状态）

### 参数

| 参数        | 类型     | 默认值   | 说明                          |
|-------------|----------|----------|-------------------------------|
| `default`   | 字符串   | 必填     | 默认图标名称（如'mdi:trash-can-outline'）|
| `hover`     | 字符串   | 无       | 悬停图标名称（如'line-md:trash'）|
| `width`     | 数字     | 20       | 图标宽度（像素）              |
| `height`    | 数字     | 20       | 图标高度（像素）              |
| `style`     | 字符串   | ''       | 附加CSS样式                   |
| `extra`     | 字符串   | ''       | 附加HTML属性                  |

#### 值处理规则
- 始终渲染`default`图标
- 若提供`hover`参数，则额外渲染带`icon-hover`类的悬停状态图标
- `width`/`height`/`style`同时应用于两个图标
- `extra`作为原始HTML属性注入

#### 渲染结构
- 主图标：带`icon-default`类的`<iconify-icon>`（当设置悬停时）
- 可选悬停图标：带`icon-hover`类的`<iconify-icon>`（当设置悬停时）
- 所有图标设置垂直对齐和外边距样式

## ⚙️ 核心方法与逻辑

###  macro内部机制
- **iconify(default, hover, width, height, style, extra)**：渲染带相应类和属性的图标元素
- **悬停状态**：提供`hover`参数时，CSS切换图标可见性
- **样式处理**：行内样式和类确保图标与文本/UI元素对齐

####  macro展开示例
```jinja2
{{ media.iconify('mdi:trash-can-outline', 'line-md:trash', 24, 24, 'color: red;') }}
```
渲染结果：
```html
<iconify-icon class="icon-default" icon="mdi:trash-can-outline" height="24" width="24" style="vertical-align: middle; margin:0 5px; color: red;"></iconify-icon>
<iconify-icon class="icon-hover" icon="line-md:trash" height="24" width="24" style="vertical-align: middle; margin:0 5px; color: red;"></iconify-icon>
```

## 🧪 使用模式

### 导航栏与菜单
```jinja2
{{ media.iconify('ic:twotone-translate') }}
{{ media.iconify('flag:us-4x3') }}
{{ media.iconify('line-md:light-dark-loop') }}
```
- 用于语言切换、主题切换和用户菜单图标

### Line MD 动态图标
```jinja2
{{ media.iconify('line-md:home-simple', 'line-md:home-simple-twotone') }}
{{ media.iconify('line-md:menu', 'line-md:menu-to-close-alt-transition') }}
{{ media.iconify('line-md:search', 'line-md:search-twotone') }}
{{ media.iconify('line-md:loading-loop') }}
{{ media.iconify('line-md:spinner-twotone') }}
```
- 来自 [Line MD 图标集](https://icon-sets.iconify.design/line-md/) 的动画和动态图标。

### MDI 静态图标
```jinja2
{{ media.iconify('mdi:account') }}
{{ media.iconify('mdi:settings') }}
{{ media.iconify('mdi:bell') }}
{{ media.iconify('mdi:bookmark') }}
{{ media.iconify('mdi:file-document') }}
```
- 来自 [Material Design Icons](https://icon-sets.iconify.design/mdi/) 的静态图标。

### 国旗图标
```jinja2
{{ media.iconify('flag:us-4x3') }}
{{ media.iconify('flag:cn-4x3') }}
{{ media.iconify('flag:gb-4x3') }}
{{ media.iconify('flag:fr-4x3') }}
{{ media.iconify('flag:de-4x3') }}
```
- 来自 [Flag 图标集](https://icon-sets.iconify.design/flag/) 的国旗图标。

### 按钮与操作
```jinja2
{{ media.iconify('mdi:trash-can-outline', 'line-md:trash') }}
{{ media.iconify('line-md:upload', 'line-md:upload-loop') }}
{{ media.iconify('line-md:download', 'line-md:download-loop') }}
```
- 用于上传、下载、删除等操作按钮

### 选项/选择图标
```jinja2
{{ media.iconify('mdi:circle-outline', 'mdi:circle-slice-8', 35, 35) }}
```
- 用于选择题、匹配题的选项状态

## 🧠 代码审查与建议

- **可维护性**： macro结构简洁且可组合。复杂图标状态管理建议使用包装组件或工具类
- **扩展性**：支持多数场景。动态/交互式图标需确保Iconify库为最新版本
- **无障碍访问**：独立按钮图标需添加`aria-label`或`title`属性支持屏幕阅读器
- **国际化**：图标名称无需本地化，但相邻文本需用`_()`包裹翻译
- **用户体验**：支持悬停和尺寸调整，原生不支持聚焦/激活状态——如有需要可扩展
- **一致性**：始终使用`iconify` macro确保UI图标外观和行为统一

## 📝 文件结构

- `packages/ui-default/templates/components/media.html`： macro定义（`iconify`等）
- `packages/ui-default/templates/partials/`、`nav.html`、`footer.html`等： macro使用位置
- 典型导入方式：
  ```jinja2
  {% import 'components/media.html' as media with context %}
  ```

## 📌 注意事项

- **设计选择**：该 macro专为实现最大化可组合性及统一图标使用而设计
- **多租户支持**：适用于全局和空间专属的导航栏及UI
- **自定义样式**：支持通过`style`和`extra`进行高级定制
- **集成性**：与其他 macro和UI组件无缝协作
- **测试建议**： macro已广泛使用且稳定，但新增布局或无障碍需求时需进行上下文测试

---

更多细节请参阅`components/media.html`中的 macro定义及UI系统各模板中的使用实例。