# Plugin

自用 Surge 中国移动组件模块。

这个版本只改一件事：获参重写命中后先进入冷却窗口，冷却时间内后续命中会直接结束，避免中国移动 App 连续请求登录接口时反复执行抓参脚本。

模块地址：

```text
https://raw.githubusercontent.com/anybodyiskiller-cpu/Plugin/main/ChinaMobile.module
```

关键参数：

- `禁用获参重写`：留空表示开启获参重写；填 `#` 表示关闭获参重写。
- `抓参冷却小时`：默认 `24`，表示同一手机号 24 小时内只真正执行一次抓参脚本。
- `禁用PANEL`：填 `#` 关闭 Surge 面板。
- `Scriptable服务模式`：使用 Scriptable 小组件时设为 `1`。

上游脚本来自 `ChinaTelecomOperators/ChinaMobile` 的 prerelease `10086.js`。
