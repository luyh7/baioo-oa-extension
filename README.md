# baioo-oa-extension

本插件仅限于http://oa.info使用

- 使用方法：
  - 下载xbrowser.crx，拖动到chrome浏览器窗口里面
  - 参考https://www.cnblogs.com/javalittleman/p/4070772.html ，启用第三方插件
  - 刷新浏览器，大功告成！

- 特性
  - 在 ”我的考勤“ 右侧显示本月工作时长和本周工作时长
  - 在控制台显示每周工作时长
  - 在日历上显示每日工作时长和每周工作时长
  - 在翻页的时候更新时长显示
- Files
  - xbrowser.crx 插件压缩包，拖放到谷歌浏览器即可安装
  - xbrowser.pem 打包私钥
  - xbrowser 项目文件夹
- TODO
  - 现在翻页的时候是监听翻页按钮点击，并在获取数据后延时0.1秒更新页面。有没有更优雅的方式？比如监听页面元素刷新完毕后立刻更新？
